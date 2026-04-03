'use client';

import { motion } from 'framer-motion';
import {
  Palette,
  Brain,
  Target,
  Zap,
  TrendingUp,
  Users,
  Star,
  Check,
  Search,
  Rocket,
  Code2,
  Smartphone,
  ShieldCheck,
  BarChart2,
  Quote,
  ArrowRight,
} from 'lucide-react';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import type { MediaAsset } from '@/lib/media';

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.4, delay },
});

interface BentoShowcaseProps {
  media: Record<string, MediaAsset>;
}

export default function BentoShowcase({ media }: BentoShowcaseProps) {
  return (
    <section className="py-20 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...anim()} className="text-center mb-12">
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
            Why Cubico
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            Everything at a glance
          </h2>
        </motion.div>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {/* ── ROW 1: Brand Image (tall) + 2 Stats + Color Science ── */}

          {/* 1. Brand Psychology — tall card with image (spans 2 rows) */}
          <motion.div
            {...anim(0.05)}
            className="col-span-2 lg:col-span-1 lg:row-span-2 group relative rounded-2xl overflow-hidden border border-surface-800 bg-surface-900"
          >
            <div className="absolute inset-0">
              <MediaPlaceholder
                url={media['webdev-approach-branding']?.url}
                type="image"
                alt="Brand-first design"
                hint="Brand mood board"
                width={640}
                height={480}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-transparent" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-5 min-h-[280px] lg:min-h-0">
              <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center mb-3">
                <Palette size={16} className="text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-1">
                Brand-First Design
              </h3>
              <p className="text-xs text-surface-400 font-body leading-relaxed">
                Every colour, font, and pixel is extracted from your brand DNA — not a template.
              </p>
            </div>
          </motion.div>

          {/* 2. Stat: 3x Leads */}
          <motion.div
            {...anim(0.08)}
            className="rounded-2xl border border-surface-800 bg-surface-900 p-5 flex flex-col justify-center items-center text-center"
          >
            <TrendingUp size={18} className="text-emerald-400 mb-2" />
            <p className="text-3xl sm:text-4xl font-display font-bold text-white">3x</p>
            <p className="text-[11px] text-surface-400 font-body mt-1">More qualified leads</p>
          </motion.div>

          {/* 3. Stat: <1s Load */}
          <motion.div
            {...anim(0.1)}
            className="rounded-2xl border border-surface-800 bg-surface-900 p-5 flex flex-col justify-center items-center text-center"
          >
            <Zap size={18} className="text-amber-400 mb-2" />
            <p className="text-3xl sm:text-4xl font-display font-bold text-white">&lt;1s</p>
            <p className="text-[11px] text-surface-400 font-body mt-1">Page load time</p>
          </motion.div>

          {/* 4. Psychology — with heatmap image */}
          <motion.div
            {...anim(0.12)}
            className="col-span-2 lg:col-span-2 group relative rounded-2xl overflow-hidden border border-surface-800 bg-surface-900"
          >
            <div className="grid grid-cols-2 h-full">
              <div className="p-5 flex flex-col justify-center">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center mb-3">
                  <Brain size={16} className="text-violet-400" />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-1">
                  Psychology-Driven
                </h3>
                <p className="text-xs text-surface-400 font-body leading-relaxed">
                  F-pattern layouts, trust signals, and cognitive load reduction — backed by research.
                </p>
              </div>
              <div className="relative overflow-hidden">
                <MediaPlaceholder
                  url={media['webdev-approach-psychology']?.url}
                  type="image"
                  alt="Eye tracking heatmap"
                  hint="Heatmap / UX image"
                  width={640}
                  height={480}
                  className="rounded-r-2xl"
                />
              </div>
            </div>
          </motion.div>

          {/* 5. Stat: 98% Retention */}
          <motion.div
            {...anim(0.14)}
            className="rounded-2xl border border-surface-800 bg-surface-900 p-5 flex flex-col justify-center items-center text-center"
          >
            <Users size={18} className="text-brand-400 mb-2" />
            <p className="text-3xl sm:text-4xl font-display font-bold text-white">98%</p>
            <p className="text-[11px] text-surface-400 font-body mt-1">Client retention</p>
          </motion.div>

          {/* ── ROW 2: Process (wide) + Conversion image ── */}

          {/* 6. Process — compact 4-step */}
          <motion.div
            {...anim(0.16)}
            className="col-span-2 rounded-2xl border border-surface-800 bg-surface-900 p-5"
          >
            <p className="text-[10px] text-brand-400 font-body font-medium uppercase tracking-widest mb-4">
              Our Process
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { n: '01', icon: Search, label: 'Discover', color: 'text-brand-400' },
                { n: '02', icon: Palette, label: 'Design', color: 'text-violet-400' },
                { n: '03', icon: Code2, label: 'Develop', color: 'text-emerald-400' },
                { n: '04', icon: Rocket, label: 'Launch', color: 'text-amber-400' },
              ].map((step, i) => (
                <div key={step.n} className="text-center">
                  <div className={`w-8 h-8 mx-auto rounded-lg bg-surface-800 flex items-center justify-center mb-1.5 ${step.color}`}>
                    <step.icon size={14} />
                  </div>
                  <p className="text-[11px] font-display font-semibold text-white">{step.label}</p>
                  <p className="text-[9px] text-surface-500 font-body">{step.n}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 7. Conversion Architecture — with image */}
          <motion.div
            {...anim(0.18)}
            className="col-span-2 lg:col-span-1 group relative rounded-2xl overflow-hidden border border-surface-800 bg-surface-900"
          >
            <div className="absolute inset-0">
              <MediaPlaceholder
                url={media['webdev-approach-conversion']?.url}
                type="image"
                alt="Conversion architecture"
                hint="Design system image"
                width={640}
                height={480}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/70 to-surface-950/20" />
            </div>
            <div className="relative p-5 flex flex-col justify-end min-h-[160px]">
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center mb-2">
                <Target size={16} className="text-amber-400" />
              </div>
              <h3 className="font-display font-bold text-white text-sm">
                Conversion Architecture
              </h3>
              <p className="text-[11px] text-surface-400 font-body mt-0.5">
                Strategic CTAs & micro-interactions that drive action
              </p>
            </div>
          </motion.div>

          {/* ── ROW 3: What You Get (wide) + Testimonial ── */}

          {/* 8. What You Get — feature checklist */}
          <motion.div
            {...anim(0.2)}
            className="col-span-2 lg:col-span-3 rounded-2xl border border-surface-800 bg-surface-900 p-5"
          >
            <p className="text-[10px] text-brand-400 font-body font-medium uppercase tracking-widest mb-4">
              What You Get
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
              {[
                { icon: Palette, text: 'Custom brand design' },
                { icon: Zap, text: 'Sub-second load times' },
                { icon: Search, text: 'SEO optimised' },
                { icon: Smartphone, text: 'Fully responsive' },
                { icon: ShieldCheck, text: 'SSL & security' },
                { icon: BarChart2, text: 'Analytics & CRO' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-2">
                  <Check size={12} className="text-brand-400 flex-shrink-0" />
                  <span className="text-xs text-surface-300 font-body">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 9. Testimonial */}
          <motion.div
            {...anim(0.22)}
            className="col-span-2 lg:col-span-1 rounded-2xl border border-surface-800 bg-surface-900 p-5 flex flex-col justify-between"
          >
            <Quote size={18} className="text-brand-800 mb-2" />
            <p className="text-xs text-surface-300 font-body leading-relaxed mb-3">
              &ldquo;Our enquiries tripled within the first month. Every colour and
              animation had a reason behind it.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-surface-700 flex-shrink-0">
                {media['testimonial-client1-photo']?.url ? (
                  <img
                    src={media['testimonial-client1-photo'].url}
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-950 flex items-center justify-center">
                    <span className="text-brand-400 font-display font-bold text-[9px]">AR</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[11px] font-display font-semibold text-white">Ahmed Raza</p>
                <p className="text-[9px] text-surface-500 font-body">CEO, Al-Noor Academy</p>
              </div>
            </div>
          </motion.div>

          {/* ── ROW 4: Rating + Second Testimonial + Problem stat ── */}

          {/* 10. Rating */}
          <motion.div
            {...anim(0.24)}
            className="rounded-2xl border border-surface-800 bg-surface-900 p-5 flex flex-col justify-center items-center text-center"
          >
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-2xl font-display font-bold text-white">4.9</p>
            <p className="text-[11px] text-surface-400 font-body mt-0.5">Client rating</p>
          </motion.div>

          {/* 11. Problem awareness — compact */}
          <motion.div
            {...anim(0.26)}
            className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-5 flex flex-col justify-center"
          >
            <p className="text-2xl font-display font-bold text-rose-400 mb-1">75%</p>
            <p className="text-[11px] text-surface-400 font-body leading-relaxed">
              of users judge credibility by design alone
            </p>
          </motion.div>

          {/* 12. Second testimonial — wider */}
          <motion.div
            {...anim(0.28)}
            className="col-span-2 rounded-2xl border border-surface-800 bg-surface-900 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-surface-700 flex-shrink-0 mt-0.5">
                {media['testimonial-client2-photo']?.url ? (
                  <img
                    src={media['testimonial-client2-photo'].url}
                    alt="Client"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-950 flex items-center justify-center">
                    <span className="text-brand-400 font-display font-bold text-[9px]">SK</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-surface-300 font-body leading-relaxed mb-2">
                  &ldquo;The website feels calming before patients even walk in.
                  Attention to detail is unreal.&rdquo;
                </p>
                <p className="text-[11px] font-display font-semibold text-white">
                  Dr. Sarah Khan
                  <span className="text-surface-500 font-body font-normal ml-1.5">
                    MedCare Clinic
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
