'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Globe,
  User,
  Save,
  Check,
  Loader2,
  AlertCircle,
  Clock,
  Send,
  RefreshCw,
  CheckCircle,
  Rocket,
  XCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { TEMPLATES } from '@/components/TemplatePreview';

interface Order {
  id: string;
  customer_id: string;
  developer_id: string | null;
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
  created_at: string;
  updated_at: string;
  // joined
  customer?: { full_name: string; phone: string; business_name: string };
}

interface Profile {
  id: string;
  full_name: string;
  role: string;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: Send, color: 'text-yellow-400 bg-yellow-500/20' },
  { value: 'accepted', label: 'In Progress', icon: Clock, color: 'text-blue-400 bg-blue-500/20' },
  { value: 'preview_ready', label: 'Preview Ready', icon: Eye, color: 'text-purple-400 bg-purple-500/20' },
  { value: 'revision', label: 'Revision', icon: RefreshCw, color: 'text-orange-400 bg-orange-500/20' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-400 bg-green-500/20' },
  { value: 'delivered', label: 'Delivered', icon: Rocket, color: 'text-emerald-400 bg-emerald-500/20' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-400 bg-red-500/20' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'In Progress' },
  { value: 'preview_ready', label: 'Preview Ready' },
  { value: 'revision', label: 'Revision' },
  { value: 'completed', label: 'Completed' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrders({ hasSupabase }: { hasSupabase: boolean }) {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [developers, setDevelopers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (hasSupabase) {
      loadOrders();
      loadDevelopers();
    } else {
      setLoading(false);
    }
  }, [hasSupabase]);

  async function loadOrders() {
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*, customer:profiles!orders_customer_id_fkey(full_name, phone, business_name)')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Failed to load orders. Make sure you are logged in as admin.');
      setOrders([]);
    } else {
      setOrders((data as Order[]) || []);
    }
    setLoading(false);
  }

  async function loadDevelopers() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('role', ['developer', 'admin']);
    setDevelopers(data || []);
  }

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.business_name?.toLowerCase().includes(q) ||
        o.template_key.toLowerCase().includes(q) ||
        o.customer?.full_name?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (!hasSupabase) {
    return (
      <div className="p-8 text-center rounded-xl bg-surface-900 border border-surface-800">
        <AlertCircle size={28} className="text-amber-400 mx-auto mb-3" />
        <p className="text-sm text-surface-300 font-body mb-1">
          Connect Supabase to manage orders
        </p>
        <p className="text-xs text-surface-500 font-body">
          Orders are stored in Supabase and require a connection to view.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-white">
            Orders ({orders.length})
          </h2>
          {orders.length > 0 && (
            <div className="flex gap-3 mt-1">
              {STATUS_OPTIONS.filter((s) => statusCounts[s.value]).map((s) => (
                <span key={s.value} className="text-[10px] text-surface-500 font-body">
                  {s.label}: <span className="text-surface-300">{statusCounts[s.value]}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs rounded-lg transition-colors font-body"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800 flex gap-2">
          <AlertCircle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-rose-300 font-body">{error}</p>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            placeholder="Search by name, template, customer, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-900 border border-surface-700 rounded-lg text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-brand-600 transition-colors"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-lg text-sm text-white font-body focus:outline-none focus:border-brand-600 transition-colors"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
              {opt.value !== 'all' && statusCounts[opt.value] ? ` (${statusCounts[opt.value]})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-surface-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-surface-900 border border-surface-800">
          <Package size={28} className="text-surface-600 mx-auto mb-3" />
          <p className="text-sm text-surface-400 font-body">
            {orders.length === 0 ? 'No orders yet.' : 'No orders match your filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              developers={developers}
              expanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
              onUpdate={(updated) => {
                setOrders((prev) =>
                  prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)),
                );
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Single Order Row ────────────────────────────────────────────────

function OrderRow({
  order,
  developers,
  expanded,
  onToggle,
  onUpdate,
}: {
  order: Order;
  developers: Profile[];
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (updated: Partial<Order> & { id: string }) => void;
}) {
  const supabase = createClient();
  const template = TEMPLATES.find((t) => t.key === order.template_key);
  const status = STATUS_OPTIONS.find((s) => s.value === order.status) || STATUS_OPTIONS[0];

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editStatus, setEditStatus] = useState(order.status);
  const [editPreviewUrl, setEditPreviewUrl] = useState(order.preview_url || '');
  const [editLiveUrl, setEditLiveUrl] = useState(order.live_url || '');
  const [editDeveloper, setEditDeveloper] = useState(order.developer_id || '');
  const [editPrice, setEditPrice] = useState(order.price_amount?.toString() || '0');
  const [editCurrency, setEditCurrency] = useState(order.price_currency || 'PKR');
  const [editPaid, setEditPaid] = useState(order.is_paid || false);

  async function handleSave() {
    setSaving(true);
    const updates = {
      status: editStatus,
      preview_url: editPreviewUrl.trim(),
      live_url: editLiveUrl.trim(),
      developer_id: editDeveloper || null,
      price_amount: parseInt(editPrice, 10) || 0,
      price_currency: editCurrency,
      is_paid: editPaid,
    };

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', order.id);

    setSaving(false);
    if (!error) {
      onUpdate({ id: order.id, ...updates });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="rounded-xl bg-surface-900 border border-surface-800 overflow-hidden">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-800/50 transition-colors"
      >
        <div
          className="w-9 h-9 rounded-lg flex-shrink-0"
          style={{
            background: template?.gradient || 'linear-gradient(135deg, #0F1D32, #1a3a5c)',
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-body font-medium text-white truncate">
              {order.business_name || order.template_key}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-medium flex-shrink-0 ${status.color}`}>
              {status.label}
            </span>
            {order.is_paid && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                Paid
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-surface-500 font-body">
            <span className="flex items-center gap-1">
              <User size={10} />
              {order.customer?.full_name || 'Unknown'}
            </span>
            <span>&middot;</span>
            <span>{template?.name || order.template_key}</span>
            <span>&middot;</span>
            <span>
              {new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
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
          {expanded ? (
            <ChevronUp size={14} className="text-surface-500" />
          ) : (
            <ChevronDown size={14} className="text-surface-500" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-surface-800 p-4 space-y-5">
          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InfoBlock label="Customer" value={order.customer?.full_name || '—'} />
            <InfoBlock label="Phone" value={order.customer?.phone || '—'} />
            <InfoBlock label="Order ID" value={order.id.slice(0, 8) + '...'} mono />
          </div>

          {/* Business details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoBlock label="Industry" value={order.business_industry || '—'} />
            <InfoBlock label="Domain" value={order.domain_info || order.domain_name || '—'} />
            {order.business_description && (
              <div className="sm:col-span-2">
                <InfoBlock label="Description" value={order.business_description} />
              </div>
            )}
            {order.color_preferences && (
              <InfoBlock label="Color Preferences" value={order.color_preferences} />
            )}
            {(order.content_notes || order.extra_notes) && (
              <InfoBlock label="Notes" value={order.content_notes || order.extra_notes || ''} />
            )}
          </div>

          {/* Logo */}
          {order.logo_url && (
            <div>
              <p className="text-[10px] text-surface-500 font-body uppercase tracking-wider mb-1">Logo</p>
              <a
                href={order.logo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-body transition-colors"
              >
                <ExternalLink size={12} />
                View uploaded logo
              </a>
            </div>
          )}

          {/* Editable fields */}
          <div className="border-t border-surface-800 pt-4">
            <p className="text-xs font-display font-semibold text-white mb-3">
              Manage Order
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Status */}
              <div>
                <label className="block text-[10px] text-surface-500 font-body uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white font-body focus:outline-none focus:border-brand-600 transition-colors"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign developer */}
              <div>
                <label className="block text-[10px] text-surface-500 font-body uppercase tracking-wider mb-1">
                  Assign Developer
                </label>
                <select
                  value={editDeveloper}
                  onChange={(e) => setEditDeveloper(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white font-body focus:outline-none focus:border-brand-600 transition-colors"
                >
                  <option value="">Unassigned</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.full_name || dev.id.slice(0, 8)} ({dev.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview URL */}
              <div>
                <label className="block text-[10px] text-surface-500 font-body uppercase tracking-wider mb-1">
                  Preview URL
                </label>
                <input
                  type="url"
                  value={editPreviewUrl}
                  onChange={(e) => setEditPreviewUrl(e.target.value)}
                  placeholder="https://preview.cubico.dev/..."
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-brand-600 transition-colors"
                />
              </div>

              {/* Live URL */}
              <div>
                <label className="block text-[10px] text-surface-500 font-body uppercase tracking-wider mb-1">
                  Live URL
                </label>
                <input
                  type="url"
                  value={editLiveUrl}
                  onChange={(e) => setEditLiveUrl(e.target.value)}
                  placeholder="https://www.client-site.com"
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-brand-600 transition-colors"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-[10px] text-surface-500 font-body uppercase tracking-wider mb-1">
                  Price
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="0"
                    className="flex-1 px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white font-body focus:outline-none focus:border-brand-600 transition-colors"
                  />
                  <select
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value)}
                    className="w-20 px-2 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white font-body focus:outline-none focus:border-brand-600 transition-colors"
                  >
                    <option value="PKR">PKR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              {/* Paid toggle */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={editPaid}
                    onChange={(e) => setEditPaid(e.target.checked)}
                    className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-600 focus:ring-brand-600 focus:ring-offset-0"
                  />
                  <span className="text-sm text-white font-body">Marked as Paid</span>
                </label>
              </div>
            </div>

            {/* Save button */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-body font-medium text-sm rounded-lg transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check size={14} />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Changes
                  </>
                )}
              </button>
              {order.preview_url && (
                <a
                  href={order.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-purple-400 hover:text-purple-300 font-body transition-colors"
                >
                  <Eye size={12} />
                  Open Preview
                </a>
              )}
              {order.live_url && (
                <a
                  href={order.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-green-400 hover:text-green-300 font-body transition-colors"
                >
                  <Globe size={12} />
                  Open Live Site
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-surface-500 font-body uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className={`text-sm text-white ${mono ? 'font-mono' : 'font-body'}`}>
        {value}
      </p>
    </div>
  );
}
