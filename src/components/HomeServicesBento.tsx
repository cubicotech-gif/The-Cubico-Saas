'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowRight, Film } from 'lucide-react';
import type { Service, SiteSettings, MiniFeature, HomeAccent } from '@/lib/types';

interface HomeServicesBentoProps {
  services: Service[];
  settings: SiteSettings;
}

const accentStyles: Record<HomeAccent, { icon: string; border: string; bg: string; glow: string; ring: string }> = {
  brand:   { icon: 'text-brand-400',   border: 'border-brand-800/50',   bg: 'bg-brand-950',   glow: 'group-hover:shadow-brand-600/15',   ring: 'group-hover:border-brand-700/60' },
  violet:  { icon: 'text-violet-400',  border: 'border-violet-800/50',  bg: 'bg-violet-950',  glow: 'group-hover:shadow-violet-600/15',  ring: 'group-hover:border-violet-700/60' },
  emerald: { icon: 'text-emerald-400', border: 'border-emerald-800/50', bg: 'bg-emerald-950', glow: 'group-hover:shadow-emerald-600/15', ring: 'group-hover:border-emerald-700/60' },
  amber:   { icon: 'text-amber-400',   border: 'border-amber-800/50',   bg: 'bg-amber-950',   glow: 'group-hover:shadow-amber-600/15',   ring: 'group-hover:border-amber-700/60' },
  rose:    { icon: 'text-rose-400',    border: 'border-rose-800/50',    bg: 'bg-rose-950',    glow: 'group-hover:shadow-rose-600/15',    ring: 'group-hover:border-rose-700/60' },
  teal:    { icon: 'text-teal-400',    border: 'border-teal-800/50',    bg: 'bg-teal-950',    glow: 'group-hover:shadow-teal-600/15',    ring: 'group-hover:border-teal-700/60' },
  cyan:    { icon: 'text-cyan-400',    border: 'border-cyan-800/50',    bg: 'bg-cyan-950',    glow: 'group-hover:shadow-cyan-600/15',    ring: 'group-hover:border-cyan-700/60' },
  fuchsia: { icon: 'text-fuchsia-400', border: 'border-fuchsia-800/50', bg: 'bg-fuchsia-950', glow: 'group-hover:shadow-fuchsia-600/15', ring: 'group-hover:border-fuchsia-700/60' },
  sky:     { icon: 'text-sky-400',     border: 'border-sky-800/50',     bg: 'bg-sky-950',     glow: 'group-hover:shadow-sky-600/15',     ring: 'group-hover:border-sky-700/60' },
};

function getIcon(name: string | undefined) {
  if (!name) return Icons.Box;
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  return Icon ?? Icons.Box;
}

export default function HomeServicesBento({ services, settings }: HomeServicesBentoProps) {
  if (services.length === 0) {
    // Nothing marked show_on_home — render nothing rather than a broken section
    return null;
  }

  return (
    <section id="services" className="py-20 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
            {settings.services_eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            {settings.services_title}
          </h2>
          <p className="text-surface-400 font-body max-w-xl mx-auto">
            {settings.services_subtitle}
          </p>
        </motion.div>

        {/* Service grid — uniform 2x2 so every video has room to breathe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} delay={i * 0.06} />
          ))}
        </div>

        {/* Mini-feature strip */}
        {settings.mini_features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 p-5 rounded-2xl bg-surface-900/50 border border-surface-800"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {settings.mini_features.map((f: MiniFeature) => {
                const Icon = getIcon(f.icon);
                return (
                  <div key={f.text} className="flex items-center gap-2">
                    <Icon size={14} className="text-brand-400" />
                    <span className="text-xs text-surface-300 font-body">{f.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  const accent = accentStyles[(service.home_accent as HomeAccent) ?? 'brand'] ?? accentStyles.brand;
  const Icon = getIcon(service.icon);

  const isInternal = service.link_type === 'internal' && service.slug;
  const href = isInternal ? `/services/${service.slug}` : service.link_url;

  const CardInner = (
    <div
      className={`group relative h-full rounded-2xl bg-surface-900 border border-surface-800 overflow-hidden transition-all duration-300 hover:shadow-2xl ${accent.glow} ${accent.ring}`}
    >
      {/* Video / placeholder */}
      <div className="relative aspect-[16/9] bg-surface-950 overflow-hidden">
        {service.home_video_url ? (
          <video
            src={service.home_video_url}
            className="w-full h-full object-cover"
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-surface-700">
            <Film size={36} strokeWidth={1.5} />
            <p className="text-[10px] font-body mt-2 tracking-widest uppercase">
              video coming soon
            </p>
          </div>
        )}
        {/* Soft top-edge gradient so the icon chip pops */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Floating accent icon */}
        <div
          className={`absolute top-3 left-3 w-9 h-9 rounded-lg ${accent.bg} border ${accent.border} flex items-center justify-center backdrop-blur-sm`}
        >
          <Icon size={16} className={accent.icon} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-lg font-display font-bold text-white mb-1">
          {service.title}
        </h3>
        {service.home_tagline && (
          <p className="text-sm text-surface-400 font-body leading-relaxed mb-4">
            {service.home_tagline}
          </p>
        )}
        <div
          className={`inline-flex items-center gap-1.5 text-sm font-body font-medium ${accent.icon} group-hover:translate-x-0.5 transition-transform`}
        >
          <span>Explore</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {isInternal ? (
        <Link href={href} className="block h-full">
          {CardInner}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {CardInner}
        </a>
      )}
    </motion.div>
  );
}
