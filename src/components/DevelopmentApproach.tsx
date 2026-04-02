'use client';

import { motion } from 'framer-motion';
import { Palette, Eye, Brain, Target, Layers, Sparkles } from 'lucide-react';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import type { MediaAsset } from '@/lib/media';

const approaches = [
  {
    icon: Palette,
    tag: 'Branding',
    title: 'Brand-First Design & Colour Science',
    description:
      'Every pixel reflects your brand DNA. We extract your core identity — values, voice, visual language — and build a scientific colour system around it. Each hue is selected using colour theory, calibrated for accessibility (WCAG AA+), and designed to trigger the right emotional response from your audience.',
    bullets: [
      'Brand identity extraction & mood boarding',
      'Colour palette derived from psychology, not trends',
      'WCAG AA+ accessibility compliance',
      'Consistent tokens across every page',
    ],
    mediaKey: 'webdev-approach-branding',
    accent: 'brand',
  },
  {
    icon: Brain,
    tag: 'Psychology',
    title: 'Psychology-Driven Layout Patterns',
    description:
      'From the F-pattern eye tracking on landing pages to Gestalt grouping principles and trust-building social proof placement — every layout decision is backed by cognitive psychology and behavioural research. We design for how the human brain actually processes information.',
    bullets: [
      'F-pattern & Z-pattern eye tracking layouts',
      'Strategic social proof & trust signal placement',
      'Cognitive load reduction techniques',
      'Gestalt principles for visual grouping',
    ],
    mediaKey: 'webdev-approach-psychology',
    accent: 'violet',
  },
  {
    icon: Target,
    tag: 'Conversion',
    title: 'Conversion Architecture & Micro-Interactions',
    description:
      'Beautiful design means nothing without results. We engineer visual hierarchies, strategic CTAs, and purposeful micro-interactions that create a premium feel and guide visitors toward taking action. Subtle hover effects, smooth transitions — every animation has a purpose.',
    bullets: [
      'Strategic CTA placement & visual hierarchy',
      'Purposeful hover effects & transitions',
      'Living design system with reusable tokens',
      'Data-driven A/B testing ready',
    ],
    mediaKey: 'webdev-approach-conversion',
    accent: 'amber',
  },
];

const accentColors: Record<string, { tag: string; border: string; bg: string }> = {
  brand: { tag: 'text-brand-400', border: 'border-brand-800', bg: 'bg-brand-950' },
  violet: { tag: 'text-violet-400', border: 'border-violet-800', bg: 'bg-violet-950' },
  amber: { tag: 'text-amber-400', border: 'border-amber-800', bg: 'bg-amber-950' },
};

interface DevelopmentApproachProps {
  media: Record<string, MediaAsset>;
}

export default function DevelopmentApproach({ media }: DevelopmentApproachProps) {
  return (
    <section className="py-20 bg-surface-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
            Our Approach
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Websites engineered by science, shaped by art
          </h2>
          <p className="text-surface-400 font-body max-w-2xl mx-auto leading-relaxed">
            We don&apos;t just build websites — we engineer digital experiences rooted
            in brand psychology, colour science, and conversion research.
          </p>
        </motion.div>

        {/* Zigzag rows */}
        <div className="space-y-16 lg:space-y-24">
          {approaches.map((item, i) => {
            const isReversed = i % 2 === 1;
            const colors = accentColors[item.accent];
            const asset = media[item.mediaKey];

            return (
              <div
                key={item.title}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  isReversed ? 'lg:direction-rtl' : ''
                }`}
              >
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={isReversed ? 'lg:order-2' : 'lg:order-1'}
                >
                  <div className="rounded-2xl overflow-hidden border border-surface-800 aspect-[4/3]">
                    <MediaPlaceholder
                      url={asset?.url}
                      type="image"
                      alt={item.title}
                      hint={`Upload: ${item.tag.toLowerCase()} visual`}
                      width={640}
                      height={480}
                      className="rounded-2xl"
                    />
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={isReversed ? 'lg:order-1' : 'lg:order-2'}
                >
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full ${colors.bg} border ${colors.border}`}
                  >
                    <item.icon size={14} className={colors.tag} />
                    <span className={`text-xs font-body font-medium ${colors.tag}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-surface-400 font-body leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <ul className="space-y-2.5">
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-sm text-surface-300 font-body"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                            item.accent === 'brand'
                              ? 'bg-brand-400'
                              : item.accent === 'violet'
                              ? 'bg-violet-400'
                              : 'bg-amber-400'
                          }`}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
