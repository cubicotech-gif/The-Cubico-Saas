'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
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

  // Split the title around the {morph} placeholder. If absent, render statically.
  const [prefix, suffix] = settings.hero_title.includes(MORPH_PLACEHOLDER)
    ? settings.hero_title.split(MORPH_PLACEHOLDER)
    : [settings.hero_title, ''];

  const secondaryHref = settings.hero_cta_secondary_url
    ? settings.hero_cta_secondary_url
    : `https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}`;

  // Width of the longest word so the layout doesn't jitter on mobile
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), '');

  return (
    <section className="relative min-h-[64vh] flex items-center overflow-hidden bg-surface-950 pt-24 pb-16">
      {/* Background — soft brand gradient + faint grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-brand-950/60 border border-brand-800/60 text-brand-300 text-xs font-body tracking-wide backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          {settings.hero_eyebrow}
        </motion.div>

        {/* Morphing headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6"
        >
          {prefix}
          {settings.hero_title.includes(MORPH_PLACEHOLDER) && (
            <span
              className="relative inline-block align-baseline mx-1 sm:mx-2"
              // Reserve horizontal space for the longest word so siblings don't reflow
              style={{ minWidth: `${longestWord.length * 0.55}ch` }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ y: '0.6em', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-0.6em', opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
              {/* Subtle underline that pulses with the morph */}
              <motion.span
                key={`u-${words[index]}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute left-0 right-0 -bottom-1 sm:-bottom-2 h-[3px] bg-gradient-to-r from-transparent via-brand-500 to-transparent origin-center"
              />
            </span>
          )}
          {suffix}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg text-surface-400 font-body leading-relaxed max-w-2xl mx-auto mb-8"
        >
          {settings.hero_subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href={settings.hero_cta_primary_url || '#services'}
            className="px-7 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/30 font-body text-sm"
          >
            {settings.hero_cta_primary_label}
          </a>
          <a
            href={secondaryHref}
            target={secondaryHref.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="px-7 py-3 bg-surface-900/80 hover:bg-surface-800 text-white font-medium rounded-xl transition-colors border border-surface-700 backdrop-blur-sm font-body text-sm"
          >
            {settings.hero_cta_secondary_label}
          </a>
        </motion.div>

        {/* Hint to scroll */}
        <motion.a
          href="#services"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 inline-flex items-center gap-2 text-xs text-surface-500 hover:text-surface-300 transition-colors font-body tracking-widest uppercase group"
        >
          See what we build
          <ArrowDown
            size={12}
            className="group-hover:translate-y-0.5 transition-transform animate-bounce [animation-duration:2s]"
          />
        </motion.a>
      </div>
    </section>
  );
}
