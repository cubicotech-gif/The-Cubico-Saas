'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Box,
  AlertCircle,
  ImageIcon,
  Upload,
  Trash2,
  Check,
  Loader2,
  Film,
  Package,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import { MEDIA_SLOTS, getSlotsBySection } from '@/lib/media';
import type { MediaSlot, MediaAsset } from '@/lib/media';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminServices from '@/components/admin/AdminServices';
import AdminSettings from '@/components/admin/AdminSettings';

// ── Media Upload Card ────────────────────────────────────────────────────────

function MediaUploadCard({
  slot,
  asset,
  hasSupabase,
  onUpload,
  onDelete,
}: {
  slot: MediaSlot;
  asset?: MediaAsset;
  hasSupabase: boolean;
  onUpload: (slotKey: string, file: File) => Promise<void>;
  onDelete: (slotKey: string) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isVideo = slot.accept.includes('video');

  async function handleFile(file: File) {
    setUploading(true);
    try {
      await onUpload(slot.key, file);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="p-4 rounded-xl bg-surface-900 border border-surface-800">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-body font-medium text-white">{slot.label}</p>
          <p className="text-xs text-surface-500 font-body mt-0.5">{slot.hint}</p>
          <p className="text-[10px] text-surface-600 font-body mt-1">
            Recommended: {slot.width} x {slot.height}px
          </p>
        </div>
        {isVideo ? (
          <Film size={16} className="text-surface-600 flex-shrink-0 mt-0.5" />
        ) : (
          <ImageIcon size={16} className="text-surface-600 flex-shrink-0 mt-0.5" />
        )}
      </div>

      <div
        className={`relative w-full aspect-[16/10] rounded-lg overflow-hidden border transition-colors ${
          dragOver
            ? 'border-brand-500 bg-brand-950/30'
            : 'border-surface-700 bg-surface-800/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {asset?.url ? (
          <>
            {isVideo ? (
              <video
                src={asset.url}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={asset.url}
                alt={slot.label}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-surface-950/0 hover:bg-surface-950/60 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={!hasSupabase || uploading}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-lg font-body transition-colors"
              >
                Replace
              </button>
              <button
                onClick={() => onDelete(slot.key)}
                disabled={!hasSupabase}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-lg font-body transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-surface-950/70 backdrop-blur-sm rounded text-[10px] text-surface-300 font-body flex items-center gap-1">
              <Check size={10} className="text-emerald-400" />
              {asset.file_name}
            </div>
          </>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={!hasSupabase || uploading}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 size={24} className="text-brand-400 animate-spin" />
            ) : (
              <>
                <Upload size={20} className="text-surface-500 mb-2" />
                <p className="text-xs text-surface-400 font-body">
                  {hasSupabase ? 'Click or drag to upload' : 'Supabase required'}
                </p>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={slot.accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ── Main Admin Panel ────────────────────────────────────────────────────────

export default function AdminPanel({ currentUserId }: { currentUserId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<'orders' | 'services' | 'media' | 'settings'>('orders');
  const [hasSupabase, setHasSupabase] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<Record<string, MediaAsset>>({});
  const [mediaLoading, setMediaLoading] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    setHasSupabase(Boolean(url && key));
  }, []);

  useEffect(() => {
    if (tab === 'media' && hasSupabase && Object.keys(mediaAssets).length === 0) {
      loadMedia();
    }
  }, [tab, hasSupabase]);

  async function loadMedia() {
    setMediaLoading(true);
    try {
      const { getMediaAssets } = await import('@/lib/mediaData');
      const assets = await getMediaAssets();
      setMediaAssets(assets);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setMediaLoading(false);
    }
  }

  async function handleUpload(slotKey: string, file: File) {
    try {
      const { uploadMediaAsset } = await import('@/lib/mediaData');
      const asset = await uploadMediaAsset(slotKey, file);
      if (asset) {
        setMediaAssets((prev) => ({ ...prev, [slotKey]: asset }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }

  async function handleDelete(slotKey: string) {
    try {
      const { deleteMediaAsset } = await import('@/lib/mediaData');
      const ok = await deleteMediaAsset(slotKey);
      if (ok) {
        setMediaAssets((prev) => {
          const next = { ...prev };
          delete next[slotKey];
          return next;
        });
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  const slotsBySection = getSlotsBySection();

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
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-white transition-colors font-body"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                variables to enable editing and media uploads.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-surface-900 rounded-xl w-fit">
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-body ${
              tab === 'orders'
                ? 'bg-surface-800 text-white'
                : 'text-surface-500 hover:text-white'
            }`}
          >
            <Package size={14} />
            Orders
          </button>
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
            onClick={() => setTab('media')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors font-body ${
              tab === 'media'
                ? 'bg-surface-800 text-white'
                : 'text-surface-500 hover:text-white'
            }`}
          >
            <ImageIcon size={14} />
            Media
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
            Settings
          </button>
        </div>

        {tab === 'orders' && <AdminOrders hasSupabase={hasSupabase} currentUserId={currentUserId} />}

        {tab === 'services' && <AdminServices hasSupabase={hasSupabase} />}

        {tab === 'media' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-white">
                  Media Manager
                </h2>
                <p className="text-xs text-surface-500 font-body mt-0.5">
                  Upload images and videos for every section of your website.
                  Each slot shows the recommended size and format.
                </p>
              </div>
              {hasSupabase && (
                <button
                  onClick={loadMedia}
                  disabled={mediaLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs rounded-lg transition-colors font-body"
                >
                  {mediaLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </button>
              )}
            </div>

            {Object.entries(slotsBySection).map(([section, slots]) => {
              const uploaded = slots.filter((s) => mediaAssets[s.key]).length;
              return (
                <div key={section} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-display font-semibold text-white">
                      {section}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-800 text-surface-400 font-body">
                      {uploaded}/{slots.length} uploaded
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {slots.map((slot) => (
                      <MediaUploadCard
                        key={slot.key}
                        slot={slot}
                        asset={mediaAssets[slot.key]}
                        hasSupabase={hasSupabase}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="mt-8 p-4 rounded-xl bg-surface-900 border border-surface-800">
              <p className="text-sm text-surface-300 font-body">
                <span className="text-white font-medium">
                  {Object.keys(mediaAssets).length}
                </span>{' '}
                of{' '}
                <span className="text-white font-medium">
                  {MEDIA_SLOTS.length}
                </span>{' '}
                media slots filled.{' '}
                {!hasSupabase && (
                  <span className="text-amber-400">
                    Connect Supabase to start uploading.
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {tab === 'settings' && <AdminSettings hasSupabase={hasSupabase} />}
      </div>
    </div>
  );
}
