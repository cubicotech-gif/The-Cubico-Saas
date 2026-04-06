'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  CheckCircle,
  Eye,
  Rocket,
  Send,
  XCircle,
  RefreshCw,
  Package,
  Globe,
  Palette,
  FileText,
  Building,
  MessageSquare,
} from 'lucide-react';
import { TEMPLATES } from '@/components/TemplatePreview';

interface Order {
  id: string;
  template_key: string;
  business_name: string;
  business_industry: string;
  business_description: string;
  pages_needed: string;
  color_preferences: string;
  domain_name: string;
  additional_notes: string;
  logo_url: string;
  status: string;
  preview_url: string;
  live_url: string;
  price: number;
  currency: string;
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

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 border-yellow-400 bg-yellow-400',
  accepted: 'text-blue-400 border-blue-400 bg-blue-400',
  preview_ready: 'text-purple-400 border-purple-400 bg-purple-400',
  revision: 'text-orange-400 border-orange-400 bg-orange-400',
  completed: 'text-green-400 border-green-400 bg-green-400',
  delivered: 'text-emerald-400 border-emerald-400 bg-emerald-400',
  cancelled: 'text-red-400 border-red-400 bg-red-400',
};

export default function OrderDetail({ order }: { order: Order }) {
  const template = TEMPLATES.find((t) => t.key === order.template_key);
  const currentStatusIndex = STATUSES.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div>
      {/* Back + Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-white font-body mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
              {order.business_name || order.template_key}
            </h1>
            <p className="text-surface-500 font-body text-sm">
              {template?.name || order.template_key} &middot; Ordered{' '}
              {new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            {order.preview_url && (
              <a
                href={order.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-purple-400/30 text-purple-400 hover:bg-purple-400/10 font-body font-medium text-xs rounded-lg transition-all"
              >
                <Eye size={14} />
                View Preview
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
                Visit Live Site
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-white/10 bg-[#0F1D32] p-5 sm:p-6 mb-6"
      >
        <h2 className="text-sm font-display font-semibold text-white mb-5">
          Order Progress
        </h2>

        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <XCircle size={20} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-body font-medium text-red-400">Order Cancelled</p>
              <p className="text-xs text-surface-500 font-body">This order has been cancelled.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Desktop timeline */}
            <div className="hidden sm:flex items-start justify-between">
              {STATUSES.map((step, i) => {
                const isCompleted = i <= currentStatusIndex;
                const isCurrent = i === currentStatusIndex;
                const Icon = step.icon;
                const colorClass = STATUS_COLORS[step.key] || 'text-surface-600 border-surface-600 bg-surface-600';

                return (
                  <div key={step.key} className="flex flex-col items-center text-center flex-1 relative">
                    {/* Connector line */}
                    {i > 0 && (
                      <div
                        className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${
                          i <= currentStatusIndex ? 'bg-[#FF6B4A]' : 'bg-white/10'
                        }`}
                      />
                    )}
                    {/* Icon circle */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'border-[#FF6B4A] bg-[#FF6B4A]/20'
                          : isCompleted
                          ? 'border-[#FF6B4A] bg-[#FF6B4A]'
                          : 'border-white/10 bg-[#0A1628]'
                      }`}
                    >
                      <Icon
                        size={14}
                        className={
                          isCurrent
                            ? 'text-[#FF6B4A]'
                            : isCompleted
                            ? 'text-white'
                            : 'text-surface-600'
                        }
                      />
                    </div>
                    <p
                      className={`mt-2 text-[11px] font-body font-medium ${
                        isCompleted ? 'text-white' : 'text-surface-600'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Mobile timeline (vertical) */}
            <div className="sm:hidden space-y-0">
              {STATUSES.map((step, i) => {
                const isCompleted = i <= currentStatusIndex;
                const isCurrent = i === currentStatusIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                          isCurrent
                            ? 'border-[#FF6B4A] bg-[#FF6B4A]/20'
                            : isCompleted
                            ? 'border-[#FF6B4A] bg-[#FF6B4A]'
                            : 'border-white/10 bg-[#0A1628]'
                        }`}
                      >
                        <Icon
                          size={12}
                          className={
                            isCurrent
                              ? 'text-[#FF6B4A]'
                              : isCompleted
                              ? 'text-white'
                              : 'text-surface-600'
                          }
                        />
                      </div>
                      {i < STATUSES.length - 1 && (
                        <div
                          className={`w-0.5 h-6 ${
                            i < currentStatusIndex ? 'bg-[#FF6B4A]' : 'bg-white/10'
                          }`}
                        />
                      )}
                    </div>
                    <div className={`pb-4 ${i === STATUSES.length - 1 ? 'pb-0' : ''}`}>
                      <p
                        className={`text-xs font-body font-medium ${
                          isCompleted ? 'text-white' : 'text-surface-600'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-[11px] text-surface-500 font-body mt-0.5">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Order details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Business Details */}
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
            {order.business_description && (
              <DetailRow label="Description" value={order.business_description} />
            )}
            {order.domain_name && (
              <DetailRow label="Domain" value={order.domain_name} />
            )}
          </div>
        </motion.div>

        {/* Website Details */}
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
            {order.pages_needed && (
              <DetailRow label="Pages" value={order.pages_needed} />
            )}
            {order.color_preferences && (
              <DetailRow label="Color Preferences" value={order.color_preferences} />
            )}
            {order.additional_notes && (
              <DetailRow label="Notes" value={order.additional_notes} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Pricing */}
      {order.price && (
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
          <p className="text-2xl font-display font-bold text-white">
            {order.currency === 'PKR' ? 'Rs ' : '$'}
            {order.price.toLocaleString()}
            <span className="text-xs text-surface-500 font-body font-normal ml-2">
              {order.currency}
            </span>
          </p>
        </motion.div>
      )}

      {/* Chat placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl border border-white/10 bg-[#0F1D32] p-8 text-center"
      >
        <MessageSquare size={28} className="text-surface-600 mx-auto mb-3" />
        <p className="text-sm font-body font-medium text-surface-400 mb-1">
          Messages coming soon
        </p>
        <p className="text-xs text-surface-600 font-body">
          You&apos;ll be able to chat directly with your developer here.
        </p>
      </motion.div>
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
