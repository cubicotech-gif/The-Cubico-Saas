'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp, Zap, Users, Quote } from 'lucide-react';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import type { MediaAsset } from '@/lib/media';

const resultStats = [
  { icon: TrendingUp, value: '3x', label: 'Average increase in qualified leads' },
  { icon: Zap, value: '<1s', label: 'Average page load time' },
  { icon: Users, value: '98%', label: 'Client retention rate' },
  { icon: Star, value: '4.9', label: 'Average client rating' },
];

const testimonials = [
  {
    quote:
      "Cubico didn't just build us a website — they built us a conversion machine. Our enquiries tripled within the first month of going live.",
    name: 'Ahmed Raza',
    role: 'CEO, Al-Noor Academy',
    mediaKey: 'testimonial-client1-photo',
  },
  {
    quote:
      "The attention to detail is unreal. Every colour, every animation, every layout choice — it all had a reason behind it. Our patients tell us the website feels calming before they even walk in.",
    name: 'Dr. Sarah Khan',
    role: 'Director, MedCare Clinic',
    mediaKey: 'testimonial-client2-photo',
  },
];

interface SocialProofProps {
  media: Record<string, MediaAsset>;
}

export default function SocialProof({ media }: SocialProofProps) {
  return (
    <section className="py-20 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
            Results
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Numbers that speak for themselves
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {resultStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-surface-900 border border-surface-800 text-center"
            >
              <stat.icon size={20} className="text-brand-400 mx-auto mb-3" />
              <p className="text-3xl font-display font-bold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-surface-400 font-body leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => {
            const avatar = media[t.mediaKey];
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-surface-900 border border-surface-800"
              >
                {/* Quote icon */}
                <Quote size={28} className="text-brand-800 mb-4" />

                <p className="text-surface-300 font-body leading-relaxed mb-6 text-sm sm:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-surface-700 flex-shrink-0">
                    {avatar?.url ? (
                      <img
                        src={avatar.url}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-950 flex items-center justify-center">
                        <span className="text-brand-400 font-display font-bold text-sm">
                          {t.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-surface-500 font-body">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
