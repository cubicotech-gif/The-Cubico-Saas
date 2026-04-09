'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { Service, SiteSettings, HomeAccent } from '@/lib/types';
import { useLocale } from '@/i18n/LocaleProvider';

const MORPH_INTERVAL_MS = 2400;
const MORPH_PLACEHOLDER = '{morph}';

const accentMap: Record<HomeAccent, { text: string; hex: string; glow: string }> = {
  brand:   { text: 'text-brand-400',   hex: '#0c93e7', glow: '0 0 20px rgba(12,147,231,0.3)' },
  violet:  { text: 'text-violet-400',  hex: '#8b5cf6', glow: '0 0 20px rgba(139,92,246,0.3)' },
  emerald: { text: 'text-emerald-400', hex: '#10b981', glow: '0 0 20px rgba(16,185,129,0.3)' },
  amber:   { text: 'text-amber-400',   hex: '#f59e0b', glow: '0 0 20px rgba(245,158,11,0.3)' },
  rose:    { text: 'text-rose-400',    hex: '#f43f5e', glow: '0 0 20px rgba(244,63,94,0.3)' },
  teal:    { text: 'text-teal-400',    hex: '#14b8a6', glow: '0 0 20px rgba(20,184,166,0.3)' },
  cyan:    { text: 'text-cyan-400',    hex: '#06b6d4', glow: '0 0 20px rgba(6,182,212,0.3)' },
  fuchsia: { text: 'text-fuchsia-400', hex: '#d946ef', glow: '0 0 20px rgba(217,70,239,0.3)' },
  sky:     { text: 'text-sky-400',     hex: '#0ea5e9', glow: '0 0 20px rgba(14,165,233,0.3)' },
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
}

export default function HeroWithServices({ settings, services }: Props) {
  const reducedMotion = useReducedMotion();
  const { locale, dict } = useLocale();

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
      className="h-screen snap-start relative flex flex-col overflow-hidden bg-[#060d18] scroll-mt-16"
    >
      {/* ── Animated background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={reducedMotion ? {} : { x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] left-[15%] w-[450px] h-[350px] bg-brand-600/15 rounded-full blur-[130px]"
        />
        <motion.div
          animate={reducedMotion ? {} : { x: [0, -25, 15, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[15%] right-[10%] w-[400px] h-[300px] bg-[#FF6B4A]/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={reducedMotion ? {} : { x: [0, 15, -10, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[100px]"
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex items-center pt-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-14 items-center">

            {/* ── LEFT: Hero text ── */}
            <div className="text-center lg:text-left">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-white/[0.04] border border-white/[0.08] text-brand-300 text-[11px] font-body tracking-wide backdrop-blur-sm"
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
                className="text-[1.7rem] sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-display font-bold text-white leading-[1.1] tracking-tight mb-4"
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
                className="text-sm sm:text-base text-surface-400 font-body leading-relaxed max-w-md mx-auto lg:mx-0 mb-6"
              >
                {settings.hero_subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.22 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6"
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
                className="flex items-center gap-2.5 text-[11px] text-surface-500 font-body justify-center lg:justify-start"
              >
                <div className="flex -space-x-1.5" aria-hidden="true">
                  {['#0c93e7', '#06b6d4', '#8b5cf6', '#10b981'].map((c, i) => (
                    <span
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-[#060d18]"
                      style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)` }}
                    />
                  ))}
                </div>
                <span className="tracking-wide">{dict.home.trustStrip}</span>
              </motion.div>
            </div>

            {/* ── RIGHT: Services bento grid ── */}
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {services.map((svc, i) => {
                  const a = getAccent(svc);
                  const Icon = getIcon(svc.icon);
                  const isInternal = svc.link_type === 'internal' && svc.slug;
                  const href = isInternal ? `/${locale}/services/${svc.slug}` : svc.link_url;

                  const card = (
                    <motion.div
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, delay: 0.15 + i * 0.07 }}
                      whileHover={reducedMotion ? {} : { y: -4, scale: 1.02 }}
                      className="group relative p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm cursor-pointer transition-colors duration-300 hover:bg-white/[0.06] hover:border-white/[0.14]"
                      style={{
                        // @ts-expect-error -- CSS custom property for hover glow
                        '--card-glow': a.glow,
                      }}
                    >
                      {/* Hover glow overlay */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${a.hex}15 0%, transparent 70%)`,
                        }}
                      />

                      {/* Icon with accent gradient */}
                      <div
                        className="relative w-10 h-10 rounded-lg flex items-center justify-center mb-2.5"
                        style={{
                          background: `linear-gradient(135deg, ${a.hex}20, ${a.hex}08)`,
                          border: `1px solid ${a.hex}25`,
                        }}
                      >
                        <Icon size={18} className={a.text} />
                      </div>

                      {/* Title */}
                      <h3 className="relative font-display font-semibold text-white text-xs sm:text-sm mb-0.5 leading-tight transition-colors duration-300">
                        {svc.title}
                      </h3>

                      {/* Tagline */}
                      {svc.home_tagline && (
                        <p className="relative text-[10px] sm:text-[11px] text-surface-500 font-body leading-snug line-clamp-2">
                          {svc.home_tagline}
                        </p>
                      )}

                      {/* Arrow */}
                      <ArrowRight
                        size={12}
                        className={`absolute top-3.5 right-3.5 ${a.text} opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5`}
                      />

                      {/* Bottom accent line on hover */}
                      <div
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(90deg, transparent, ${a.hex}60, transparent)` }}
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
        className="relative z-10 pb-5 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
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
    ? 'group relative px-7 py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-600/25 hover:scale-[1.02] font-body text-sm'
    : 'px-7 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white font-medium rounded-xl transition-all duration-300 border border-white/[0.1] hover:border-white/[0.2] backdrop-blur-sm font-body text-sm';

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
