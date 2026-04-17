/**
 * PayPal REST client — server-only.
 *
 * Uses PayPal's Orders v2 REST API directly with fetch, so no extra npm
 * dependency is required. The access-token handshake happens once per call;
 * tokens are short-lived and PayPal accepts many requests on a single token,
 * but for simplicity we fetch a fresh one each time.
 *
 * Configure via environment variables:
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_ENVIRONMENT       "sandbox" (default) | "live"
 *
 * Expose the client ID to the browser via NEXT_PUBLIC_PAYPAL_CLIENT_ID so the
 * PayPal JS SDK can be loaded in the PaymentModal.
 */

type PayPalEnvironment = 'sandbox' | 'live';

function getEnv(): PayPalEnvironment {
  const env = (process.env.PAYPAL_ENVIRONMENT || 'sandbox').toLowerCase();
  return env === 'live' ? 'live' : 'sandbox';
}

export function paypalApiBase(): string {
  return getEnv() === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

export function getPayPalCredentials(): { clientId: string; secret: string } {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const secret = process.env.PAYPAL_CLIENT_SECRET || '';
  return { clientId, secret };
}

export function isPayPalConfigured(): boolean {
  const { clientId, secret } = getPayPalCredentials();
  return Boolean(clientId && secret);
}

async function getAccessToken(): Promise<string> {
  const { clientId, secret } = getPayPalCredentials();
  if (!clientId || !secret) {
    throw new Error('PayPal credentials are not configured on the server.');
  }

  const creds = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('PayPal auth: missing access_token');
  return data.access_token;
}

export interface CreateOrderInput {
  amount: number; // Whole currency units (e.g. 25 = $25.00)
  currency: string; // ISO 4217 (e.g. USD)
  referenceId: string; // Your internal order id
  description?: string;
}

export interface CreatedOrder {
  id: string;
  status: string;
}

export async function createPayPalOrder(
  input: CreateOrderInput,
): Promise<CreatedOrder> {
  const token = await getAccessToken();
  const res = await fetch(`${paypalApiBase()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: input.referenceId,
          description: input.description?.slice(0, 127) || 'Cubico order',
          amount: {
            currency_code: input.currency,
            value: input.amount.toFixed(2),
          },
        },
      ],
    }),
  });

  const data = (await res.json()) as { id?: string; status?: string; message?: string };
  if (!res.ok || !data.id) {
    throw new Error(
      `PayPal create-order failed (${res.status}): ${data.message || JSON.stringify(data)}`,
    );
  }
  return { id: data.id, status: data.status || 'CREATED' };
}

export interface CaptureResult {
  id: string;
  status: string;
  captureId: string;
  amount: string;
  currency: string;
  payerEmail: string | null;
  payerName: string | null;
}

export async function capturePayPalOrder(
  paypalOrderId: string,
): Promise<CaptureResult> {
  const token = await getAccessToken();
  const res = await fetch(
    `${paypalApiBase()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );

  const data = (await res.json()) as {
    id?: string;
    status?: string;
    message?: string;
    payer?: {
      email_address?: string;
      name?: { given_name?: string; surname?: string };
    };
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{
          id: string;
          status: string;
          amount: { currency_code: string; value: string };
        }>;
      };
    }>;
  };

  if (!res.ok || !data.id) {
    throw new Error(
      `PayPal capture failed (${res.status}): ${data.message || JSON.stringify(data)}`,
    );
  }

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  const name = data.payer?.name;
  const fullName = [name?.given_name, name?.surname].filter(Boolean).join(' ') || null;

  return {
    id: data.id,
    status: data.status || 'UNKNOWN',
    captureId: capture?.id || data.id,
    amount: capture?.amount.value || '0.00',
    currency: capture?.amount.currency_code || 'USD',
    payerEmail: data.payer?.email_address || null,
    payerName: fullName,
  };
}
