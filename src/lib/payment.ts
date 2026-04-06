/**
 * Payment Module — Single replaceable module
 *
 * Currently simulates a payment gateway.
 * Replace the processPayment function with real Stripe/JazzCash/EasyPaisa integration.
 */

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  customerName: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  paidAt: string;
  method: string;
}

/**
 * Process a payment. Currently a simulation.
 * Replace this function body with real gateway integration.
 */
export async function processPayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate success (replace with real gateway call)
  const txnId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  return {
    success: true,
    transactionId: txnId,
    message: 'Payment processed successfully',
    paidAt: new Date().toISOString(),
    method: 'card',
  };
}
