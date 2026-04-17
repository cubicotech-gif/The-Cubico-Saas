import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createPayPalOrder, isPayPalConfigured } from '@/lib/paypal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PayPal doesn't support PKR. If an order is priced in PKR we convert to USD
// using a configurable rate (falling back to a sensible default).
function pkrToUsd(amountPkr: number): number {
  const rate = Number(process.env.PKR_TO_USD_RATE) || 280;
  const usd = amountPkr / rate;
  return Math.max(1, Math.round(usd * 100) / 100);
}

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { error: 'PayPal is not configured on the server.' },
      { status: 503 },
    );
  }

  let body: { orderId?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const internalOrderId = body.orderId;
  if (!internalOrderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, customer_id, price_amount, price_currency, is_paid, business_name')
    .eq('id', internalOrderId)
    .eq('customer_id', user.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.is_paid) {
    return NextResponse.json({ error: 'Order already paid' }, { status: 409 });
  }
  if (!order.price_amount || order.price_amount <= 0) {
    return NextResponse.json({ error: 'Order has no price set' }, { status: 400 });
  }

  const sourceCurrency = (order.price_currency || 'USD').toUpperCase();
  const amountUsd =
    sourceCurrency === 'PKR' ? pkrToUsd(order.price_amount) : order.price_amount;

  try {
    const paypalOrder = await createPayPalOrder({
      amount: amountUsd,
      currency: 'USD',
      referenceId: order.id,
      description: `Cubico website order - ${order.business_name || order.id}`,
    });
    return NextResponse.json({
      id: paypalOrder.id,
      status: paypalOrder.status,
      amount: amountUsd,
      currency: 'USD',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
