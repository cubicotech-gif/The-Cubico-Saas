'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Globe,
  LayoutDashboard,
  Users2,
  TrendingUp,
  ArrowRight,
  Palette,
  Zap,
  Shield,
  BarChart2,
} from 'lucide-react';

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.5, delay },
});

const services = [
  {
    slug: 'website-development',
    icon: Globe,
    title: 'Website Development',
    tagline: 'Psychology-driven, brand-first websites',
    description:
      'We engineer digital experiences rooted in colour science, cognitive psychology, and conversion architecture.',
    accent: 'brand',
    highlights: ['Brand Design', 'SEO', 'Sub-1s Load'],
  },
  {
    slug: 'client-portals',
    icon: LayoutDashboard,
    title: 'Client Portals',
    tagline: 'Give clients a front-row seat',
    description:
      'Secure branded portals with real-time project visibility, invoices, and communications.',
    accent: 'violet',
    highlights: ['Documents', 'Invoicing', 'Messaging'],
  },
  {
    slug: 'crm-systems',
    icon: Users2,
    title: 'CRM Systems',
    tagline: 'Close more deals, lose fewer leads',
    description:
      'Visual pipelines, smart follow-ups, and revenue forecasting — built around how you sell.',
    accent: 'emerald',
    highlights: ['Pipeline', 'Automations', 'WhatsApp'],
  },
  {
    slug: 'digital-marketing',
    icon: TrendingUp,
    title: 'Digital Marketing',
    tagline: 'Growth you can measure',
    description:
      'SEO, social media, paid ads, and email campaigns — managed end to end by our team.',
    accent: 'amber',
    highlights: ['SEO', 'Paid Ads', 'Analytics'],
  },
];

const accentStyles: Record<string, { icon: string; border: string; bg: string; glow: string; tag: string }> = {
  brand: {
    icon: 'text-brand-400',
    border: 'border-brand-800/50',
    bg: 'bg-brand-950',
    glow: 'group-hover:shadow-brand-600/15',
    tag: 'bg-brand-950 text-brand-400 border-brand-800',
  },
  violet: {
    icon: 'text-violet-400',
    border: 'border-violet-800/50',
    bg: 'bg-violet-950',
    glow: 'group-hover:shadow-violet-600/15',
    tag: 'bg-violet-950 text-violet-400 border-violet-800',
  },
  emerald: {
    icon: 'text-emerald-400',
    border: 'border-emerald-800/50',
    bg: 'bg-emerald-950',
    glow: 'group-hover:shadow-emerald-600/15',
    tag: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  },
  amber: {
    icon: 'text-amber-400',
    border: 'border-amber-800/50',
    bg: 'bg-amber-950',
    glow: 'group-hover:shadow-amber-600/15',
    tag: 'bg-amber-950 text-amber-400 border-amber-800',
  },
};

const miniFeatures = [
  { icon: Palette, text: 'Brand-first design' },
  { icon: Zap, text: 'Blazing fast' },
  { icon: Shield, text: 'Secure & maintained' },
  { icon: BarChart2, text: 'Data-driven' },
];

