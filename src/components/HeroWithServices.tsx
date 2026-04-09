'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { Service, SiteSettings, HomeAccent } from '@/lib/types';
import type { MediaAsset } from '@/lib/media';
import { useLocale } from '@/i18n/LocaleProvider';

const MORPH_INTERVAL_MS = 2400;
const MORPH_PLACEHOLDER = '{morph}';

const accentMap: Record<HomeAccent, { text: string; hex: string }> = {
  brand:   { text: 'text-brand-400',   hex: '#0c93e7' },
  violet:  { text: 'text-violet-400',  hex: '#8b5cf6' },
  emerald: { text: 'text-emerald-400', hex: '#10b981' },
  amber:   { text: 'text-amber-400',   hex: '#f59e0b' },
  rose:    { text: 'text-rose-400',    hex: '#f43f5e' },
  teal:    { text: 'text-teal-400',    hex: '#14b8a6' },
  cyan:    { text: 'text-cyan-400',    hex: '#06b6d4' },
  fuchsia: { text: 'text-fuchsia-400', hex: '#d946ef' },
  sky:     { text: 'text-sky-400',     hex: '#0ea5e9' },
};

function getIcon(name: string | undefined) {
  if (!name) return Icons.Box;
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  return Icon ?? Icons.Box;
}

function getAccent(svc: Service) {
  return accentMap[(svc.home_accent as HomeAccent) ?? 'brand'] ?? accentMap.brand;
}

function isInternalRoute(url: string) {
  return url.startsWith('/');
}

interface Props {
  settings: SiteSettings;
  services: Service[];
  media: Record<string, MediaAsset>;
}

