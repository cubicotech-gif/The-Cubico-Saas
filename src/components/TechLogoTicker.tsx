'use client';

import { motion } from 'framer-motion';
import type { MediaAsset } from '@/lib/media';

const TECH_KEYS = [
  { key: 'logo-nextjs', name: 'Next.js' },
  { key: 'logo-react', name: 'React' },
  { key: 'logo-tailwind', name: 'Tailwind CSS' },
  { key: 'logo-typescript', name: 'TypeScript' },
  { key: 'logo-figma', name: 'Figma' },
  { key: 'logo-vercel', name: 'Vercel' },
  { key: 'logo-wordpress', name: 'WordPress' },
  { key: 'logo-shopify', name: 'Shopify' },
];

interface TechLogoTickerProps {
  media: Record<string, MediaAsset>;
}

export default function TechLogoTicker({ media }: TechLogoTickerProps) {
  // Double the list for infinite scroll illusion
  const items = [...TECH_KEYS, ...TECH_KEYS];

  return (
    <section className="py-8 bg-surface-900/30 border-y border-surface-800/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-surface-500 font-body uppercase tracking-widest mb-6">
          Technologies we build with
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface-950 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: { duration: 30, repeat: Infinity, ease: 'linear' },
          }}
        >
          {items.map((tech, i) => {
            const asset = media[tech.key];
            return (
              <div
                key={`${tech.key}-${i}`}
                className="flex-shrink-0 flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity"
              >
                {asset?.url ? (
                  <img
                    src={asset.url}
                    alt={tech.name}
                    className="h-7 w-auto object-contain brightness-0 invert"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-surface-700 border border-surface-600" />
                    <span className="text-sm text-surface-400 font-body font-medium whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
