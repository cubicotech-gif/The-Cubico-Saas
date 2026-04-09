'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import type { Service, SiteSettings, MiniFeature, HomeAccent } from '@/lib/types';
import { useLocale } from '@/i18n/LocaleProvider';

interface HomeServicesShowcaseProps {
  services: Service[];
  settings: SiteSettings;
}

const accent: Record<
  HomeAccent,
  { text: string; bg: string; border: string; hex: string }
> = {
  brand:   { text: 'text-brand-400',   bg: 'bg-brand-500/10',   border: 'border-brand-500/20',   hex: '#0c93e7' },
  violet:  { text: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  hex: '#8b5cf6' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', hex: '#10b981' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   hex: '#f59e0b' },
  rose:    { text: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    hex: '#f43f5e' },
  teal:    { text: 'text-teal-400',    bg: 'bg-teal-500/10',    border: 'border-teal-500/20',    hex: '#14b8a6' },
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    hex: '#06b6d4' },
  fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', hex: '#d946ef' },
  sky:     { text: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/20',     hex: '#0ea5e9' },
};

function getIcon(name: string | undefined) {
  if (!name) return Icons.Box;
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  return Icon ?? Icons.Box;
}

function getAccent(svc: Service) {
  return accent[(svc.home_accent as HomeAccent) ?? 'brand'] ?? accent.brand;
}

export default function HomeServicesBento({ services, settings }: HomeServicesShowcaseProps) {
  const { locale, dict } = useLocale();

  if (services.length === 0) return null;

  return (
    <section
      id="services"
      className="h-screen snap-start flex flex-col justify-center bg-surface-950 relative overflow-hidden scroll-mt-24"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-600/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <p className="text-brand-400 text-xs font-body font-medium tracking-[0.2em] uppercase mb-2">
            {settings.services_eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white max-w-2xl mx-auto leading-tight">
            {settings.services_title}
          </h2>
        </motion.div>

        {/* Services grid — all visible at one glance */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {services.map((svc, i) => {
            const a = getAccent(svc);
            const Icon = getIcon(svc.icon);
            const isInternal = svc.link_type === 'internal' && svc.slug;
            const href = isInternal ? `/${locale}/services/${svc.slug}` : svc.link_url;

            const card = (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`group relative p-4 sm:p-5 rounded-2xl border ${a.border} ${a.bg} hover:bg-surface-800/60 backdrop-blur-sm transition-all duration-300 cursor-pointer`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 ${a.text} bg-surface-950/60`}>
                  <Icon size={20} />
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-white text-sm sm:text-base mb-1 group-hover:text-brand-300 transition-colors">
                  {svc.title}
                </h3>

                {/* Tagline */}
                {(svc.home_tagline || svc.description) && (
                  <p className="text-[11px] sm:text-xs text-surface-500 font-body leading-relaxed line-clamp-2">
                    {svc.home_tagline || svc.description}
                  </p>
                )}

                {/* Arrow */}
                <ArrowRight
                  size={14}
                  className={`absolute top-4 right-4 ${a.text} opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5`}
                />
              </motion.div>
            );

            if (isInternal) {
              return (
                <Link key={svc.id} href={href} className="block">
                  {card}
                </Link>
              );
            }

            return (
              <a
                key={svc.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {card}
              </a>
            );
          })}
        </div>

        {/* Mini-feature strip */}
        {settings.mini_features.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {settings.mini_features.map((f: MiniFeature, i: number) => {
              const FeatIcon = getIcon(f.icon);
              return (
                <div key={`${f.text}-${i}`} className="flex items-center gap-1.5">
                  <FeatIcon size={12} className="text-surface-600" />
                  <span className="text-[11px] text-surface-500 font-body tracking-wide">
                    {f.text}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