export default function HeroWithServices({ settings, services, media }: Props) {
  const reducedMotion = useReducedMotion();
  const { locale, dict } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const heroVideo = media['webdev-hero-video'];
  const heroImage = media['webdev-hero-mockup'];

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

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, [heroVideo?.url]);

  const hasMorph = settings.hero_title.includes(MORPH_PLACEHOLDER);
  const [prefix, suffix] = hasMorph
    ? settings.hero_title.split(MORPH_PLACEHOLDER)
    : [settings.hero_title, ''];

  const secondaryHref = settings.hero_cta_secondary_url
    ? settings.hero_cta_secondary_url
    : `https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}`;

  const a11yTitle = hasMorph ? `${prefix}${words[0]}${suffix}` : settings.hero_title;

  const hasVisual = heroVideo?.url || heroImage?.url;

  return (
    <section
      id="services"
      className="h-screen snap-start relative flex flex-col overflow-hidden bg-[#060d18] scroll-mt-16"
    >
      {/* ── Animated background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={reducedMotion ? {} : { x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[5%] left-[10%] w-[500px] h-[400px] bg-brand-600/12 rounded-full blur-[140px]"
        />
        <motion.div
          animate={reducedMotion ? {} : { x: [0, -25, 15, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[10%] right-[5%] w-[450px] h-[350px] bg-[#FF6B4A]/8 rounded-full blur-[130px]"
        />
        <motion.div
          animate={reducedMotion ? {} : { x: [0, 15, -10, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[40%] left-[45%] w-[350px] h-[350px] bg-violet-600/8 rounded-full blur-[120px]"
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center pt-16 pb-4">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Three-column: text | visual | services */}
          <div className={`grid items-center gap-6 lg:gap-8 ${
            hasVisual
              ? 'lg:grid-cols-[1fr_1.1fr_1fr]'
              : 'lg:grid-cols-[1fr_1.3fr]'
          }`}>

            {/* ── COL 1: Hero text ── */}
            <div className="text-center lg:text-left order-1">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-white/[0.04] border border-white/[0.08] text-brand-300 text-[11px] font-body tracking-wide backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                {settings.hero_eyebrow}
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                aria-label={a11yTitle}
                className="text-[1.5rem] sm:text-[1.7rem] lg:text-3xl xl:text-4xl font-display font-bold text-white leading-[1.1] tracking-tight mb-3"
              >
                <span aria-hidden="true">
                  {prefix}
                  {hasMorph && (
                    <span className="relative inline-grid align-baseline mx-0.5 sm:mx-1">
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
                            className="inline-block whitespace-nowrap bg-gradient-to-r from-brand-300 via-brand-400 to-cyan-400 bg-clip-text text-transparent"
                          >
                            {words[index]}
                          </motion.span>
                        </AnimatePresence>
                        <motion.span
                          key={`u-${index}`}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 0.6 }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                          className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent origin-center rounded-full"
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
                className="text-xs sm:text-sm text-surface-400 font-body leading-relaxed max-w-sm mx-auto lg:mx-0 mb-5"
              >
                {settings.hero_subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22 }}
                className="flex flex-col sm:flex-row gap-2.5 justify-center lg:justify-start mb-5"
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
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-2 text-[10px] sm:text-[11px] text-surface-500 font-body justify-center lg:justify-start"
              >
                <div className="flex -space-x-1.5" aria-hidden="true">
                  {['#0c93e7', '#06b6d4', '#8b5cf6', '#10b981'].map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#060d18]"
                      style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)` }}
                    />
                  ))}
                </div>
                <span className="tracking-wide">{dict.home.trustStrip}</span>
              </motion.div>
            </div>

            {/* ── COL 2: Visual centerpiece ── */}
            {hasVisual && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative order-2 hidden lg:block"
              >
                {/* Light rays behind the visual */}
                <div className="absolute inset-0 -inset-x-16 -inset-y-16 pointer-events-none" aria-hidden="true">
                  {/* Colored light streaks */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]"
                    style={{
                      background: `
                        conic-gradient(
                          from 0deg at 50% 50%,
                          transparent 0deg,
                          rgba(12,147,231,0.12) 30deg,
                          transparent 60deg,
                          rgba(139,92,246,0.1) 120deg,
                          transparent 150deg,
                          rgba(255,107,74,0.1) 200deg,
                          transparent 230deg,
                          rgba(6,182,212,0.1) 280deg,
                          transparent 310deg,
                          rgba(16,185,129,0.08) 340deg,
                          transparent 360deg
                        )
                      `,
                      filter: 'blur(20px)',
                    }}
                  />
                  {/* Center glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-500/10 rounded-full blur-[60px]" />
                </div>

                {/* The visual itself */}
                <div className="relative rounded-2xl overflow-hidden">
                  {heroVideo?.url ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: videoLoaded ? 1 : 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <video
                        ref={videoRef}
                        src={heroVideo.url}
                        muted
                        autoPlay
                        loop
                        playsInline
                        onLoadedData={() => setVideoLoaded(true)}
                        className="w-full h-auto rounded-2xl"
                      />
                    </motion.div>
                  ) : heroImage?.url ? (
                    <img
                      src={heroImage.url}
                      alt=""
                      className="w-full h-auto rounded-2xl"
                    />
                  ) : null}

                  {/* Glass rim */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                </div>
              </motion.div>
            )}

            {/* ── COL 3 (or COL 2 if no visual): Service cards ── */}
            <div className={`order-3 ${hasVisual ? '' : 'order-2'}`}>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {services.slice(0, 6).map((svc, i) => {
                  const a = getAccent(svc);
                  const isInternal = svc.link_type === 'internal' && svc.slug;
                  const href = isInternal ? `/${locale}/services/${svc.slug}` : svc.link_url;

                  const card = (
                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                      whileHover={reducedMotion ? {} : { x: 4 }}
                      className="group relative flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden"
                      style={{
                        borderLeft: `2px solid ${a.hex}50`,
                      }}
                    >
                      {/* Background — appears on hover */}
                      <div
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: `linear-gradient(90deg, ${a.hex}10 0%, transparent 100%)`,
                        }}
                      />

                      {/* Service name */}
                      <span className="relative font-display font-medium text-surface-300 text-xs sm:text-sm tracking-wide group-hover:text-white transition-colors duration-300">
                        {svc.title}
                      </span>

                      {/* Arrow */}
                      <ArrowRight
                        size={12}
                        className={`relative flex-shrink-0 ${a.text} opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5`}
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

          {/* ── Bottom strip: mini-features / ecosystem label ── */}
          {settings.mini_features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 lg:mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 border-t border-white/[0.04]"
            >
              {settings.mini_features.map((f, i) => {
                const FeatIcon = getIcon(f.icon);
                return (
                  <div key={`${f.text}-${i}`} className="flex items-center gap-1.5">
                    <FeatIcon size={12} className="text-surface-600" />
                    <span className="text-[10px] sm:text-[11px] text-surface-500 font-body tracking-wide">
                      {f.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 pb-4 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} className="text-surface-600" />
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
    ? 'px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-600/25 hover:scale-[1.02] font-body text-xs sm:text-sm'
    : 'px-6 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium rounded-xl transition-all duration-300 border border-white/[0.1] hover:border-white/[0.2] backdrop-blur-sm font-body text-xs sm:text-sm';

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
