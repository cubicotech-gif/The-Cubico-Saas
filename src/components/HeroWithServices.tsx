'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { Service, SiteSettings, HomeAccent } from '@/lib/types';
import { useLocale } from '@/i18n/LocaleProvider';

/* ═══════════════════════════════════════════════════════════════════
   HERO + SERVICES — one viewport, everything at a glance.
   Desktop: hero text left, services grid right.
   Mobile: hero compact on top, services grid below.
   ═══════════════════════════════════════════════════════════════════ */

const MORPH_INTERVAL_MS = 2400;
const MORPH_PLACEHOLDER = '{morph}';

const accent: Record<HomeAccent, { text: string; bg: string; border: string }> = {
  brand:   { text: 'text-brand-400',   bg: 'bg-brand-500/10',   border: 'border-brand-500/20' },
  violet:  { text: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  rose:    { text: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
  teal:    { text: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/20' },
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
  fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
  sky:     { text: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/20' },
};

function getIcon(name: string | undefined) {
  if (!name) return Icons.Box;
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  return Icon ?? Icons.Box;
}

function getAccent(svc: Service) {
  return accent[(svc.home_accent as HomeAccent) ?? 'brand'] ?? accent.brand;
}

function isInternalRoute(url: string) {
  return url.startsWith('/');
}

interface Props {
  settings: SiteSettings;
  services: Service[];
}

export default function HeroWithServices({ settings, services }: Props) {
  const reducedMotion = useReducedMotion();
  const { locale, dict } = useLocale();

  /* ── Morph cycling ── */
  const words =
    settings.hero_morph_words && settings.hero_morph_words.length > 0
      ? settings.hero_morph_words
      : ['websites'];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), MORPH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [words.length, reducedMotion]);

  const hasMorph = settings.hero_title.includes(MORPH_PLACEHOLDER);
  const [prefix, suffix] = hasMorph
    ? settings.hero_title.split(MORPH_PLACEHOLDER)
    : [settings.hero_title, ''];

  const secondaryHref = settings.hero_cta_secondary_url
    ? settings.hero_cta_secondary_url
    : `https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}`;

  const a11yTitle = hasMorph ? `${prefix}${words[0]}${suffix}` : settings.hero_title;

  return (
    <section
      id="services"
      className="h-screen snap-start relative flex flex-col overflow-hidden bg-surface-950 scroll-mt-16"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-brand-600/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-[#FF6B4A]/6 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center pt-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-12 items-center">

            {/* ── LEFT: Hero text ── */}
            <div className="text-center lg:text-left">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-brand-950/60 border border-brand-800/60 text-brand-300 text-[11px] font-body tracking-wide backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                {settings.hero_eyebrow}
              </motion.div>

              {/* Morphing headline */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                aria-label={a11yTitle}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-display font-bold text-white leading-[1.1] tracking-tight mb-4"
              >
                <span aria-hidden="true">
                  {prefix}
                  {hasMorph && (
                    <span className="relative inline-grid align-baseline mx-1">
                      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
                        {words.reduce((a, b) => (a.length > b.length ? a : b), '')}
                      </span>
                      <span className="col-start-1 row-start-1 relative">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={`${index}-${words[index]}`}
                            initial={reducedMotion ? false : { y: '0.7em', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={reducedMotion ? { opacity: 0 } : { y: '-0.7em', opacity: 0 }}
                            transition={{ duration: reducedMotion ? 0.15 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-block whitespace-nowrap bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent"
                          >
                            {words[index]}
                          </motion.span>
                        </AnimatePresence>
                        <motion.span
                          key={`u-${index}`}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 0.55 }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                          className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent origin-center rounded-full"
                        />
                      </span>
                    </span>
                  )}
                  {suffix}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="text-sm sm:text-base text-surface-400 font-body leading-relaxed max-w-md mx-auto lg:mx-0 mb-6"
              >
                {settings.hero_subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5"
              >
                <HeroCTA href={settings.hero_cta_primary_url || '#services'} primary>
                  {settings.hero_cta_primary_label}
                </HeroCTA>
                <HeroCTA href={secondaryHref}>
                  {settings.hero_cta_secondary_label}
                </HeroCTA>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="flex items-center gap-2 text-[11px] text-surface-500 font-body justify-center lg:justify-start"
              >
                <div className="flex -space-x-1.5" aria-hidden="true">
                  {['#0c93e7', '#06b6d4', '#8b5cf6', '#10b981'].map((c, i) => (
                    <span
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-surface-950"
                      style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)` }}
                    />
                  ))}
                </div>
                <span className="tracking-wide">{dict.home.trustStrip}</span>
              </motion.div>
            </div>

            {/* ── RIGHT: Services grid ── */}
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {services.map((svc, i) => {
                  const a = getAccent(svc);
                  const Icon = getIcon(svc.icon);
                  const isInternal = svc.link_type === 'internal' && svc.slug;
                  const href = isInternal ? `/${locale}/services/${svc.slug}` : svc.link_url;

                  const card = (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                      className={`group relative p-3.5 sm:p-4 rounded-xl border ${a.border} ${a.bg} hover:bg-surface-800/60 backdrop-blur-sm transition-all duration-300 cursor-pointer`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${a.text} bg-surface-950/60`}>
                        <Icon size={18} />
                      </div>
                      <h3 className="font-display font-semibold text-white text-xs sm:text-sm mb-0.5 group-hover:text-brand-300 transition-colors leading-tight">
                        {svc.title}
                      </h3>
                      {svc.home_tagline && (
                        <p className="text-[10px] sm:text-[11px] text-surface-500 font-body leading-snug line-clamp-2">
                          {svc.home_tagline}
                        </p>
                      )}
                      <ArrowRight
                        size={12}
                        className={`absolute top-3.5 right-3.5 ${a.text} opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5`}
                      />
                    </motion.div>
                  );

                  if (isInternal) {
                    return <Link key={svc.id} href={href} className="block">{card}</Link>;
                  }
                  return (
                    <a key={svc.id} href={href} target="_blank" rel="noopener noreferrer" className="block">
                      {card}
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 pb-6 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-surface-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── CTA button ── */

function HeroCTA({
  href,
  primary = false,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  const className = primary
    ? 'px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/30 font-body text-sm'
    : 'px-6 py-2.5 bg-surface-900/70 hover:bg-surface-800 text-white font-medium rounded-xl transition-colors border border-surface-700 backdrop-blur-sm font-body text-sm';

  if (isInternalRoute(href)) {
    return <Link href={href} className={className}>{children}</Link>;
  }

  const isExternal = href.startsWith('http');
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {children}
    </a>
  );
}
