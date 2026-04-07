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
    <section id="about" className="py-24 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
              {settings.about_eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-6">
              {settings.about_title}
            </h2>
            <p className="text-surface-400 font-body leading-relaxed mb-8 whitespace-pre-line">
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
            <div className="grid grid-cols-2 gap-4">
              {settings.stats.map((stat, i) => {
                const Icon = getIcon(stat.icon);
                return (
                  <motion.div
                    key={`${stat.label}-${i}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-surface-900 border border-surface-800"
                  >
                    <Icon size={24} className="text-brand-400 mb-3" />
                    <p className="text-3xl font-display font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-surface-400 font-body">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
