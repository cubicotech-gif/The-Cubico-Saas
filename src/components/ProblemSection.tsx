'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Eye, TrendingDown } from 'lucide-react';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import type { MediaAsset } from '@/lib/media';

const painPoints = [
  {
    icon: Eye,
    stat: '75%',
    text: 'of users judge a company\'s credibility by its website design',
  },
  {
    icon: Clock,
    stat: '3 sec',
    text: 'is the average attention span before a visitor decides to stay or leave',
  },
  {
    icon: TrendingDown,
    stat: '88%',
    text: 'of visitors won\'t return to a website after a bad first experience',
  },
];

interface ProblemSectionProps {
  media: Record<string, MediaAsset>;
}

export default function ProblemSection({ media }: ProblemSectionProps) {
  const problemImage = media['webdev-problem-image'];

  return (
    <section className="py-20 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-surface-800 aspect-[4/3]">
              <MediaPlaceholder
                url={problemImage?.url}
                type="image"
                alt="Why most websites fail"
                hint="Upload: frustrated user at laptop or annotated bad website screenshot"
                width={640}
                height={480}
                className="rounded-2xl"
              />
            </div>
            {/* Warning badge */}
            <div className="absolute -bottom-3 -right-3 sm:bottom-4 sm:right-4 px-3 py-2 rounded-xl bg-rose-950/80 backdrop-blur-md border border-rose-800 flex items-center gap-2">
              <AlertTriangle size={14} className="text-rose-400" />
              <span className="text-xs text-rose-300 font-body font-medium">
                First impressions matter
              </span>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-rose-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
              The Problem
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-4">
              Your website is losing you customers before they even read a word
            </h2>
            <p className="text-surface-400 font-body leading-relaxed mb-8">
              Most businesses spend thousands on marketing only to send traffic
              to a website that feels outdated, loads slowly, or fails to communicate
              trust. The result? Visitors bounce in seconds — and they never come back.
            </p>

            <div className="space-y-5">
              {painPoints.map((point, i) => (
                <motion.div
                  key={point.stat}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-800/50 flex items-center justify-center">
                    <span className="text-lg font-display font-bold text-rose-400">
                      {point.stat}
                    </span>
                  </div>
                  <p className="text-sm text-surface-300 font-body leading-relaxed pt-1">
                    {point.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-brand-400 font-body font-medium text-sm"
            >
              That&apos;s exactly why we approach web development differently. ↓
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
