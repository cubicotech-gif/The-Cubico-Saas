/**
 * PayPal webhook handler.
 *
 * Subscribe in PayPal developer dashboard → Apps & Credentials → your app →
 * Webhooks → Add Webhook. Point to https://YOUR_DOMAIN/api/paypal/webhook and
 * subscribe to at least:
 *   - PAYMENT.CAPTURE.COMPLETED   (back-up confirmation; idempotent)
 *   - PAYMENT.CAPTURE.REFUNDED
 *   - PAYMENT.CAPTURE.REVERSED
 *   - PAYMENT.CAPTURE.DENIED
 *   - CUSTOMER.DISPUTE.CREATED
 *   - CUSTOMER.DISPUTE.RESOLVED
 *
 * Copy the Webhook ID from the dashboard into env as PAYPAL_WEBHOOK_ID.
 */
import { NextResponse } from 'next/server';
import { verifyPayPalWebhook } from '@/lib/paypal';
import { createServiceClient } from '@/lib/supabase-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource_type?: string;
  resource?: {
    id?: string;
    status?: string;
    amount?: { value?: string; currency_code?: string };
    custom_id?: string;
    invoice_id?: string;
    supplementary_data?: {
      related_ids?: { order_id?: string; capture_id?: string };
    };
    // Dispute-specific
    dispute_id?: string;
    disputed_transactions?: Array<{
      seller_transaction_id?: string;
    }>;
    reason?: string;
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  const headerRecord: Record<string, string | null> = {};
  request.headers.forEach((value, key) => {
    headerRecord[key.toLowerCase()] = value;
  });

  let verified = false;
  try {
    verified = await verifyPayPalWebhook({ headers: headerRecord, rawBody });
  } catch (err) {
    console.error('[paypal-webhook] verification threw:', err);
    return NextResponse.json({ error: 'verification_unavailable' }, { status: 503 });
  }
  if (!verified) {
    console.warn('[paypal-webhook] signature verification failed');
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  let event: PayPalWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PayPalWebhookEvent;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    console.error('[paypal-webhook] Supabase service client unavailable');
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }

  // The capture id PayPal refers to varies by event type. For capture-level
  // events it's `resource.id`; for refunds/reversals, PayPal puts the original
  // capture in `resource.supplementary_data.related_ids.capture_id`.
  const captureId =
    event.resource?.supplementary_data?.related_ids?.capture_id ||
    event.resource?.id ||
    null;

  try {
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // No-op: the synchronous capture-order route already marked the order
        // paid. We just log for audit purposes.
        await appendOrderNote(supabase, captureId, `[webhook] capture completed event ${event.id}`);
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
      case 'PAYMENT.CAPTURE.REVERSED':
        await handleReversal(supabase, event, captureId);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        await handleDenied(supabase, event, captureId);
        break;

      case 'CUSTOMER.DISPUTE.CREATED':
      case 'CUSTOMER.DISPUTE.UPDATED':
      case 'CUSTOMER.DISPUTE.RESOLVED':
        await handleDispute(supabase, event);
        break;

      default:
        console.log('[paypal-webhook] unhandled event_type:', event.event_type);
    }
  } catch (err) {
    console.error('[paypal-webhook] handler error:', err);
    // Respond 200 anyway — PayPal retries on non-2xx, and we've logged. If we
    // returned 500 here PayPal would hammer us while the underlying issue
    // (e.g. DB outage) persists. Better to fix forward.
  }

  return NextResponse.json({ received: true });
}

async function findOrderIdByCapture(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  captureId: string | null,
) {
  if (!captureId) return null;
  const { data } = await supabase
    .from('transactions')
    .select('order_id')
    .eq('transaction_id', captureId)
    .maybeSingle();
  return data?.order_id || null;
}

async function appendOrderNote(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  captureId: string | null,
  note: string,
) {
  const orderId = await findOrderIdByCapture(supabase, captureId);
  if (!orderId) return;
  const { data: order } = await supabase
    .from('orders')
    .select('extra_notes')
    .eq('id', orderId)
    .maybeSingle();
  await supabase
    .from('orders')
    .update({
      extra_notes: `${order?.extra_notes || ''}\n${note}`.trim(),
    })
    .eq('id', orderId);
}

async function handleReversal(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  event: PayPalWebhookEvent,
  captureId: string | null,
) {
  const orderId = await findOrderIdByCapture(supabase, captureId);
  if (!orderId) {
    console.warn('[paypal-webhook] reversal for unknown capture:', captureId);
    return;
  }

  const reversalAmount =
    event.resource?.amount?.value || '?';
  const reversalCurrency = event.resource?.amount?.currency_code || '';
  const kind = event.event_type === 'PAYMENT.CAPTURE.REFUNDED' ? 'refund' : 'reversal';
  const note = `[PayPal] ${kind} ${reversalAmount} ${reversalCurrency} (event=${event.id}, capture=${captureId})`;

  await supabase
    .from('orders')
    .update({
      is_paid: false,
      status: 'refunded',
    })
    .eq('id', orderId);

  await supabase
    .from('transactions')
    .update({ status: kind === 'refund' ? 'refunded' : 'reversed' })
    .eq('transaction_id', captureId || '');

  const { data: order } = await supabase
    .from('orders')
    .select('extra_notes')
    .eq('id', orderId)
    .maybeSingle();

  await supabase
    .from('orders')
    .update({
      extra_notes: `${order?.extra_notes || ''}\n${note}`.trim(),
    })
    .eq('id', orderId);
}

async function handleDenied(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  event: PayPalWebhookEvent,
  captureId: string | null,
) {
  const orderId = await findOrderIdByCapture(supabase, captureId);
  if (!orderId) return;
  await supabase
    .from('orders')
    .update({ is_paid: false, status: 'payment_failed' })
    .eq('id', orderId);
  await supabase
    .from('transactions')
    .update({ status: 'denied' })
    .eq('transaction_id', captureId || '');
  await appendOrderNote(
    supabase,
    captureId,
    `[PayPal] capture denied (event=${event.id})`,
  );
}

async function handleDispute(
  supabase: NonNullable<ReturnType<typeof createServiceClient>>,
  event: PayPalWebhookEvent,
) {
  const sellerTxnId = event.resource?.disputed_transactions?.[0]?.seller_transaction_id;
  if (!sellerTxnId) return;
  const orderId = await findOrderIdByCapture(supabase, sellerTxnId);
  if (!orderId) return;
  const reason = event.resource?.reason || 'unspecified';
  const note = `[PayPal] dispute ${event.event_type} reason=${reason} (event=${event.id})`;
  const { data: order } = await supabase
    .from('orders')
    .select('extra_notes')
    .eq('id', orderId)
    .maybeSingle();
  await supabase
    .from('orders')
    .update({
      extra_notes: `${order?.extra_notes || ''}\n${note}`.trim(),
    })
    .eq('id', orderId);
}
