'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Eye,
  Rocket,
  Send,
  XCircle,
  RefreshCw,
  Globe,
  Palette,
  FileText,
  Building,
  User,
  Timer,
  ExternalLink,
  Download,
  PartyPopper,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { TEMPLATES } from '@/components/TemplatePreview';
import OrderChat from '@/components/dashboard/OrderChat';
import PaymentModal from '@/components/dashboard/PaymentModal';

interface Order {
  id: string;
  template_key: string;
  business_name: string;
  business_industry: string;
  business_description: string;
  content_notes: string;
  color_preferences: string;
  domain_info: string;
  domain_name: string;
  extra_notes: string;
  logo_url: string;
  status: string;
  preview_url: string;
  live_url: string;
  price_amount: number;
  price_currency: string;
  is_paid: boolean;
  developer_id: string | null;
  created_at: string;
  updated_at: string;
}

const STATUSES = [
  { key: 'pending', label: 'Order Placed', icon: Send, description: 'Your order has been received' },
  { key: 'accepted', label: 'In Progress', icon: Clock, description: 'Developer is building your site' },
  { key: 'preview_ready', label: 'Preview Ready', icon: Eye, description: 'Your site is ready for review' },
  { key: 'revision', label: 'Revision', icon: RefreshCw, description: 'Changes are being made' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, description: 'Final version approved' },
  { key: 'delivered', label: 'Delivered', icon: Rocket, description: 'Your website is live!' },
];

const DELIVERY_HOURS = 3; // Default estimated delivery hours

