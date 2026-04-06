'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { MediaAsset } from '@/lib/media';

interface WebDevHeroProps {
  title: string;
  subtitle: string;
  waNumber: string;
  media: Record<string, MediaAsset>;
}

export default function WebDevHero({ title, subtitle, waNumber, media }: WebDevHeroProps) {
  const heroVideo = media['webdev-hero-video'];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Ensure autoplay works after mount
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
  }, [heroVideo?.url]);

  const scrollToCta = () => {
    const el = document.getElementById('webdev-cta');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden">

      {/* ── VIDEO / FALLBACK BACKGROUND (full width, behind everything) ── */}
      <div className="absolute inset-0 z-0">
        {heroVideo?.url ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: videoLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src={heroVideo.url}
              muted
              autoPlay
              loop
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover"
            />
            {/* Opacity overlay — 40% on desktop, 70% on mobile */}
            <div className="absolute inset-0 bg-[#0A1628]/60 lg:bg-[#0A1628]/40" />
          </motion.div>
        ) : (
          /* Animated gradient mesh fallback */
          <div className="absolute inset-0 bg-[#0A1628]">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-600/8 blur-[120px] animate-glow" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF6B4A]/6 blur-[120px] animate-glow [animation-delay:1.5s]" />
              <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-violet-600/5 blur-[100px] animate-glow [animation-delay:3s]" />
            </div>
          </div>
        )}
      </div>

      {/* ── DIAGONAL LEFT PANEL (desktop only) ── */}
      <div
        className="hidden lg:block absolute inset-0 z-10"
        style={{
          clipPath: 'polygon(0 0, 50% 0, 38% 100%, 0 100%)',
          background: 'linear-gradient(160deg, #0A1628 0%, #0d1f3c 50%, #0A1628 100%)',
        }}
      >
        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ── MOBILE: full overlay instead of diagonal ── */}
      <div className="lg:hidden absolute inset-0 z-10 bg-[#0A1628]/70" />

      {/* ── TEXT CONTENT ── */}
      <div className="relative z-20 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="lg:max-w-[42%]">

            {/* Back link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Link
                href="/#services"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8 font-body"
              >
                <ArrowLeft size={14} />
                Back to services
              </Link>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[2rem] sm:text-[2.8rem] lg:text-[3.5rem] xl:text-[4rem] font-display font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            >
              Your Website.<br />
              Built by Humans.<br />
              <span className="text-[#FF6B4A]">Ready in Hours.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[1rem] sm:text-lg text-white/50 font-body leading-relaxed max-w-md lg:max-w-lg mb-8"
            >
              No templates to fight. No subscriptions forever. No freelancer who
              vanishes. Just a team that builds it, launches it, and stays.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <button
                onClick={scrollToCta}
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF6B4A]/25 font-body text-base sm:text-lg w-full sm:w-auto justify-center sm:justify-start"
              >
                Get Your Website
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Micro trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-6 text-[11px] text-white/25 font-body tracking-wide"
            >
              50+ websites built &nbsp;·&nbsp; 12+ countries &nbsp;·&nbsp; 98% client retention
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <div className="w-5 h-8 rounded-full border border-white/15 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-white/40"
          />
        </div>
      </motion.div>
    </section>
  );
}
