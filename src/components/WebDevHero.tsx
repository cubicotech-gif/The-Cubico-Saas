'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Film } from 'lucide-react';
import type { MediaAsset } from '@/lib/media';
import { useLocale } from '@/i18n/LocaleProvider';

interface WebDevHeroProps {
  title: string;
  subtitle: string;
  waNumber: string;
  media: Record<string, MediaAsset>;
}

export default function WebDevHero({ title, subtitle, waNumber, media }: WebDevHeroProps) {
  const { locale, dict } = useLocale();
  const heroVideo = media['webdev-hero-video'];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {});
    }
  }, [heroVideo?.url]);

  return (
    <section className="relative bg-[#0A1628] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-600/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF6B4A]/6 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* ── LEFT: Text Content ── */}
          <div className="order-2 lg:order-1">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[2rem] sm:text-[2.8rem] lg:text-[3.5rem] xl:text-[4rem] font-display font-extrabold text-white leading-[1.08] tracking-tight mb-5"
            >
              {dict.webdev.heroTitle1}<br />
              {dict.webdev.heroTitle2}<br />
              <span className="text-[#FF6B4A]">{dict.webdev.heroTitle3}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[1rem] sm:text-lg text-white/50 font-body leading-relaxed max-w-md lg:max-w-lg mb-8"
            >
              {dict.webdev.heroSubtitle}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href={`/${locale}/order`}
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-[#FF6B4A]/25 font-body text-base sm:text-lg w-full sm:w-auto justify-center sm:justify-start"
              >
                {dict.webdev.heroCta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Micro trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-6 text-[11px] text-white/25 font-body tracking-wide"
            >
              {dict.webdev.heroTrustLine}
            </motion.p>
          </div>

          {/* ── RIGHT: Video ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-[#0A1628]">
              <div className="aspect-video">
                {heroVideo?.url ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: videoLoaded ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full"
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
                  </motion.div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-surface-700">
                    <Film size={44} strokeWidth={1.4} />
                    <p className="text-[10px] font-body mt-2 tracking-[0.2em] uppercase">
                      {dict.home.videoComingSoon}
                    </p>
                  </div>
                )}
              </div>

              {/* Subtle glow border effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-white/5" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
