'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Loader2,
  Check,
  AlertCircle,
  ChevronDown,
  Upload,
  Trash2,
  Film,
  ExternalLink,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import {
  getServices,
  updateService,
  uploadServiceVideo,
  deleteServiceVideo,
} from '@/lib/data';
import type { Service, HomeAccent } from '@/lib/types';

const ACCENTS: HomeAccent[] = [
  'brand',
  'violet',
  'emerald',
  'amber',
  'rose',
  'teal',
  'cyan',
  'fuchsia',
  'sky',
];

const categoryLabels: Record<string, string> = {
  institution: 'Institution',
  healthcare: 'Healthcare',
  individual: 'Individual',
  creative: 'Creative',
};

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function AdminServices({ hasSupabase }: { hasSupabase: boolean }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    getServices()
      .then((s) => setServices(s))
      .finally(() => setLoading(false));
  }, [hasSupabase]);

  function patchService(id: string, patch: Partial<Service>) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-surface-400 text-sm font-body">
        <Loader2 size={14} className="animate-spin" /> Loading services…
      </div>
    );
  }

  return (
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

      <p className="text-xs text-surface-500 font-body mb-4">
        Click any service to edit it. Toggle{' '}
        <span className="text-surface-300">Show on home</span> to feature it in the
        homepage bento grid, then upload a short video for that card.
      </p>

      <div className="space-y-2">
        {services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            isOpen={openId === service.id}
            onToggle={() => setOpenId(openId === service.id ? null : service.id)}
            onPatch={(p) => patchService(service.id, p)}
            hasSupabase={hasSupabase}
          />
        ))}
      </div>
    </div>
  );
}

// ── Single service row ──────────────────────────────────────────────────────

function ServiceRow({
  service,
  isOpen,
  onToggle,
  onPatch,
  hasSupabase,
}: {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
  onPatch: (p: Partial<Service>) => void;
  hasSupabase: boolean;
}) {
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setSaveState('saving');
    setErrorMsg('');
    const ok = await updateService(service.id, {
      title: service.title,
      description: service.description,
      home_tagline: service.home_tagline,
      home_accent: service.home_accent,
      show_on_home: service.show_on_home,
      home_order: service.home_order,
    });
    if (!ok) {
      setSaveState('error');
      setErrorMsg('Save failed');
      return;
    }
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 2500);
  }

  async function handleVideoUpload(file: File) {
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadServiceVideo(service.id, file);
      onPatch({ home_video_url: url });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed.';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  }

  async function handleVideoDelete() {
    setUploading(true);
    setUploadError('');
    try {
      const ok = await deleteServiceVideo(service.id, service.home_video_url);
      if (ok) {
        onPatch({ home_video_url: null });
      } else {
        setUploadError('Failed to remove the video.');
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-xl bg-surface-900 border border-surface-800 overflow-hidden">
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface-800/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
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
            {service.show_on_home && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 font-body whitespace-nowrap">
                home
              </span>
            )}
            {service.home_video_url && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-950/50 text-violet-400 font-body whitespace-nowrap flex items-center gap-1">
                <Film size={10} /> video
              </span>
            )}
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
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-surface-500 hover:text-white transition-colors"
              title="Visit"
            >
              <ExternalLink size={15} />
            </a>
          )}
          <ChevronDown
            size={16}
            className={`text-surface-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Expanded editor */}
      {isOpen && (
        <div className="border-t border-surface-800 p-5 space-y-5 bg-surface-950/40">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <input
                className={inputCls + ' w-full'}
                value={service.title}
                onChange={(e) => onPatch({ title: e.target.value })}
              />
            </div>
            <div>
              <Label>Home Tagline</Label>
              <input
                className={inputCls + ' w-full'}
                placeholder="One-line pitch shown on the homepage card"
                value={service.home_tagline ?? ''}
                onChange={(e) => onPatch({ home_tagline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              rows={3}
              className={inputCls + ' w-full resize-none'}
              value={service.description}
              onChange={(e) => onPatch({ description: e.target.value })}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Home Accent</Label>
              <select
                className={inputCls + ' w-full'}
                value={service.home_accent ?? 'brand'}
                onChange={(e) => onPatch({ home_accent: e.target.value as HomeAccent })}
              >
                {ACCENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Home Order</Label>
              <input
                type="number"
                className={inputCls + ' w-full'}
                value={service.home_order ?? 0}
                onChange={(e) => onPatch({ home_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Show on Home</Label>
              <button
                onClick={() => onPatch({ show_on_home: !service.show_on_home })}
                className={`w-full px-4 py-2 rounded-lg text-sm font-body border transition-colors ${
                  service.show_on_home
                    ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800'
                    : 'bg-surface-900 text-surface-400 border-surface-700'
                }`}
              >
                {service.show_on_home ? 'Visible' : 'Hidden'}
              </button>
            </div>
          </div>

          {/* Video uploader */}
          <div>
            <Label>Home Card Video</Label>
            <div className="flex items-stretch gap-3">
              <div className="relative w-48 aspect-video rounded-lg overflow-hidden border border-surface-700 bg-surface-800/50 flex-shrink-0">
                {service.home_video_url ? (
                  <video
                    key={service.home_video_url}
                    src={service.home_video_url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-surface-600">
                    <Film size={24} />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-surface-950/70 flex items-center justify-center">
                    <Loader2 size={20} className="text-brand-400 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={!hasSupabase || uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-800 hover:bg-surface-700 text-white text-xs rounded-lg font-body transition-colors disabled:opacity-50"
                >
                  <Upload size={12} />
                  {service.home_video_url ? 'Replace video' : 'Upload video'}
                </button>
                {service.home_video_url && (
                  <button
                    onClick={handleVideoDelete}
                    disabled={!hasSupabase || uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 text-xs rounded-lg font-body transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={12} /> Remove video
                  </button>
                )}
                <p className="text-[10px] text-surface-600 font-body">
                  MP4 / WebM, max 50 MB. Looped, muted, autoplay.
                </p>
                {uploadError && (
                  <p className="text-[11px] text-rose-400 font-body flex items-center gap-1 mt-1">
                    <AlertCircle size={11} />
                    {uploadError}
                  </p>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(file);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          {/* Save bar */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-800">
            {saveState === 'saved' && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-body">
                <Check size={12} /> Saved
              </span>
            )}
            {saveState === 'error' && (
              <span className="flex items-center gap-1 text-xs text-rose-400 font-body">
                <AlertCircle size={12} /> {errorMsg}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasSupabase || saveState === 'saving'}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors font-body text-sm flex items-center gap-2"
            >
              {saveState === 'saving' ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls =
  'px-3 py-2 bg-surface-900 border border-surface-700 rounded-lg text-white font-body text-sm outline-none focus:border-brand-500 disabled:opacity-50';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs text-surface-500 font-body mb-1.5 uppercase tracking-widest">
      {children}
    </label>
  );
}