export default function OrderDetail({
  order: initialOrder,
  currentUserId,
}: {
  order: Order;
  currentUserId: string;
}) {
  const supabase = createClient();
  const [order, setOrder] = useState(initialOrder);
  const template = TEMPLATES.find((t) => t.key === order.template_key);
  const currentStatusIndex = STATUSES.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'cancelled';
  const isPreviewReady = order.status === 'preview_ready';
  const isDelivered = order.status === 'delivered';
  const isCompleted = order.status === 'completed';

  // Developer name
  const [developerName, setDeveloperName] = useState('');

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState('');
  const [timerExpired, setTimerExpired] = useState(false);

  // Approval flow
  const [showApproval, setShowApproval] = useState(false);
  const [satisfiedChecked, setSatisfiedChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Load developer name
  useEffect(() => {
    if (order.developer_id) {
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', order.developer_id)
        .single()
        .then(({ data }) => {
          if (data?.full_name) setDeveloperName(data.full_name);
        });
    }
  }, [order.developer_id]);

  // Countdown timer
  useEffect(() => {
    if (!['pending', 'accepted'].includes(order.status)) {
      setTimerExpired(true);
      return;
    }

    const deliveryTarget = new Date(order.created_at).getTime() + DELIVERY_HOURS * 60 * 60 * 1000;

    const tick = () => {
      const now = Date.now();
      const diff = deliveryTarget - now;
      if (diff <= 0) {
        setTimeLeft('00:00');
        setTimerExpired(true);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`);
    };

    tick();
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [order.status, order.created_at]);

  const handleRequestChanges = async () => {
    // Update status to revision
    await supabase.from('orders').update({ status: 'revision' }).eq('id', order.id);
    setOrder((prev) => ({ ...prev, status: 'revision' }));
  };

  const handleApproveAndContinue = () => {
    setShowApproval(true);
  };

  const handleProceedToPayment = () => {
    if (!satisfiedChecked || !termsChecked) return;
    setShowApproval(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    // The capture API route already updated the orders row and recorded a
    // transaction. We just refresh local state so the UI reflects it.
    setOrder((prev) => ({ ...prev, is_paid: true, status: 'completed' }));
  };

  return (
    <div>
      {/* Back + Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-white font-body mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Template thumbnail */}
            {template && (
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0 hidden sm:block"
                style={{ background: template.gradient }}
              />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
                {order.business_name || order.template_key}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-surface-500 font-body">
                <span>{template?.name || order.template_key}</span>
                <span className="text-white/10">|</span>
                <span>
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {developerName && (
                  <>
                    <span className="text-white/10">|</span>
                    <span className="flex items-center gap-1">
                      <User size={11} />
                      {developerName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {order.preview_url && (
              <a
                href={order.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-purple-400/30 text-purple-400 hover:bg-purple-400/10 font-body font-medium text-xs rounded-lg transition-all"
              >
                <Eye size={14} />
                Preview
              </a>
            )}
            {order.live_url && (
              <a
                href={order.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-medium text-xs rounded-lg transition-all"
              >
                <Globe size={14} />
                Live Site
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Countdown timer (for pending/accepted) */}
      {['pending', 'accepted'].includes(order.status) && !timerExpired && timeLeft && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
          className="rounded-xl border border-blue-400/20 bg-blue-500/5 p-4 mb-6 flex items-center gap-3"
        >
          <Timer size={18} className="text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-body font-medium text-white">
              Estimated delivery in <span className="text-blue-400 font-mono">{timeLeft}</span>
            </p>
            <p className="text-xs text-surface-500 font-body">
              Your developer is working on your website.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── DELIVERED — Completion Screen ── */}
      {(isDelivered || (isCompleted && order.is_paid)) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-6 sm:p-8 mb-6 text-center"
        >
          <PartyPopper size={32} className="text-emerald-400 mx-auto mb-3" />
          <h2 className="text-xl font-display font-bold text-white mb-2">
            Your website is live!
          </h2>
          <p className="text-sm text-surface-400 font-body mb-5 max-w-md mx-auto">
            Congratulations! Your website has been delivered and is now live.
            You own it completely — no lock-in, no recurring fees.
          </p>

          <div className="bg-[#0A1628] rounded-xl p-4 mb-5 max-w-sm mx-auto text-left space-y-2.5">
            {order.live_url && (
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-surface-500 font-body">Live URL</span>
                <a
                  href={order.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#FF6B4A] font-body flex items-center gap-1"
                >
                  {order.live_url} <ExternalLink size={9} />
                </a>
              </div>
            )}
            {order.domain_name && (
              <div className="flex justify-between">
                <span className="text-[11px] text-surface-500 font-body">Domain</span>
                <span className="text-[11px] text-white font-body">{order.domain_name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[11px] text-surface-500 font-body">Status</span>
              <span className="text-[11px] text-emerald-400 font-body font-medium">Ownership Transferred</span>
            </div>
            {order.is_paid && (
              <div className="flex justify-between">
                <span className="text-[11px] text-surface-500 font-body">Payment</span>
                <span className="text-[11px] text-emerald-400 font-body">
                  {order.price_currency === 'PKR' ? 'Rs ' : '$'}
                  {order.price_amount?.toLocaleString()} — Paid
                </span>
              </div>
            )}
          </div>

          {order.live_url && (
            <a
              href={order.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-semibold text-sm rounded-xl transition-all"
            >
              <Globe size={16} />
              Visit Your Website
            </a>
          )}
        </motion.div>
      )}

      {/* Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-white/10 bg-[#0F1D32] p-5 sm:p-6 mb-6"
      >
        <h2 className="text-sm font-display font-semibold text-white mb-5">Order Progress</h2>

        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <XCircle size={20} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-body font-medium text-red-400">Order Cancelled</p>
              <p className="text-xs text-surface-500 font-body">This order has been cancelled.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop timeline */}
            <div className="hidden sm:flex items-start justify-between">
              {STATUSES.map((step, i) => {
                const isStepCompleted = i <= currentStatusIndex;
                const isCurrent = i === currentStatusIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center text-center flex-1 relative">
                    {i > 0 && (
                      <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${i <= currentStatusIndex ? 'bg-[#FF6B4A]' : 'bg-white/10'}`} />
                    )}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCurrent ? 'border-[#FF6B4A] bg-[#FF6B4A]/20' : isStepCompleted ? 'border-[#FF6B4A] bg-[#FF6B4A]' : 'border-white/10 bg-[#0A1628]'
                    }`}>
                      <Icon size={14} className={isCurrent ? 'text-[#FF6B4A]' : isStepCompleted ? 'text-white' : 'text-surface-600'} />
                    </div>
                    <p className={`mt-2 text-[11px] font-body font-medium ${isStepCompleted ? 'text-white' : 'text-surface-600'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Mobile timeline */}
            <div className="sm:hidden space-y-0">
              {STATUSES.map((step, i) => {
                const isStepCompleted = i <= currentStatusIndex;
                const isCurrent = i === currentStatusIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                        isCurrent ? 'border-[#FF6B4A] bg-[#FF6B4A]/20' : isStepCompleted ? 'border-[#FF6B4A] bg-[#FF6B4A]' : 'border-white/10 bg-[#0A1628]'
                      }`}>
                        <Icon size={12} className={isCurrent ? 'text-[#FF6B4A]' : isStepCompleted ? 'text-white' : 'text-surface-600'} />
                      </div>
                      {i < STATUSES.length - 1 && (
                        <div className={`w-0.5 h-6 ${i < currentStatusIndex ? 'bg-[#FF6B4A]' : 'bg-white/10'}`} />
                      )}
                    </div>
                    <div className={`pb-4 ${i === STATUSES.length - 1 ? 'pb-0' : ''}`}>
                      <p className={`text-xs font-body font-medium ${isStepCompleted ? 'text-white' : 'text-surface-600'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-[11px] text-surface-500 font-body mt-0.5">{step.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>

      {/* ── PREVIEW IFRAME (when preview_ready) ── */}
      {isPreviewReady && order.preview_url && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-purple-400/20 bg-[#0F1D32] overflow-hidden mb-6"
        >
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-purple-400" />
              <h2 className="text-sm font-display font-semibold text-white">Your Website Preview</h2>
            </div>
            <a
              href={order.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-purple-400 font-body flex items-center gap-1 hover:text-purple-300"
            >
              Open in new tab <ExternalLink size={10} />
            </a>
          </div>

          {/* Iframe */}
          <div className="bg-white" style={{ height: '500px' }}>
            <iframe
              src={order.preview_url}
              className="w-full h-full border-0"
              title="Website Preview"
            />
          </div>

          {/* Review actions */}
          <div className="px-4 py-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRequestChanges}
              className="flex-1 py-3 border border-orange-400/30 text-orange-400 hover:bg-orange-400/10 font-body font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              Request Changes
            </button>
            <button
              onClick={handleApproveAndContinue}
              className="flex-1 py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={14} />
              Approve &amp; Continue
            </button>
          </div>
        </motion.div>
      )}

      {/* ── APPROVAL CONFIRMATION ── */}
      {showApproval && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#FF6B4A]/20 bg-[#FF6B4A]/5 p-5 mb-6"
        >
          <h3 className="text-sm font-display font-semibold text-white mb-4">
            Confirm Approval
          </h3>
          <div className="space-y-3 mb-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={satisfiedChecked}
                onChange={(e) => setSatisfiedChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-surface-600 bg-surface-800 text-[#FF6B4A] focus:ring-[#FF6B4A] focus:ring-offset-0"
              />
              <span className="text-sm text-white font-body">
                I am satisfied with the delivered website
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-surface-600 bg-surface-800 text-[#FF6B4A] focus:ring-[#FF6B4A] focus:ring-offset-0"
              />
              <span className="text-sm text-white font-body">
                I agree to the{' '}
                <a href="/terms" className="text-[#FF6B4A] underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-[#FF6B4A] underline">Privacy Policy</a>
              </span>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowApproval(false)}
              className="px-4 py-2.5 text-sm text-surface-400 hover:text-white font-body transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={!satisfiedChecked || !termsChecked}
              className="px-6 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] disabled:opacity-40 text-white font-body font-semibold text-sm rounded-xl transition-all"
            >
              Proceed to Payment
            </button>
          </div>
        </motion.div>
      )}

      {/* Order details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-white/10 bg-[#0F1D32] p-5"
        >
          <h2 className="text-sm font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Building size={14} className="text-[#FF6B4A]" />
            Business Details
          </h2>
          <div className="space-y-3">
            <DetailRow label="Business Name" value={order.business_name} />
            <DetailRow label="Industry" value={order.business_industry} />
            {order.business_description && <DetailRow label="Description" value={order.business_description} />}
            {order.domain_name && <DetailRow label="Domain" value={order.domain_name} />}
            {order.domain_info && <DetailRow label="Domain Info" value={order.domain_info} />}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-white/10 bg-[#0F1D32] p-5"
        >
          <h2 className="text-sm font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Palette size={14} className="text-[#FF6B4A]" />
            Website Details
          </h2>
          <div className="space-y-3">
            <DetailRow label="Template" value={template?.name || order.template_key} />
            {order.color_preferences && <DetailRow label="Colors" value={order.color_preferences} />}
            {order.content_notes && <DetailRow label="References" value={order.content_notes} />}
            {order.extra_notes && <DetailRow label="Notes" value={order.extra_notes} />}
          </div>
        </motion.div>
      </div>

      {/* Pricing */}
      {order.price_amount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-white/10 bg-[#0F1D32] p-5 mb-6"
        >
          <h2 className="text-sm font-display font-semibold text-white mb-3 flex items-center gap-2">
            <FileText size={14} className="text-[#FF6B4A]" />
            Pricing
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-display font-bold text-white">
              {order.price_currency === 'PKR' ? 'Rs ' : '$'}
              {order.price_amount.toLocaleString()}
            </p>
            {order.is_paid && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-body font-medium bg-emerald-500/20 text-emerald-400">
                Paid
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Chat */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <OrderChat orderId={order.id} currentUserId={currentUserId} variant="customer" />
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        orderId={order.id}
        amount={order.price_amount || 0}
        currency={order.price_currency || 'PKR'}
        businessName={order.business_name}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] text-surface-500 font-body mb-0.5">{label}</p>
      <p className="text-sm text-white font-body">{value}</p>
    </div>
  );
}
