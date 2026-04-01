'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink, ArrowUpRight } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import type { Service, ServiceCategory } from '@/lib/types';

// ── Helpers ────────────────────────────────────────────────────────────────────

function serviceHref(service: Service) {
  return service.link_url;
}

function isExternal(service: Service) {
  return service.link_type === 'external';
}

const FALLBACK_GRADIENT =
  'linear-gradient(135deg, #0b426d 0%, #072a49 50%, #09090b 100%)';

// ── Individual Bento Section ───────────────────────────────────────────────────

function BentoCard({
  service,
  className = '',
  priority = false,
}: {
  service: Service;
  className?: string;
  priority?: boolean;
}) {
  const href = serviceHref(service);
  const external = isExternal(service);

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
    >
      {/* Image */}
      {service.image_url ? (
        <Image
          src={service.image_url}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: FALLBACK_GRADIENT }} />
      )}

      {/* Gradient overlay — heavier at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-surface-950/10 transition-opacity duration-300 group-hover:opacity-90" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-950/70 backdrop-blur-sm border border-surface-700/50 text-xs font-body text-surface-300">
          <DynamicIcon name={service.icon} size={11} />
          {service.category === 'individual' ? 'For Business' : service.category.charAt(0).toUpperCase() + service.category.slice(1)}
        </span>
        {external && (
          <span className="px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-body">
            External
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-5 z-10">
        <h3 className="font-display font-bold text-white text-lg leading-snug mb-1.5">
          {service.title}
        </h3>
        <p className="text-surface-400 text-sm font-body leading-relaxed line-clamp-2 mb-3">
          {service.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium font-body text-brand-400 group-hover:text-brand-300 transition-colors">
          {external ? 'Visit site' : 'Learn more'}
          {external
            ? <ExternalLink size={11} />
            : <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          }
        </span>
      </div>
    </motion.div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return <Link href={href} className="block h-full">{inner}</Link>;
}

function IndividualBentoGrid({ services }: { services: Service[] }) {
  const [s0, s1, s2, s3] = services;

  return (
    <div className="grid gap-3"
      style={{
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: '340px 280px',
      }}
    >
      {/* Large feature card — col 1-2, row 1-2 */}
      {s0 && (
        <div style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }}>
          <BentoCard service={s0} className="h-full" priority />
        </div>
      )}

      {/* Top-right */}
      {s1 && (
        <div style={{ gridColumn: '3 / 4', gridRow: '1 / 2' }}>
          <BentoCard service={s1} className="h-full" />
        </div>
      )}

      {/* Bottom-right */}
      {s2 && (
        <div style={{ gridColumn: '3 / 4', gridRow: '2 / 3' }}>
          <BentoCard service={s2} className="h-full" />
        </div>
      )}

      {/* Full-width bottom strip */}
      {s3 && (
        <div style={{ gridColumn: '1 / 4', gridRow: '3 / 4' }}
          className="h-[220px]"
        >
          {/* Wide card: image left, content right */}
          <WideBentoCard service={s3} />
        </div>
      )}
    </div>
  );
}

function WideBentoCard({ service }: { service: Service }) {
  const href = serviceHref(service);
  const external = isExternal(service);

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.2 }}
      className="group relative flex h-full overflow-hidden rounded-2xl cursor-pointer bg-surface-900 border border-surface-800 hover:border-surface-700 transition-all"
    >
      {/* Left: image panel */}
      <div className="relative w-2/5 flex-shrink-0 overflow-hidden">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.title}
            fill
            sizes="40vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: FALLBACK_GRADIENT }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-900/80" />
      </div>

      {/* Right: content */}
      <div className="flex flex-col justify-center px-8 py-6 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400">
            <DynamicIcon name={service.icon} size={15} />
          </div>
          <span className="text-xs text-surface-500 font-body uppercase tracking-widest">
            For Business
          </span>
        </div>
        <h3 className="font-display font-bold text-white text-xl mb-2">
          {service.title}
        </h3>
        <p className="text-surface-400 text-sm font-body leading-relaxed mb-4 max-w-md">
          {service.description}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-medium font-body text-brand-400 group-hover:text-brand-300 transition-colors">
          {external ? 'Visit site' : 'See full details'}
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </motion.div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return <Link href={href} className="block h-full">{inner}</Link>;
}

// ── Mobile individual cards ────────────────────────────────────────────────────

function MobileIndividualCard({ service, index }: { service: Service; index: number }) {
  const href = serviceHref(service);
  const external = isExternal(service);

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative h-64 overflow-hidden rounded-2xl cursor-pointer"
    >
      {service.image_url ? (
        <Image
          src={service.image_url}
          alt={service.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: FALLBACK_GRADIENT }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-4 z-10">
        <h3 className="font-display font-bold text-white mb-1">{service.title}</h3>
        <p className="text-surface-400 text-xs font-body line-clamp-2">{service.description}</p>
      </div>
    </motion.div>
  );

  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>;
  }
  return <Link href={href}>{inner}</Link>;
}

// ── Catalog card (Institution / Healthcare / Creative) ────────────────────────

const catalogAccent: Record<ServiceCategory, { badge: string; border: string; icon: string }> = {
  institution: {
    badge: 'bg-brand-950 border-brand-800 text-brand-300',
    border: 'hover:border-brand-800/50',
    icon: 'text-brand-400',
  },
  healthcare: {
    badge: 'bg-emerald-950 border-emerald-800 text-emerald-300',
    border: 'hover:border-emerald-800/50',
    icon: 'text-emerald-400',
  },
  individual: {
    badge: 'bg-violet-950 border-violet-800 text-violet-300',
    border: 'hover:border-violet-800/50',
    icon: 'text-violet-400',
  },
  creative: {
    badge: 'bg-amber-950 border-amber-800 text-amber-300',
    border: 'hover:border-amber-800/50',
    icon: 'text-amber-400',
  },
};

