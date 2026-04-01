'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  ArrowLeft,
  Settings,
  Box,
  ExternalLink,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { seedServices, seedSettings } from '@/data/seeds';
import type { Service, SiteSettings } from '@/lib/types';

const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'cubico-admin-2026';

const categoryLabels: Record<string, string> = {
  institution: 'Institution',
  healthcare: 'Healthcare',
  individual: 'Individual',
  creative: 'Creative',
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'services' | 'settings'>('services');
  const [services] = useState<Service[]>(seedServices);
  const [settings] = useState<SiteSettings>(seedSettings);
  const [hasSupabase, setHasSupabase] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    setHasSupabase(Boolean(url && key));
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-950 border border-brand-800 text-brand-400 mb-4">
              <Lock size={20} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              Admin Access
            </h1>
            <p className="text-sm text-surface-500 font-body">
              Cubico Technologies
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-body text-surface-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-surface-900 border border-surface-700 focus:border-brand-600 rounded-xl text-white placeholder-surface-600 font-body text-sm outline-none transition-colors"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-rose-400 text-sm font-body flex items-center gap-1.5">
                <AlertCircle size={14} />
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-colors font-body"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-surface-600 font-body">
            Default password:{' '}
            <code className="text-surface-400">cubico-admin-2026</code>
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-white transition-colors font-body"
            >
              <ArrowLeft size={14} />
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Top bar */}
      <div className="border-b border-surface-800 bg-surface-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-white transition-colors font-body"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Site</span>
            </Link>
            <span className="text-surface-700">|</span>
            <p className="font-display font-semibold text-white text-sm">
              Admin Panel
            </p>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-xs text-surface-500 hover:text-white transition-colors font-body"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Supabase notice */}
        {!hasSupabase && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-800 flex gap-3">
            <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300 font-body">
                Supabase not connected — showing seed data (read-only)
              </p>
              <p className="text-xs text-amber-500 font-body mt-0.5">
                Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment
                variables to enable editing.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-surface-900 rounded-xl w-fit">
          <button
            onClick={() => setTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-body ${
              tab === 'services'
                ? 'bg-surface-800 text-white'
                : 'text-surface-500 hover:text-white'
            }`}
          >
            <Box size={14} />
            Services
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-body ${
              tab === 'settings'
                ? 'bg-surface-800 text-white'
                : 'text-surface-500 hover:text-white'
            }`}
          >
            <Settings size={14} />
            Site Settings
          </button>
        </div>

        {/* Services tab */}
        {tab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-white">
                Services ({services.length})
              </h2>
              {!hasSupabase && (
                <span className="text-xs text-surface-500 font-body">
                  Read-only without Supabase
                </span>
              )}
            </div>

            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-900 border border-surface-800"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-white text-sm font-body truncate">
                        {service.title}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-800 text-surface-400 font-body whitespace-nowrap">
                        {categoryLabels[service.category]}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-body whitespace-nowrap ${
                          service.link_type === 'external'
                            ? 'bg-amber-950/50 text-amber-400'
                            : 'bg-brand-950 text-brand-400'
                        }`}
                      >
                        {service.link_type}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 font-body truncate">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {service.link_type === 'internal' && service.slug ? (
                      <Link
                        href={`/services/${service.slug}`}
                        target="_blank"
                        className="p-1.5 text-surface-500 hover:text-white transition-colors"
                        title="Preview"
                      >
                        <Eye size={15} />
                      </Link>
                    ) : (
                      <a
                        href={service.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-surface-500 hover:text-white transition-colors"
                        title="Visit"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.is_active ? 'bg-emerald-400' : 'bg-surface-600'
                      }`}
                      title={service.is_active ? 'Active' : 'Inactive'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings tab */}
        {tab === 'settings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-white">
                Site Settings
              </h2>
              {!hasSupabase && (
                <span className="text-xs text-surface-500 font-body">
                  Read-only without Supabase
                </span>
              )}
            </div>

            <div className="max-w-xl space-y-4">
              {(
                [
                  ['hero_title', 'Hero Title'],
                  ['hero_subtitle', 'Hero Subtitle'],
                  ['contact_whatsapp', 'WhatsApp Number'],
                  ['contact_email', 'Contact Email'],
                  ['footer_text', 'Footer Text'],
                ] as [keyof SiteSettings, string][]
              ).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs text-surface-500 font-body mb-1.5 uppercase tracking-widest">
                    {label}
                  </label>
                  {key === 'hero_subtitle' || key === 'footer_text' ? (
                    <textarea
                      defaultValue={settings[key]}
                      disabled={!hasSupabase}
                      rows={3}
                      className="w-full px-4 py-3 bg-surface-900 border border-surface-700 rounded-xl text-white font-body text-sm outline-none disabled:opacity-50 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      defaultValue={settings[key]}
                      disabled={!hasSupabase}
                      className="w-full px-4 py-3 bg-surface-900 border border-surface-700 rounded-xl text-white font-body text-sm outline-none disabled:opacity-50"
                    />
                  )}
                </div>
              ))}

              {hasSupabase && (
                <button className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-colors font-body text-sm">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
