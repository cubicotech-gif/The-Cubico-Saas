import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { capturePayPalOrder, isPayPalConfigured } from '@/lib/paypal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: 'PayPal is not configured on the server.' },
      { status: 503 },
    );
  }

  let body: { orderId?: string; paypalOrderId?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { orderId: internalOrderId, paypalOrderId } = body;
  if (!internalOrderId || !paypalOrderId) {
    return NextResponse.json(
      { error: 'Missing orderId or paypalOrderId' },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: order, error: lookupErr } = await supabase
    .from('orders')
    .select('id, customer_id, price_amount, price_currency, is_paid, extra_notes')
    .eq('id', internalOrderId)
    .eq('customer_id', user.id)
    .single();

  if (lookupErr || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.is_paid) {
    return NextResponse.json({ error: 'Order already paid' }, { status: 409 });
  }

  // Idempotency guard: if a transaction already exists for this PayPal order,
  // return the original result instead of calling capture a second time. Stops
  // double-clicks from producing duplicate captures at PayPal.
  const { data: existingTxn } = await supabase
    .from('transactions')
    .select('transaction_id, amount, currency, status')
    .eq('order_id', order.id)
    .eq('method', 'paypal')
    .maybeSingle();
  if (existingTxn?.transaction_id) {
    return NextResponse.json({
      success: true,
      transactionId: existingTxn.transaction_id,
      paidAt: new Date().toISOString(),
      method: 'paypal',
      status: existingTxn.status || 'completed',
      amount: String(existingTxn.amount),
      currency: existingTxn.currency,
      payerEmail: null,
      payerName: null,
      idempotent: true,
    });
  }

  try {
    const capture = await capturePayPalOrder(paypalOrderId);

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: `Payment not completed (status: ${capture.status})` },
        { status: 402 },
      );
    }

    const paidAt = new Date().toISOString();

    // Record transaction. The transactions table stores amount in whole units
    // matching the order's currency; we keep that convention and also stash
    // PayPal-specific metadata (capture id, usd amount) in extra_notes.
    const { error: txErr } = await supabase.from('transactions').insert({
      order_id: order.id,
      customer_id: user.id,
      amount: order.price_amount,
      currency: order.price_currency || 'PKR',
      method: 'paypal',
      transaction_id: capture.captureId,
      status: 'completed',
    });

    if (txErr) {
      // Not fatal — the capture already succeeded at PayPal. Log and continue.
      console.error('Failed to insert transaction row:', txErr.message);
    }

    const note = `[PayPal] capture=${capture.captureId} amount=${capture.amount} ${capture.currency} payer=${capture.payerEmail || 'n/a'}`;
    const { error: updErr } = await supabase
      .from('orders')
      .update({
        is_paid: true,
        status: 'completed',
        extra_notes: `${order.extra_notes || ''}\n${note}`.trim(),
      })
      .eq('id', order.id)
      .eq('customer_id', user.id);

    if (updErr) {
      return NextResponse.json(
        { error: `Payment captured but order update failed: ${updErr.message}`, capture },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: capture.captureId,
      paidAt,
      method: 'paypal',
      status: capture.status,
      amount: capture.amount,
      currency: capture.currency,
      payerEmail: capture.payerEmail,
      payerName: capture.payerName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
