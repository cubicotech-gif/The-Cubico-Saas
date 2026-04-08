'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight, Film, Play } from 'lucide-react';
import type { Service, SiteSettings, MiniFeature, HomeAccent } from '@/lib/types';
import { useLocale } from '@/i18n/LocaleProvider';

interface HomeServicesShowcaseProps {
  services: Service[];
  settings: SiteSettings;
}

const AUTOPLAY_INTERVAL_MS = 5500;
const RESUME_DELAY_AFTER_CLICK_MS = 9000;

// Per-accent color tokens. Every value here is a literal string so the Tailwind
// JIT scanner can pick them up. Don't refactor to template strings — JIT will
// silently drop dynamically built class names.
const accent: Record<
  HomeAccent,
  { text: string; bg: string; glow: string; hex: string }
> = {
  brand:   { text: 'text-brand-400',   bg: 'bg-brand-500',   glow: 'shadow-brand-600/30',   hex: '#0c93e7' },
  violet:  { text: 'text-violet-400',  bg: 'bg-violet-500',  glow: 'shadow-violet-600/30',  hex: '#8b5cf6' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500', glow: 'shadow-emerald-600/30', hex: '#10b981' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500',   glow: 'shadow-amber-600/30',   hex: '#f59e0b' },
  rose:    { text: 'text-rose-400',    bg: 'bg-rose-500',    glow: 'shadow-rose-600/30',    hex: '#f43f5e' },
  teal:    { text: 'text-teal-400',    bg: 'bg-teal-500',    glow: 'shadow-teal-600/30',    hex: '#14b8a6' },
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500',    glow: 'shadow-cyan-600/30',    hex: '#06b6d4' },
  fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500', glow: 'shadow-fuchsia-600/30', hex: '#d946ef' },
  sky:     { text: 'text-sky-400',     bg: 'bg-sky-500',     glow: 'shadow-sky-600/30',     hex: '#0ea5e9' },
};

function getIcon(name: string | undefined) {
  if (!name) return Icons.Box;
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  return Icon ?? Icons.Box;
}

function getAccent(svc: Service) {
  return accent[(svc.home_accent as HomeAccent) ?? 'brand'] ?? accent.brand;
}

export default function HomeServicesBento({ services, settings }: HomeServicesShowcaseProps) {
  const reducedMotion = useReducedMotion();
  const { locale, dict } = useLocale();

  const [active, setActive] = useState(0);
  // Click-pause and hover-pause are tracked separately so click-pause survives
  // the user moving their cursor off the tab.
  const [clickPaused, setClickPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const paused = clickPaused || hoverPaused;

  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  // Auto-cycle. Skipped entirely if the user prefers reduced motion.
  useEffect(() => {
    if (reducedMotion || paused || services.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % services.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, services.length, reducedMotion]);

  // Cleanup resume timer on unmount.
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Play the active video, pause hidden ones — saves CPU and prevents 4
  // simultaneous decode pipelines.
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === active) {
        vid.play().catch(() => {
          /* autoplay can be blocked; ignore */
        });
      } else {
        vid.pause();
      }
    });
  }, [active]);

  function selectTab(i: number) {
    setActive(i);
    setClickPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(
      () => setClickPaused(false),
      RESUME_DELAY_AFTER_CLICK_MS
    );
  }

  if (services.length === 0) return null;

  const current = services[active];
  const a = getAccent(current);
  const isInternal = current.link_type === 'internal' && current.slug;
  const currentHref = isInternal ? `/${locale}/services/${current.slug}` : current.link_url;

  return (
    <section
      id="services"
      className="relative pt-16 pb-24 bg-surface-950 overflow-hidden scroll-mt-24"
    >
      {/* Soft section glow tinted by the active accent — uses an inline radial
          gradient because Tailwind has no built-in bg-gradient-radial utility. */}
      <motion.div
        key={`glow-${current.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${a.hex}33 0%, ${a.hex}00 70%)`,
        }}
        aria-hidden="true"
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
          <div
            className="space-y-2 order-2 lg:order-1"
            role="tablist"
            aria-label={dict.home.servicesAriaLabel}
          >
            {services.map((svc, i) => {
              const sa = getAccent(svc);
              const Icon = getIcon(svc.icon);
              const isActive = i === active;

              return (
                <button
                  key={svc.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="service-preview"
                  onClick={() => selectTab(i)}
                  onMouseEnter={() => setHoverPaused(true)}
                  onMouseLeave={() => setHoverPaused(false)}
                  className={`relative w-full text-left p-4 pl-5 rounded-xl border transition-all duration-300 overflow-hidden group ${
                    isActive
                      ? 'border-surface-700 bg-surface-900'
                      : 'border-surface-800/60 bg-surface-900/40 hover:bg-surface-900/70'
                  }`}
                >
                  {/* Active vertical bar */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 bottom-0 w-[3px] ${sa.bg} transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive
                          ? `bg-surface-800 ${sa.text}`
                          : 'bg-surface-800/60 text-surface-500'
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
              id="service-preview"
              role="tabpanel"
              className={`relative rounded-2xl bg-surface-900 border border-surface-800 overflow-hidden shadow-2xl ${a.glow} transition-shadow duration-500`}
            >
              {/* Video stack — every video stays mounted; only opacity toggles.
                  Active video plays via the videoRefs effect, hidden ones pause. */}
              <div className="relative aspect-video bg-surface-950">
                {services.map((svc, i) => {
                  const isActiveVideo = i === active;
                  return (
                    <div
                      key={svc.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        isActiveVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                      aria-hidden={!isActiveVideo}
                    >
                      {svc.home_video_url ? (
                        <video
                          ref={(el) => {
                            videoRefs.current[i] = el;
                          }}
                          src={svc.home_video_url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          preload={isActiveVideo ? 'auto' : 'metadata'}
                          aria-label={dict.home.videoPreview.replace('{title}', svc.title)}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-surface-700">
                          <Film size={44} strokeWidth={1.4} />
                          <p className="text-[10px] font-body mt-2 tracking-[0.2em] uppercase">
                            {dict.home.videoComingSoon}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Top-edge gradient + counter */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-surface-950/70 to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-surface-950/70 backdrop-blur-sm border border-surface-800 text-[10px] font-body text-surface-400 tabular-nums">
                  {String(active + 1).padStart(2, '0')}
                  <span className="text-surface-600">
                    {' '}/ {String(services.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom-edge gradient + Play hint */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-950/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-950/70 backdrop-blur-sm border border-surface-800 text-[10px] font-body text-surface-400">
                  <Play size={9} className={`${a.text} fill-current`} />
                  {dict.home.livePreview}
                </div>
              </div>

              {/* Caption strip below the video */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`cap-${current.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
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
                        {dict.home.explore}
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <a
                        href={currentHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 ${a.text} text-sm font-body font-medium transition-colors flex-shrink-0`}
                      >
                        {dict.home.visit}
                        <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mini-feature strip — slimmed down so it doesn't visually compete with
            the showcase above. Single muted line of inline labels, no card. */}
        {settings.mini_features.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {settings.mini_features.map((f: MiniFeature, i: number) => {
              const Icon = getIcon(f.icon);
              return (
                <div key={`${f.text}-${i}`} className="flex items-center gap-1.5">
                  <Icon size={12} className="text-surface-600" />
                  <span className="text-[11px] text-surface-500 font-body tracking-wide">
                    {f.text}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
