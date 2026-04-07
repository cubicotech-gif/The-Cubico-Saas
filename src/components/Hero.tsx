'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SiteSettings } from '@/lib/types';

interface HeroProps {
  settings: SiteSettings;
}

const MORPH_INTERVAL_MS = 2400;
const MORPH_PLACEHOLDER = '{morph}';

export default function Hero({ settings }: HeroProps) {
  const words =
    settings.hero_morph_words && settings.hero_morph_words.length > 0
      ? settings.hero_morph_words
      : ['websites'];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), MORPH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [words.length]);

  const [prefix, suffix] = settings.hero_title.includes(MORPH_PLACEHOLDER)
    ? settings.hero_title.split(MORPH_PLACEHOLDER)
    : [settings.hero_title, ''];

  const secondaryHref = settings.hero_cta_secondary_url
    ? settings.hero_cta_secondary_url
    : `https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}`;

  // Reserve horizontal space for the longest word so siblings don't reflow
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), '');

  return (
    <section className="relative flex items-center overflow-hidden bg-surface-950 pt-28 pb-14 sm:pt-32 sm:pb-16">
      {/* Background — single soft gradient + faint grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[420px] bg-brand-600/15 rounded-full blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-brand-950/60 border border-brand-800/60 text-brand-300 text-[11px] font-body tracking-wide backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          {settings.hero_eyebrow}
        </motion.div>

        {/* Morphing headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-[2.25rem] sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.05] tracking-tight mb-5"
        >
          {prefix}
          {settings.hero_title.includes(MORPH_PLACEHOLDER) && (
            <span
              className="relative inline-block align-baseline mx-1 sm:mx-2"
              style={{ minWidth: `${longestWord.length * 0.55}ch` }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ y: '0.7em', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-0.7em', opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
              <motion.span
                key={`u-${words[index]}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.55 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute left-0 right-0 -bottom-0.5 sm:-bottom-1 h-[3px] bg-gradient-to-r from-transparent via-brand-500 to-transparent origin-center rounded-full"
              />
            </span>
          )}
          {suffix}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-sm sm:text-base text-surface-400 font-body leading-relaxed max-w-xl mx-auto mb-7"
        >
          {settings.hero_subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-7"
        >
          <a
            href={settings.hero_cta_primary_url || '#services'}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/30 font-body text-sm"
          >
            {settings.hero_cta_primary_label}
          </a>
          <a
            href={secondaryHref}
            target={secondaryHref.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-surface-900/70 hover:bg-surface-800 text-white font-medium rounded-xl transition-colors border border-surface-700 backdrop-blur-sm font-body text-sm"
          >
            {settings.hero_cta_secondary_label}
          </a>
        </motion.div>

        {/* Trust strip — small, hardcoded for polish */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-[11px] text-surface-500 font-body"
        >
          <div className="flex -space-x-1.5">
            {['#f97316', '#8b5cf6', '#10b981', '#f59e0b'].map((c, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full border-2 border-surface-950"
                style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)` }}
              />
            ))}
          </div>
          <span className="tracking-wide">
            Trusted by 50+ teams · Pakistan · UAE · UK · USA
          </span>
        </motion.div>
      </div>
    </section>
  );
}
