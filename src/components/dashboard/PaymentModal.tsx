'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  CheckCircle,
  Shield,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  loadPayPalSdk,
  type PaymentResult,
  type CreateOrderResponse,
  type CaptureResponse,
} from '@/lib/payment';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (result: PaymentResult) => void;
  orderId: string;
  amount: number;
  currency: string;
  businessName: string;
}

type PayPalButtonsInstance = {
  render: (container: HTMLElement) => Promise<void>;
  close: () => Promise<void> | void;
};

type PayPalActions = {
  restart?: () => void;
};

type PayPalNamespace = {
  Buttons: (config: {
    style?: Record<string, unknown>;
    createOrder: () => Promise<string>;
    onApprove: (
      data: { orderID: string },
      actions: PayPalActions,
    ) => Promise<void>;
    onError: (err: unknown) => void;
    onCancel?: () => void;
  }) => PayPalButtonsInstance;
};

export default function PaymentModal({
  open,
  onClose,
  onSuccess,
  orderId,
  amount,
  currency,
  businessName,
}: Props) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  const [sdkLoading, setSdkLoading] = useState(true);
  const [sdkError, setSdkError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [copied, setCopied] = useState(false);

  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const buttonsInstanceRef = useRef<PayPalButtonsInstance | null>(null);

  const formatCurrency = (amt: number, cur: string) =>
    cur === 'PKR' ? `Rs ${amt.toLocaleString()}` : `$${amt.toLocaleString()}`;

  // Mount PayPal Buttons when the modal is opened.
  useEffect(() => {
    if (!open || result) return;

    let cancelled = false;

    async function mount() {
      setSdkError('');
      setError('');
      setSdkLoading(true);

      if (!clientId) {
        setSdkError(
          'PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment.',
        );
        setSdkLoading(false);
        return;
      }

      try {
        await loadPayPalSdk(clientId, 'USD');
      } catch (e) {
        if (!cancelled) {
          setSdkError(e instanceof Error ? e.message : 'Failed to load PayPal.');
          setSdkLoading(false);
        }
        return;
      }

      if (cancelled) return;

      const paypal = (window as unknown as { paypal?: PayPalNamespace }).paypal;
      if (!paypal) {
        setSdkError('PayPal SDK unavailable.');
        setSdkLoading(false);
        return;
      }

      const container = buttonContainerRef.current;
      if (!container) return;
      container.innerHTML = '';

      try {
        const buttons = paypal.Buttons({
          style: { layout: 'vertical', shape: 'pill', label: 'paypal' },
          createOrder: async () => {
            setError('');
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId }),
            });
            const data = (await res.json()) as CreateOrderResponse & {
              error?: string;
            };
            if (!res.ok || !data.id) {
              throw new Error(data.error || 'Could not create PayPal order.');
            }
            return data.id;
          },
          onApprove: async (data) => {
            setProcessing(true);
            setError('');
            try {
              const res = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId,
                  paypalOrderId: data.orderID,
                }),
              });
              const body = (await res.json()) as CaptureResponse & {
                error?: string;
              };
              if (!res.ok || !body.success) {
                throw new Error(body.error || 'Payment could not be captured.');
              }
              const payment: PaymentResult = {
                success: true,
                transactionId: body.transactionId,
                message: 'Payment captured successfully',
                paidAt: body.paidAt,
                method: body.method || 'paypal',
              };
              setResult(payment);
              onSuccess(payment);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Payment failed.');
            } finally {
              setProcessing(false);
            }
          },
          onError: (err) => {
            setProcessing(false);
            const message = err instanceof Error ? err.message : 'PayPal error';
            setError(message);
          },
          onCancel: () => {
            setProcessing(false);
            setError('Payment was cancelled.');
          },
        });

        buttonsInstanceRef.current = buttons;
        await buttons.render(container);
      } catch (err) {
        if (!cancelled) {
          setSdkError(err instanceof Error ? err.message : 'Failed to render PayPal.');
        }
      } finally {
        if (!cancelled) setSdkLoading(false);
      }
    }

    mount();

    return () => {
      cancelled = true;
      const inst = buttonsInstanceRef.current;
      buttonsInstanceRef.current = null;
      if (inst) {
        try {
          const closed = inst.close();
          if (closed && typeof (closed as Promise<void>).catch === 'function') {
            (closed as Promise<void>).catch(() => {});
          }
        } catch {
          // ignore teardown errors
        }
      }
    };
  }, [open, result, clientId, orderId, onSuccess]);

  const copyTxn = () => {
    if (result) {
      navigator.clipboard.writeText(result.transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && !processing) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F1D32] overflow-hidden"
        >
          {result ? (
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-display font-bold text-white mb-1">
                Payment Successful!
              </h2>
              <p className="text-sm text-surface-500 font-body mb-5">
                {formatCurrency(amount, currency)} paid for &quot;{businessName}&quot;
              </p>

              <div className="bg-[#0A1628] rounded-lg p-4 mb-5 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-[11px] text-surface-500 font-body">Transaction ID</span>
                  <button
                    onClick={copyTxn}
                    className="flex items-center gap-1 text-[11px] text-[#FF6B4A] font-body"
                  >
                    {copied ? <Check size={10} /> : <Copy size={10} />}
                    {result.transactionId}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-surface-500 font-body">Amount</span>
                  <span className="text-[11px] text-white font-body">
                    {formatCurrency(amount, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-surface-500 font-body">Date</span>
                  <span className="text-[11px] text-white font-body">
                    {new Date(result.paidAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-surface-500 font-body">Method</span>
                  <span className="text-[11px] text-white font-body capitalize">
                    {result.method}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-semibold text-sm rounded-xl transition-all"
              >
                Continue to Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Pay with PayPal</h2>
                  <p className="text-xs text-surface-500 font-body">{businessName}</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={processing}
                  className="text-surface-500 hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="p-3 bg-[#0A1628] rounded-lg flex items-center justify-between">
                  <span className="text-xs text-surface-500 font-body">Total Amount</span>
                  <span className="text-lg font-display font-bold text-white">
                    {formatCurrency(amount, currency)}
                  </span>
                </div>

                {currency === 'PKR' && (
                  <p className="text-[11px] text-surface-500 font-body px-1 leading-relaxed">
                    PayPal processes payments in USD. You&apos;ll be charged the USD
                    equivalent of {formatCurrency(amount, currency)} at checkout.
                  </p>
                )}

                {sdkError && (
                  <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body flex items-start gap-2">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{sdkError}</span>
                  </div>
                )}

                {error && !sdkError && (
                  <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body">
                    {error}
                  </div>
                )}

                <div className="relative min-h-[150px] bg-white rounded-xl p-3">
                  <div ref={buttonContainerRef} className="w-full" />

                  {(sdkLoading || processing) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                      <Loader2 size={20} className="animate-spin text-[#FF6B4A]" />
                      <span className="ml-2 text-xs text-surface-700 font-body">
                        {processing ? 'Capturing payment…' : 'Loading PayPal…'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-surface-600 font-body">
                  <Shield size={10} />
                  Secure payment via PayPal — your data is encrypted
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
