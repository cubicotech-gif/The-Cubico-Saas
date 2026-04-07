'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight, Film, Play } from 'lucide-react';
import type { Service, SiteSettings, MiniFeature, HomeAccent } from '@/lib/types';

interface HomeServicesShowcaseProps {
  services: Service[];
  settings: SiteSettings;
}

const AUTOPLAY_INTERVAL_MS = 5500;
const RESUME_DELAY_AFTER_CLICK_MS = 9000;

// Per-accent color tokens — used for tab borders, glow, and CTA color.
const accent: Record<HomeAccent, { text: string; bg: string; border: string; ring: string; glow: string; from: string; to: string }> = {
  brand:   { text: 'text-brand-400',   bg: 'bg-brand-500',   border: 'border-brand-500',   ring: 'ring-brand-500/40',   glow: 'shadow-brand-600/30',   from: 'from-brand-500/20',   to: 'to-brand-500/0' },
  violet:  { text: 'text-violet-400',  bg: 'bg-violet-500',  border: 'border-violet-500',  ring: 'ring-violet-500/40',  glow: 'shadow-violet-600/30',  from: 'from-violet-500/20',  to: 'to-violet-500/0' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500', ring: 'ring-emerald-500/40', glow: 'shadow-emerald-600/30', from: 'from-emerald-500/20', to: 'to-emerald-500/0' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500',   border: 'border-amber-500',   ring: 'ring-amber-500/40',   glow: 'shadow-amber-600/30',   from: 'from-amber-500/20',   to: 'to-amber-500/0' },
  rose:    { text: 'text-rose-400',    bg: 'bg-rose-500',    border: 'border-rose-500',    ring: 'ring-rose-500/40',    glow: 'shadow-rose-600/30',    from: 'from-rose-500/20',    to: 'to-rose-500/0' },
  teal:    { text: 'text-teal-400',    bg: 'bg-teal-500',    border: 'border-teal-500',    ring: 'ring-teal-500/40',    glow: 'shadow-teal-600/30',    from: 'from-teal-500/20',    to: 'to-teal-500/0' },
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500',    border: 'border-cyan-500',    ring: 'ring-cyan-500/40',    glow: 'shadow-cyan-600/30',    from: 'from-cyan-500/20',    to: 'to-cyan-500/0' },
  fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500', border: 'border-fuchsia-500', ring: 'ring-fuchsia-500/40', glow: 'shadow-fuchsia-600/30', from: 'from-fuchsia-500/20', to: 'to-fuchsia-500/0' },
  sky:     { text: 'text-sky-400',     bg: 'bg-sky-500',     border: 'border-sky-500',     ring: 'ring-sky-500/40',     glow: 'shadow-sky-600/30',     from: 'from-sky-500/20',     to: 'to-sky-500/0' },
};

function getIcon(name: string | undefined) {
  if (!name) return Icons.Box;
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  return Icon ?? Icons.Box;
}