function CatalogCard({ service, index }: { service: Service; index: number }) {
  const href = serviceHref(service);
  const external = isExternal(service);
  const accent = catalogAccent[service.category];

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-surface-900 border border-surface-800 ${accent.border} transition-all duration-300 cursor-pointer h-full`}
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: FALLBACK_GRADIENT }} />
        )}
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-900/30" />

        {/* Floating icon badge */}
        <div className={`absolute top-3 right-3 w-8 h-8 rounded-lg border flex items-center justify-center backdrop-blur-sm ${accent.badge}`}>
          <DynamicIcon name={service.icon} size={14} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-display font-semibold text-white text-sm leading-snug mb-1.5">
          {service.title}
        </h3>
        <p className="text-xs text-surface-500 font-body leading-relaxed flex-1 line-clamp-3">
          {service.description}
        </p>
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium font-body ${accent.icon} group-hover:opacity-80 transition-opacity`}>
          {external ? 'Visit site' : 'Learn more'}
          {external
            ? <ExternalLink size={10} />
            : <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
          }
        </div>
      </div>
    </motion.div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return <Link href={href} className="block h-full">{inner}</Link>;
}

// ── Category header ────────────────────────────────────────────────────────────

const categoryMeta: Record<ServiceCategory, { label: string; icon: string; tagline: string }> = {
  institution: {
    label: 'Institution',
    icon: 'Building2',
    tagline: 'School & university management, LMS, and marketing platforms.',
  },
  healthcare: {
    label: 'Healthcare',
    icon: 'Stethoscope',
    tagline: 'Hospital management systems and clinic EHR solutions.',
  },
  individual: {
    label: 'For Your Business',
    icon: 'Briefcase',
    tagline: 'Websites, portals, CRM, and digital marketing built around how you work.',
  },
  creative: {
    label: 'Creative',
    icon: 'Sparkles',
    tagline: 'Brand design, creative studio, and video production.',
  },
};

function CatalogSection({
  category,
  services,
}: {
  category: ServiceCategory;
  services: Service[];
}) {
  const meta = categoryMeta[category];
  const accent = catalogAccent[category];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="flex items-start gap-3 mb-6"
      >
        <div className={`mt-0.5 ${accent.icon}`}>
          <DynamicIcon name={meta.icon} size={18} />
        </div>
        <div>
          <h3 className={`font-display font-semibold text-base ${accent.icon}`}>
            {meta.label}
          </h3>
          <p className="text-sm text-surface-500 font-body">{meta.tagline}</p>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <CatalogCard key={service.id} service={service} index={i} />
        ))}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

interface SolutionsShowcaseProps {
  services: Service[];
}

export default function SolutionsShowcase({ services }: SolutionsShowcaseProps) {
  const individual = services.filter((s) => s.category === 'individual');
  const institution = services.filter((s) => s.category === 'institution');
  const healthcare = services.filter((s) => s.category === 'healthcare');
  const creative = services.filter((s) => s.category === 'creative');

  return (
    <section id="services" className="py-24 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-brand-400 text-xs font-body font-medium tracking-widest uppercase mb-3">
            Solutions
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight max-w-lg">
              Everything your business needs to grow
            </h2>
            <p className="text-surface-500 font-body text-sm max-w-xs sm:text-right leading-relaxed">
              From solo operators to hospital networks — we have a product built for you.
            </p>
          </div>
        </motion.div>

        {/* ── Individual: Bento Showcase ─────────────────────────────────── */}
        {individual.length > 0 && (
          <div className="mb-20">
            {/* Category label */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="text-violet-400">
                <DynamicIcon name="Briefcase" size={18} />
              </div>
              <div>
                <p className="font-display font-semibold text-base text-violet-400">
                  For Your Business
                </p>
                <p className="text-sm text-surface-500 font-body">
                  Websites, portals, CRM, and digital marketing built around how you work.
                </p>
              </div>
            </motion.div>

            {/* Desktop bento */}
            <div className="hidden md:block">
              <IndividualBentoGrid services={individual} />
            </div>

            {/* Mobile stack */}
            <div className="md:hidden grid gap-3">
              {individual.map((s, i) => (
                <MobileIndividualCard key={s.id} service={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-14"
        >
          <div className="flex-1 h-px bg-surface-800" />
          <span className="text-xs text-surface-600 font-body uppercase tracking-widest whitespace-nowrap">
            More Solutions
          </span>
          <div className="flex-1 h-px bg-surface-800" />
        </motion.div>

        {/* ── Institution ────────────────────────────────────────────────── */}
        {institution.length > 0 && (
          <div className="mb-14">
            <CatalogSection category="institution" services={institution} />
          </div>
        )}

        {/* ── Healthcare ─────────────────────────────────────────────────── */}
        {healthcare.length > 0 && (
          <div className="mb-14">
            <CatalogSection category="healthcare" services={healthcare} />
          </div>
        )}

        {/* ── Creative ───────────────────────────────────────────────────── */}
        {creative.length > 0 && (
          <div>
            <CatalogSection category="creative" services={creative} />
          </div>
        )}
      </div>
    </section>
  );
}