export default function HomeServicesBento() {
  return (
    <section id="services" className="py-20 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...anim()} className="text-center mb-14">
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
            What We Build
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            Digital solutions that drive real growth
          </h2>
          <p className="text-surface-400 font-body max-w-xl mx-auto">
            From websites to CRMs — every product is engineered with brand
            psychology, clean code, and conversion science.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {/* ── Main service card: Website Development (large, spans 2 cols) ── */}
          <motion.div {...anim(0.05)} className="col-span-2 row-span-2">
            <Link
              href="/services/website-development"
              className={`group block h-full relative p-6 sm:p-8 rounded-2xl bg-surface-900 border border-surface-800 hover:border-brand-800/50 transition-all duration-300 hover:shadow-2xl ${accentStyles.brand.glow} overflow-hidden`}
            >
              {/* Subtle gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className={`w-11 h-11 rounded-xl ${accentStyles.brand.bg} border ${accentStyles.brand.border} flex items-center justify-center mb-5`}>
                  <Globe size={20} className={accentStyles.brand.icon} />
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">
                  Website Development
                </h3>
                <p className="text-sm text-surface-400 font-body leading-relaxed mb-6 max-w-sm">
                  Psychology-driven, brand-first websites engineered with colour
                  science and conversion architecture.
                </p>

                {/* Mini feature pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Brand Design', 'SEO', '<1s Load', 'Responsive'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[10px] font-body font-medium rounded-full bg-surface-800 text-surface-300 border border-surface-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-sm font-body font-medium text-brand-400 group-hover:text-brand-300 transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ── Service 2: Client Portals ── */}
          <motion.div {...anim(0.1)}>
            <Link
              href="/services/client-portals"
              className={`group block h-full p-5 rounded-2xl bg-surface-900 border border-surface-800 hover:border-violet-800/50 transition-all duration-300 hover:shadow-2xl ${accentStyles.violet.glow}`}
            >
              <div className={`w-9 h-9 rounded-lg ${accentStyles.violet.bg} border ${accentStyles.violet.border} flex items-center justify-center mb-3`}>
                <LayoutDashboard size={16} className={accentStyles.violet.icon} />
              </div>
              <h3 className="font-display font-bold text-white text-sm mb-1">
                Client Portals
              </h3>
              <p className="text-[11px] text-surface-400 font-body leading-relaxed mb-3">
                Secure branded portals with real-time project visibility.
              </p>
              <div className="flex items-center gap-1 text-[11px] font-body font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
                <span>Explore</span>
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* ── Service 3: CRM Systems ── */}
          <motion.div {...anim(0.13)}>
            <Link
              href="/services/crm-systems"
              className={`group block h-full p-5 rounded-2xl bg-surface-900 border border-surface-800 hover:border-emerald-800/50 transition-all duration-300 hover:shadow-2xl ${accentStyles.emerald.glow}`}
            >
              <div className={`w-9 h-9 rounded-lg ${accentStyles.emerald.bg} border ${accentStyles.emerald.border} flex items-center justify-center mb-3`}>
                <Users2 size={16} className={accentStyles.emerald.icon} />
              </div>
              <h3 className="font-display font-bold text-white text-sm mb-1">
                CRM Systems
              </h3>
              <p className="text-[11px] text-surface-400 font-body leading-relaxed mb-3">
                Visual pipelines, smart follow-ups, revenue forecasting.
              </p>
              <div className="flex items-center gap-1 text-[11px] font-body font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                <span>Explore</span>
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </motion.div>

          {/* ── Service 4: Digital Marketing (spans 2 cols) ── */}
          <motion.div {...anim(0.16)} className="col-span-2">
            <Link
              href="/services/digital-marketing"
              className={`group block h-full p-5 rounded-2xl bg-surface-900 border border-surface-800 hover:border-amber-800/50 transition-all duration-300 hover:shadow-2xl ${accentStyles.amber.glow}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-lg ${accentStyles.amber.bg} border ${accentStyles.amber.border} flex items-center justify-center flex-shrink-0`}>
                  <TrendingUp size={16} className={accentStyles.amber.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-white text-sm mb-1">
                    Digital Marketing
                  </h3>
                  <p className="text-[11px] text-surface-400 font-body leading-relaxed mb-2">
                    SEO, social media, paid ads, and email campaigns — managed end to end.
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-body font-medium text-amber-400 group-hover:text-amber-300 transition-colors">
                    <span>Explore</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>

        {/* Bottom strip — DNA of every build */}
        <motion.div
          {...anim(0.2)}
          className="mt-6 p-5 rounded-2xl bg-surface-900/50 border border-surface-800"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {miniFeatures.map((f) => (
              <div key={f.text} className="flex items-center gap-2">
                <f.icon size={14} className="text-brand-400" />
                <span className="text-xs text-surface-300 font-body">{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
