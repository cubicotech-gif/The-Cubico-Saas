'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CreditCard,
  Loader2,
  CheckCircle,
  Shield,
  Copy,
  Check,
} from 'lucide-react';
import { processPayment, type PaymentResult } from '@/lib/payment';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (result: PaymentResult) => void;
  orderId: string;
  amount: number;
  currency: string;
  businessName: string;
}

export default function PaymentModal({
  open,
  onClose,
  onSuccess,
  orderId,
  amount,
  currency,
  businessName,
}: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [copied, setCopied] = useState(false);

  const formatCurrency = (amt: number, cur: string) =>
    cur === 'PKR' ? `Rs ${amt.toLocaleString()}` : `$${amt.toLocaleString()}`;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) { setError('Enter a valid card number'); return; }
    if (expiry.length < 5) { setError('Enter a valid expiry date'); return; }
    if (cvv.length < 3) { setError('Enter a valid CVV'); return; }
    if (!name.trim()) { setError('Enter cardholder name'); return; }

    setError('');
    setProcessing(true);

    try {
      const paymentResult = await processPayment({
        orderId,
        amount,
        currency,
        cardNumber: cleanCard,
        expiry,
        cvv,
        customerName: name.trim(),
      });

      if (paymentResult.success) {
        setResult(paymentResult);
        onSuccess(paymentResult);
      } else {
        setError(paymentResult.message || 'Payment failed');
      }
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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
        onClick={(e) => { if (e.target === e.currentTarget && !processing) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F1D32] overflow-hidden"
        >
          {result ? (
            /* ── Success Screen ── */
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
                  <button onClick={copyTxn} className="flex items-center gap-1 text-[11px] text-[#FF6B4A] font-body">
                    {copied ? <Check size={10} /> : <Copy size={10} />}
                    {result.transactionId}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-surface-500 font-body">Amount</span>
                  <span className="text-[11px] text-white font-body">{formatCurrency(amount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-surface-500 font-body">Date</span>
                  <span className="text-[11px] text-white font-body">
                    {new Date(result.paidAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-surface-500 font-body">Method</span>
                  <span className="text-[11px] text-white font-body capitalize">{result.method}</span>
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
            /* ── Payment Form ── */
            <>
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-bold text-white">Payment</h2>
                  <p className="text-xs text-surface-500 font-body">{businessName}</p>
                </div>
                <button
                  onClick={onClose}
                  disabled={processing}
                  className="text-surface-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Amount */}
                <div className="p-3 bg-[#0A1628] rounded-lg flex items-center justify-between">
                  <span className="text-xs text-surface-500 font-body">Total Amount</span>
                  <span className="text-lg font-display font-bold text-white">
                    {formatCurrency(amount, currency)}
                  </span>
                </div>

                {error && (
                  <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body">
                    {error}
                  </div>
                )}

                {/* Card Number */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">Card Number</label>
                  <div className="relative">
                    <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0A1628] border border-white/10 rounded-lg text-white text-sm font-mono placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-surface-400 font-body mb-1.5">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2.5 bg-[#0A1628] border border-white/10 rounded-lg text-white text-sm font-mono placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-400 font-body mb-1.5">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="w-full px-3 py-2.5 bg-[#0A1628] border border-white/10 rounded-lg text-white text-sm font-mono placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Cardholder */}
                <div>
                  <label className="block text-xs text-surface-400 font-body mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name on card"
                    className="w-full px-3 py-2.5 bg-[#0A1628] border border-white/10 rounded-lg text-white text-sm font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-50 text-white font-body font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay {formatCurrency(amount, currency)}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-surface-600 font-body">
                  <Shield size={10} />
                  Secure payment — your data is encrypted
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
