/**
 * Payment Module — PayPal integration
 *
 * The actual PayPal REST calls live on the server in /src/lib/paypal.ts and
 * are exposed through API routes at /api/paypal/create-order and
 * /api/paypal/capture-order. This file only exports the shared types used by
 * the payment UI and a small helper to load the PayPal JS SDK on demand.
 */

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  paidAt: string;
  method: string;
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

export interface CaptureResponse extends PaymentResult {
  status: string;
  amount: string;
  currency: string;
  payerEmail: string | null;
  payerName: string | null;
}

/** Load the PayPal JS SDK once per page. */
export function loadPayPalSdk(clientId: string, currency = 'USD'): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const w = window as unknown as { paypal?: unknown };
  if (w.paypal) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-cubico-paypal-sdk]',
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('PayPal SDK failed to load')));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const params = new URLSearchParams({
      'client-id': clientId,
      currency,
      intent: 'capture',
      components: 'buttons',
    });
    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.async = true;
    script.dataset.cubicoPaypalSdk = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('PayPal SDK failed to load'));
    document.head.appendChild(script);
  });
}
