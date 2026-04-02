'use client';

import { motion } from 'framer-motion';
import {
  Palette,
  Eye,
  Brain,
  Layers,
  Target,
  Sparkles,
} from 'lucide-react';

const pillars = [
  {
    icon: Palette,
    title: 'Brand-First Design',
    description:
      'Every pixel reflects your brand DNA. We extract your core identity — values, voice, visual language — and weave it into every component, ensuring your website feels unmistakably yours.',
    accent: 'from-brand-600 to-brand-400',
  },
  {
    icon: Eye,
    title: 'Colour Accuracy & Science',
    description:
      'We don\'t pick colours randomly. Each hue is selected using colour theory and calibrated for accessibility (WCAG AA+), ensuring your palette communicates the right emotion on every screen.',
    accent: 'from-emerald-500 to-cyan-400',
  },
  {
    icon: Brain,
    title: 'Psychology-Driven Patterns',
    description:
      'From the F-pattern eye tracking on landing pages to trust-building social proof placement — every layout decision is backed by cognitive psychology and behavioural research.',
    accent: 'from-violet-500 to-purple-400',
  },
  {
    icon: Target,
    title: 'Conversion Architecture',
    description:
      'Beautiful design means nothing without results. We engineer visual hierarchies, strategic CTAs, and micro-interactions that guide visitors toward taking action.',
    accent: 'from-amber-500 to-orange-400',
  },
  {
    icon: Layers,
    title: 'Systematic Design Tokens',
    description:
      'We build a living design system — spacing scales, type ramps, colour tokens — so your website stays consistent and your brand scales effortlessly across pages and platforms.',
    accent: 'from-rose-500 to-pink-400',
  },
  {
    icon: Sparkles,
    title: 'Emotional Micro-Interactions',
    description:
      'Subtle hover effects, smooth transitions, and purposeful animations create a premium feel that builds trust and keeps visitors engaged longer.',
    accent: 'from-cyan-500 to-blue-400',
  },
];

export default function DevelopmentApproach() {
  return (
    <section className="py-20 bg-surface-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
            Our Approach
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Websites engineered by science, shaped by art
          </h2>
          <p className="text-surface-400 font-body max-w-2xl mx-auto leading-relaxed">
            We don&apos;t just build websites — we engineer digital experiences rooted
            in brand psychology, colour science, and conversion research. Every
            design decision has a reason behind it.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative p-6 rounded-2xl bg-surface-900 border border-surface-800 hover:border-surface-700 transition-all duration-300"
            >
              {/* Gradient glow on hover */}
              <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${pillar.accent} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.accent} bg-opacity-10 flex items-center justify-center mb-4`}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <pillar.icon size={20} className="text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-surface-400 font-body leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 p-6 sm:p-8 rounded-2xl bg-surface-900 border border-surface-800"
        >
          <h3 className="font-display font-bold text-white text-lg mb-6 text-center">
            How we bring your vision to life
          </h3>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discovery',
                desc: 'We study your brand, audience, competitors, and goals to build a strategic foundation.',
              },
              {
                step: '02',
                title: 'Design System',
                desc: 'Colour palettes, typography, and component library — all aligned with your brand psychology.',
              },
              {
                step: '03',
                title: 'Development',
                desc: 'Pixel-perfect code with blazing performance, SEO, and accessibility baked in from day one.',
              },
              {
                step: '04',
                title: 'Launch & Grow',
                desc: 'We deploy, monitor, and continuously optimise based on real analytics and user behaviour.',
              },
            ].map((phase, i) => (
              <div key={phase.step} className="text-center sm:text-left">
                <p className="text-brand-400 font-display font-bold text-2xl mb-2">
                  {phase.step}
                </p>
                <h4 className="font-display font-semibold text-white text-sm mb-1">
                  {phase.title}
                </h4>
                <p className="text-xs text-surface-400 font-body leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
