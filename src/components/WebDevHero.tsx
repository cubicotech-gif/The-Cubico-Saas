'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, ChevronDown, Globe, Users, Award } from 'lucide-react';
import MediaPlaceholder from '@/components/MediaPlaceholder';
import type { MediaAsset } from '@/lib/media';

interface WebDevHeroProps {
  title: string;
  subtitle: string;
  waNumber: string;
  media: Record<string, MediaAsset>;
}

const stats = [
  { value: '50+', label: 'Sites Built' },
  { value: '12+', label: 'Countries' },
  { value: '98%', label: 'Client Retention' },
];

export default function WebDevHero({ title, subtitle, waNumber, media }: WebDevHeroProps) {
  const heroVideo = media['webdev-hero-video'];
  const heroMockup = media['webdev-hero-mockup'];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-surface-950">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-brand-500/8 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/#services"
              className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-white transition-colors mb-6 font-body"
            >
              <ArrowLeft size={14} />
              Back to services
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-body tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Website Development
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-display font-bold text-white leading-[1.1] tracking-tight mb-5">
              {title}
            </h1>
            <p className="text-lg text-surface-400 font-body leading-relaxed max-w-lg mb-8">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href={`https://wa.me/${waNumber}?text=Hi, I'm interested in Website Development`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-brand-600/25 font-body"
              >
                <MessageCircle size={16} />
                Get Started
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-surface-800 hover:bg-surface-700 text-white font-medium rounded-xl transition-colors border border-surface-700 font-body"
              >
                See Our Work
              </a>
            </div>

            {/* Stats row */}
            <div className="flex gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <p className="text-2xl font-display font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-surface-500 font-body">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-surface-800 shadow-2xl shadow-brand-900/20 aspect-[4/3]">
              {/* Show video first, then mockup image, then placeholder */}
              {heroVideo?.url ? (
                <MediaPlaceholder
                  url={heroVideo.url}
                  type="video"
                  alt="Website development showreel"
                  hint="Hero showreel video"
                />
              ) : (
                <MediaPlaceholder
                  url={heroMockup?.url}
                  type="image"
                  alt="Website development mockup"
                  hint="Upload a hero video or device mockup image via Admin Panel"
                  width={1920}
                  height={1080}
                  className="rounded-2xl"
                />
              )}

              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl bg-surface-950/80 backdrop-blur-md border border-surface-800 text-xs text-white font-body">
                <span className="text-brand-400 font-semibold">Live Preview</span>
                <span className="text-surface-500 ml-1.5">of our work</span>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown size={20} className="text-surface-600 animate-bounce" />
      </motion.div>
    </section>
  );
}
