'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Clock,
  CheckCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { TEMPLATES } from '@/components/TemplatePreview';

interface Profile {
  full_name: string;
}

interface Order {
  id: string;
  template_key: string;
  business_name: string;
  status: string;
  preview_url: string;
  live_url: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
  accepted: { label: 'In Progress', color: 'bg-blue-500/20 text-blue-400' },
  preview_ready: { label: 'Preview Ready', color: 'bg-purple-500/20 text-purple-400' },
  revision: { label: 'Revision', color: 'bg-orange-500/20 text-orange-400' },
  completed: { label: 'Completed', color: 'bg-green-500/20 text-green-400' },
  delivered: { label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
};

export default function DashboardOverview({
  profile,
  orders,
}: {
  profile: Profile | null;
  orders: Order[];
}) {
  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.status),
  );
  const completedOrders = orders.filter(
    (o) => o.status === 'delivered',
  );

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
          Welcome back, {firstName}
        </h1>
        <p className="text-surface-500 font-body text-sm">
          Here&apos;s what&apos;s happening with your projects.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {[
          {
            label: 'Total Orders',
            value: orders.length,
            icon: Package,
            color: 'text-blue-400',
          },
          {
            label: 'Active',
            value: activeOrders.length,
            icon: Clock,
            color: 'text-yellow-400',
          },
          {
            label: 'Delivered',
            value: completedOrders.length,
            icon: CheckCircle,
            color: 'text-green-400',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border border-white/10 bg-[#0F1D32]"
          >
            <stat.icon size={16} className={`${stat.color} mb-2`} />
            <p className="text-2xl font-display font-bold text-white">
              {stat.value}
            </p>
            <p className="text-[11px] text-surface-500 font-body">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-semibold text-white">
          Recent Orders
        </h2>
        {orders.length > 0 && (
          <Link
            href="/dashboard/orders"
            className="text-xs text-[#FF6B4A] font-body hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0F1D32] p-8 text-center">
          <Package size={32} className="text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400 font-body text-sm mb-4">
            No orders yet. Pick a template and get started.
          </p>
          <Link
            href="/services/website-development"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-medium text-sm rounded-xl transition-all"
          >
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, i) => {
            const status = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
            const template = TEMPLATES.find((t) => t.key === order.template_key);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#0F1D32] hover:border-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Template color dot */}
                    <div
                      className="w-9 h-9 rounded-lg flex-shrink-0"
                      style={{
                        background: template?.gradient || 'linear-gradient(135deg, #0F1D32, #1a3a5c)',
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-body font-medium text-white text-sm truncate group-hover:text-[#FF6B4A] transition-colors">
                          {order.business_name || order.template_key}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-medium flex-shrink-0 ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-surface-500 font-body">
                        {template?.industry || order.template_key} &middot;{' '}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {order.preview_url && (
                      <span className="hidden sm:inline px-2 py-0.5 text-[10px] text-purple-400 border border-purple-400/20 rounded font-body">
                        Preview
                      </span>
                    )}
                    {order.live_url && (
                      <span className="hidden sm:inline px-2 py-0.5 text-[10px] text-green-400 border border-green-400/20 rounded font-body">
                        Live
                      </span>
                    )}
                    <ArrowRight size={14} className="text-surface-600 group-hover:text-[#FF6B4A] transition-colors" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
