'use client';

import { motion } from 'framer-motion';
import { Search, Palette, Code2, Rocket } from 'lucide-react';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import type { MediaAsset } from '@/lib/media';

const phases = [
  {
    step: '01',
    icon: Search,
    title: 'Discovery & Strategy',
    description:
      'We study your brand, audience, competitors, and goals. Through structured questionnaires and research, we build a strategic foundation that informs every design decision.',
    mediaKey: 'webdev-process-discovery',
    accent: 'brand',
  },
  {
    step: '02',
    icon: Palette,
    title: 'Design System & Prototyping',
    description:
      'Colour palettes, typography scales, component libraries — all aligned with your brand psychology. We prototype in Figma so you see the full experience before a single line of code.',
    mediaKey: 'webdev-process-design',
    accent: 'violet',
  },
  {
    step: '03',
    icon: Code2,
    title: 'Pixel-Perfect Development',
    description:
      'We translate designs into blazing-fast, SEO-ready code with accessibility baked in. Responsive across every device, optimised to Core Web Vitals standards.',
    mediaKey: 'webdev-process-development',
    accent: 'emerald',
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Launch, Monitor & Grow',
    description:
      'We deploy to production, set up analytics, and continuously optimise based on real user behaviour. Your website keeps getting better after launch.',
    mediaKey: 'webdev-process-launch',
    accent: 'amber',
  },
];

const accentMap: Record<string, string> = {
  brand: 'text-brand-400 border-brand-800 bg-brand-950',
  violet: 'text-violet-400 border-violet-800 bg-violet-950',
  emerald: 'text-emerald-400 border-emerald-800 bg-emerald-950',
  amber: 'text-amber-400 border-amber-800 bg-amber-950',
};

const dotColor: Record<string, string> = {
  brand: 'bg-brand-400',
  violet: 'bg-violet-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
};

interface ProcessTimelineProps {
  media: Record<string, MediaAsset>;
}

export default function ProcessTimeline({ media }: ProcessTimelineProps) {
  const processVideo = media['webdev-process-video'];

  return (
    <section className="py-20 bg-surface-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
            Our Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            How we bring your vision to life
          </h2>
          <p className="text-surface-400 font-body max-w-2xl mx-auto">
            A battle-tested 4-phase workflow that turns ideas into high-performing
            digital experiences.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-surface-800" />

          <div className="space-y-12 lg:space-y-0">
            {phases.map((phase, i) => {
              const isLeft = i % 2 === 0;
              const asset = media[phase.mediaKey];

              return (
                <div key={phase.step} className="relative lg:grid lg:grid-cols-2 lg:gap-16 lg:py-12">
                  {/* Timeline dot (desktop) */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className={`w-10 h-10 rounded-full ${accentMap[phase.accent]} border flex items-center justify-center`}>
                      <span className="text-xs font-display font-bold">
                        {phase.step}
                      </span>
                    </div>
                  </div>

                  {/* Image side */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className={`${isLeft ? 'lg:order-1' : 'lg:order-2'} mb-4 lg:mb-0`}
                  >
                    <div className="rounded-xl overflow-hidden border border-surface-800 aspect-[3/2]">
                      <MediaPlaceholder
                        url={asset?.url}
                        type="image"
                        alt={phase.title}
                        hint={`Upload: ${phase.title.toLowerCase()} visual`}
                        width={480}
                        height={320}
                        className="rounded-xl"
                      />
                    </div>
                  </motion.div>

                  {/* Text side */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.05 }}
                    className={`${isLeft ? 'lg:order-2 lg:pl-12' : 'lg:order-1 lg:pr-12 lg:text-right'} flex flex-col justify-center`}
                  >
                    {/* Mobile step indicator */}
                    <div className="flex items-center gap-3 mb-3 lg:hidden">
                      <div className={`w-8 h-8 rounded-full ${accentMap[phase.accent]} border flex items-center justify-center`}>
                        <span className="text-[10px] font-display font-bold">
                          {phase.step}
                        </span>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full ${dotColor[phase.accent]}`} />
                    </div>

                    <div className={`flex items-center gap-2 mb-2 ${!isLeft ? 'lg:justify-end' : ''}`}>
                      <phase.icon size={18} className={accentMap[phase.accent].split(' ')[0]} />
                      <h3 className="text-xl font-display font-bold text-white">
                        {phase.title}
                      </h3>
                    </div>
                    <p className="text-sm text-surface-400 font-body leading-relaxed max-w-md">
                      {phase.description}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional process video */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="rounded-2xl overflow-hidden border border-surface-800 aspect-video max-w-4xl mx-auto">
            <MediaPlaceholder
              url={processVideo?.url}
              type="video"
              alt="Design process timelapse"
              hint="Optional: Upload a Figma design timelapse video (20-30 sec)"
              width={1280}
              height={720}
            />
          </div>
          <p className="text-center text-xs text-surface-500 font-body mt-3">
            Watch us design a complete page from scratch
          </p>
        </motion.div>
      </div>
    </section>
  );
}
