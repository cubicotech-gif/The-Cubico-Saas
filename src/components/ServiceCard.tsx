'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import type { Service } from '@/lib/types';

const categoryAccent: Record<string, string> = {
  institution: 'text-brand-400 bg-brand-950 border-brand-800',
  healthcare: 'text-emerald-400 bg-emerald-950 border-emerald-800',
  individual: 'text-violet-400 bg-violet-950 border-violet-800',
  creative: 'text-amber-400 bg-amber-950 border-amber-800',
};

const categoryGlow: Record<string, string> = {
  institution: 'group-hover:shadow-brand-600/10',
  healthcare: 'group-hover:shadow-emerald-600/10',
  individual: 'group-hover:shadow-violet-600/10',
  creative: 'group-hover:shadow-amber-600/10',
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const accent = categoryAccent[service.category] ?? 'text-brand-400 bg-brand-950 border-brand-800';
  const glow = categoryGlow[service.category] ?? 'group-hover:shadow-brand-600/10';

  const isExternal = service.link_type === 'external';
  const href = isExternal ? service.link_url : service.link_url;

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`group relative flex flex-col h-full p-6 rounded-2xl bg-surface-900 border border-surface-800 hover:border-surface-700 transition-all duration-300 cursor-pointer hover:shadow-2xl ${glow}`}
    >
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border ${accent} mb-4`}>
        <DynamicIcon name={service.icon} size={20} />
      </div>

      {/* Content */}
      <h3 className="text-base font-display font-semibold text-white mb-2 leading-snug">
        {service.title}
      </h3>
      <p className="text-sm text-surface-400 font-body leading-relaxed flex-1">
        {service.description}
      </p>

      {/* CTA row */}
      <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-surface-500 group-hover:text-surface-300 transition-colors">
        {isExternal ? (
          <>
            <span>Visit site</span>
            <ExternalLink size={12} />
          </>
        ) : (
          <>
            <span>Learn more</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {CardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {CardContent}
    </Link>
  );
}