export default function HomeServicesBento({ services, settings }: HomeServicesShowcaseProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-cycle
  useEffect(() => {
    if (paused || services.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % services.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, services.length]);

  function selectTab(i: number) {
    setActive(i);
    setPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setPaused(false), RESUME_DELAY_AFTER_CLICK_MS);
  }

  if (services.length === 0) return null;

  const current = services[active];
  const a = accent[(current.home_accent as HomeAccent) ?? 'brand'] ?? accent.brand;
  const isInternal = current.link_type === 'internal' && current.slug;
  const currentHref = isInternal ? `/services/${current.slug}` : current.link_url;

  return (
    <section id="services" className="relative pt-16 pb-24 bg-surface-950 overflow-hidden">
      {/* Soft section glow tinted by the active accent */}
      <motion.div
        key={`glow-${current.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.8 }}
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] bg-gradient-radial ${a.from} ${a.to} pointer-events-none`}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — compact */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-brand-400 text-xs font-body font-medium tracking-[0.2em] uppercase mb-3">
            {settings.services_eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white max-w-2xl mx-auto leading-tight">
            {settings.services_title}
          </h2>
        </motion.div>

        {/* ── Showcase: tabs (left) + video preview (right) ───────── */}
        <div className="grid lg:grid-cols-[minmax(0,360px)_1fr] gap-6 lg:gap-10 items-start">
          {/* Tabs */}
          <div className="space-y-2 order-2 lg:order-1">
            {services.map((svc, i) => {
              const sa = accent[(svc.home_accent as HomeAccent) ?? 'brand'] ?? accent.brand;
              const Icon = getIcon(svc.icon);
              const isActive = i === active;

              return (
                <button
                  key={svc.id}
                  onClick={() => selectTab(i)}
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  className={`relative w-full text-left p-4 rounded-xl border transition-all duration-300 overflow-hidden group ${
                    isActive
                      ? 'border-surface-700 bg-surface-900'
                      : 'border-surface-800/60 bg-surface-900/40 hover:bg-surface-900/70'
                  }`}
                >
                  {/* Active vertical bar */}
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-[3px] ${sa.bg} transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Active autoplay progress bar */}
                  {isActive && !paused && services.length > 1 && (
                    <motion.span
                      key={`progress-${svc.id}-${active}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: AUTOPLAY_INTERVAL_MS / 1000, ease: 'linear' }}
                      className={`absolute left-0 right-0 bottom-0 h-[2px] ${sa.bg} origin-left`}
                    />
                  )}

                  <div className="flex items-start gap-3 pl-2">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? `bg-surface-800 ${sa.text}` : 'bg-surface-800/60 text-surface-500'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-display font-semibold text-sm transition-colors ${
                          isActive ? 'text-white' : 'text-surface-300'
                        }`}
                      >
                        {svc.title}
                      </p>
                      {svc.home_tagline && (
                        <p className="text-xs text-surface-500 font-body mt-0.5 line-clamp-1">
                          {svc.home_tagline}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Video preview panel */}
          <div className="order-1 lg:order-2">
            <div
              className={`relative rounded-2xl bg-surface-900 border border-surface-800 overflow-hidden shadow-2xl ${a.glow} transition-shadow duration-500`}
            >
              {/* Video */}
              <div className="relative aspect-video bg-surface-950">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    {current.home_video_url ? (
                      <video
                        key={current.home_video_url}
                        src={current.home_video_url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-surface-700">
                        <Film size={44} strokeWidth={1.4} />
                        <p className="text-[10px] font-body mt-2 tracking-[0.2em] uppercase">
                          video coming soon
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Top-edge gradient + counter */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-surface-950/70 to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-surface-950/70 backdrop-blur-sm border border-surface-800 text-[10px] font-body text-surface-400 tabular-nums">
                  {String(active + 1).padStart(2, '0')}
                  <span className="text-surface-600"> / {String(services.length).padStart(2, '0')}</span>
                </div>

                {/* Bottom-edge gradient + Play hint */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-950/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-950/70 backdrop-blur-sm border border-surface-800 text-[10px] font-body text-surface-400">
                  <Play size={9} className={`${a.text} fill-current`} />
                  Live preview
                </div>
              </div>

              {/* Caption strip below the video */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`cap-${current.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="p-5 sm:p-6 border-t border-surface-800"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-1">
                        {current.title}
                      </h3>
                      <p className="text-sm text-surface-400 font-body leading-relaxed max-w-lg">
                        {current.home_tagline || current.description}
                      </p>
                    </div>
                    {isInternal ? (
                      <Link
                        href={currentHref}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 ${a.text} text-sm font-body font-medium transition-colors flex-shrink-0`}
                      >
                        Explore
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <a
                        href={currentHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 ${a.text} text-sm font-body font-medium transition-colors flex-shrink-0`}
                      >
                        Visit
                        <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mini-feature strip */}
        {settings.mini_features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 p-4 rounded-2xl bg-surface-900/40 border border-surface-800/60"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {settings.mini_features.map((f: MiniFeature) => {
                const Icon = getIcon(f.icon);
                return (
                  <div key={f.text} className="flex items-center gap-2">
                    <Icon size={14} className="text-brand-400" />
                    <span className="text-xs text-surface-300 font-body">{f.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
