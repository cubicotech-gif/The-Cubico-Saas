'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface AboutSectionProps {
  settings: SiteSettings;
}

function getIcon(name: string | undefined) {
  if (!name) return Icons.Star;
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  return Icon ?? Icons.Star;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  return (
    <div id="about" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-2">
            {settings.about_eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white leading-tight mb-4">
            {settings.about_title}
          </h2>
          <p className="text-surface-400 font-body leading-relaxed mb-6 whitespace-pre-line text-sm sm:text-base line-clamp-4 sm:line-clamp-none">
            {settings.about_body}
          </p>
          {settings.about_cta_label && (
            <a
              href={settings.about_cta_url || '#'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-colors font-body text-sm"
            >
              {settings.about_cta_label}
            </a>
          )}
        </motion.div>

        {/* Stats grid */}
        {settings.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {settings.stats.map((stat, i) => {
              const Icon = getIcon(stat.icon);
              return (
                <motion.div
                  key={`${stat.label}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-4 sm:p-5 rounded-2xl bg-surface-900 border border-surface-800"
                >
                  <Icon size={20} className="text-brand-400 mb-2" />
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white mb-0.5">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-surface-400 font-body">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
