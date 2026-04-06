'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LogOut, Package, MessageCircle, User as UserIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  business_name: string;
  role: string;
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

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' },
  accepted: { label: 'In Progress', color: 'bg-blue-500/20 text-blue-400' },
  preview_ready: { label: 'Preview Ready', color: 'bg-purple-500/20 text-purple-400' },
  revision: { label: 'Revision', color: 'bg-orange-500/20 text-orange-400' },
  completed: { label: 'Completed', color: 'bg-green-500/20 text-green-400' },
  delivered: { label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' },
};

export default function DashboardShell({
  user,
  profile,
  orders,
}: {
  user: User;
  profile: Profile | null;
  orders: Order[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0F1D32]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display font-bold text-white text-xl hover:text-[#FF6B4A] transition-colors"
          >
            Cubico
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-surface-400 font-body">
              <UserIcon size={14} />
              {displayName}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-surface-400 hover:text-white border border-white/10 rounded-lg transition-colors font-body"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            Welcome back, {displayName.split(' ')[0]}
          </h1>
          <p className="text-surface-500 font-body text-sm">
            Manage your website orders and track progress.
          </p>
        </motion.div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/services/website-development"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-medium text-sm rounded-xl transition-all"
          >
            <Package size={14} />
            Order a Website
          </Link>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-lg font-display font-semibold text-white mb-4">
            Your Orders
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#0F1D32] p-8 text-center">
              <Package size={32} className="text-surface-600 mx-auto mb-3" />
              <p className="text-surface-400 font-body text-sm mb-4">
                No orders yet. Pick a template and get your website built.
              </p>
              <Link
                href="/services/website-development"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-medium text-xs rounded-lg transition-all"
              >
                Browse Templates
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => {
                const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 sm:p-5 rounded-xl border border-white/10 bg-[#0F1D32] hover:border-white/15 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-white text-sm truncate">
                          {order.business_name || order.template_key}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-body font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500 font-body">
                        Template: {order.template_key} &middot;{' '}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {order.preview_url && (
                        <a
                          href={order.preview_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[10px] text-[#FF6B4A] border border-[#FF6B4A]/20 rounded-md font-body font-medium hover:bg-[#FF6B4A]/10 transition-colors"
                        >
                          Preview
                        </a>
                      )}
                      {order.live_url && (
                        <a
                          href={order.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[10px] text-green-400 border border-green-400/20 rounded-md font-body font-medium hover:bg-green-400/10 transition-colors"
                        >
                          Live Site
                        </a>
                      )}
                      <button className="p-1.5 text-surface-500 hover:text-white transition-colors">
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
