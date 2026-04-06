'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';
import { TEMPLATES } from '@/components/TemplatePreview';

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

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'active', label: 'Active' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersList({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((order) => {
    if (filter === 'active') return !['delivered', 'cancelled'].includes(order.status);
    if (filter === 'delivered') return order.status === 'delivered';
    if (filter === 'cancelled') return order.status === 'cancelled';
    return true;
  }).filter((order) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      order.business_name?.toLowerCase().includes(q) ||
      order.template_key.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1">
          My Orders
        </h1>
        <p className="text-surface-500 font-body text-sm">
          Track and manage all your website projects.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0F1D32] border border-white/10 rounded-lg text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/50 transition-colors"
          />
        </div>
        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-[#0F1D32] border border-white/10 rounded-lg">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-body font-medium rounded-md transition-all ${
                filter === opt.value
                  ? 'bg-[#FF6B4A] text-white'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0F1D32] p-8 text-center">
          <Package size={32} className="text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400 font-body text-sm mb-4">
            {orders.length === 0
              ? 'No orders yet. Pick a template and get started.'
              : 'No orders match your filter.'}
          </p>
          {orders.length === 0 && (
            <Link
              href="/services/website-development"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-medium text-sm rounded-xl transition-all"
            >
              Browse Templates
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const status = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
            const template = TEMPLATES.find((t) => t.key === order.template_key);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#0F1D32] hover:border-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0"
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
                        {template?.name || order.template_key} &middot;{' '}
                        {template?.industry || 'Website'} &middot;{' '}
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
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
