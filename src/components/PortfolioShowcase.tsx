'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { MediaAsset } from '@/lib/media';

/* ═══════════════════════════════════════════════════════════════════
   PROJECT DATA
   ═══════════════════════════════════════════════════════════════════ */

interface Project {
  title: string;
  industry: string;
  description: string;
  liveUrl: string;
  imageKey: string;
  videoKey: string;
}

const PROJECTS: Project[] = [
  {
    title: 'Al-Noor Academy',
    industry: 'Education — Karachi',
    description: 'School portal with admissions, fee tracking, and parent communication.',
    liveUrl: 'https://manage.cubico.tech',
    imageKey: 'portfolio-alnoor',
    videoKey: 'portfolio-alnoor-video',
  },
  {
    title: 'MedCare Clinic',
    industry: 'Healthcare — Lahore',
    description: 'Patient booking and EHR system designed to reduce anxiety.',
    liveUrl: 'https://teach.cubico.tech',
    imageKey: 'portfolio-medcare',
    videoKey: 'portfolio-medcare-video',
  },
  {
    title: 'Urban Threads',
    industry: 'E-Commerce — Jeddah',
    description: 'Fashion store with conversion-optimised product pages.',
    liveUrl: 'https://creative.cubico.tech',
    imageKey: 'portfolio-urbanthreads',
    videoKey: 'portfolio-urbanthreads-video',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   LAPTOP FRAME
   ═══════════════════════════════════════════════════════════════════ */

function LaptopFrame({
  children,
  floating,
}: {
  children: React.ReactNode;
  floating?: boolean;
}) {
  return (
    <div
      className={floating ? 'animate-float' : ''}
      style={floating ? {} : undefined}
    >
      {/* Screen */}
      <div className="rounded-t-xl border-[3px] border-[#2D2D2D] border-b-0 bg-[#2D2D2D] overflow-hidden">
        {/* Camera dot */}
        <div className="flex justify-center py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A4A4A]" />
        </div>
        {/* Screen content */}
        <div className="aspect-[16/10] overflow-hidden bg-surface-800">
          {children}
        </div>
      </div>
      {/* Bottom bar (keyboard area) */}
      <div className="h-3 bg-[#3C3C3C] rounded-b-lg mx-[8%] border-x-[3px] border-b-[3px] border-[#2D2D2D]" />
      <style>{`
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float { animation: float-y 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PHONE FRAME (mobile)
   ═══════════════════════════════════════════════════════════════════ */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto" style={{ maxWidth: 260 }}>
      <div className="rounded-[20px] border-[3px] border-[#2D2D2D] bg-[#2D2D2D] overflow-hidden p-[2px]">
        {/* Notch */}
        <div className="flex justify-center -mb-1 relative z-10">
          <div className="w-16 h-4 bg-[#2D2D2D] rounded-b-xl" />
        </div>
        {/* Screen */}
        <div className="aspect-[9/16] rounded-[14px] overflow-hidden bg-surface-800 -mt-3">
          {children}
        </div>
        {/* Home bar */}
        <div className="flex justify-center py-1.5">
          <div className="w-10 h-1 rounded-full bg-[#4A4A4A]" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO CARD (Desktop)
   ═══════════════════════════════════════════════════════════════════ */

function DesktopCard({
  project,
  media,
  index,
  onExplore,
}: {
  project: Project;
  media: Record<string, MediaAsset>;
  index: number;
  onExplore: (p: Project) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const image = media[project.imageKey];
  const video = media[project.videoKey];

  const onMouseEnter = () => {
    if (video && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };
  const onMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="group"
      style={{
        perspective: '1000px',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl"
        style={{
          transform: `rotateY(${index === 0 ? 3 : index === 2 ? -3 : 0}deg) rotateX(2deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <LaptopFrame floating>
          <div className="relative w-full h-full">
            {/* Screenshot */}
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.url}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0F1D32] to-[#1a3a5c] flex items-center justify-center">
                <span className="text-white/20 text-xs font-body">
                  Upload screenshot
                </span>
              </div>
            )}

            {/* Video overlay (plays on hover) */}
            {video && (
              <video
                ref={videoRef}
                src={video.url}
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}

            {/* Hover overlay with button */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={() => onExplore(project)}
                className="px-4 py-2 bg-[#FF6B4A] text-white text-xs font-body font-semibold rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#ff7f61]"
              >
                Explore This Site
              </button>
            </div>
          </div>
        </LaptopFrame>
      </div>

      {/* Info below */}
      <div className="mt-5 text-center">
        <p className="text-[11px] text-[#FF6B4A] font-body font-medium tracking-wider uppercase mb-1">
          {project.industry}
        </p>
        <h3 className="font-display font-semibold text-white text-lg mb-1">
          {project.title}
        </h3>
        <p className="text-sm text-surface-400 font-body">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   IFRAME MODAL
   ═══════════════════════════════════════════════════════════════════ */

function IframeModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [loadError, setLoadError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-[90vw] h-[85vh] max-w-7xl rounded-2xl overflow-hidden border border-white/10 bg-surface-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#2D2D2D] border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#ff7b73] transition-colors"
                aria-label="Close"
              />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="px-3 py-1 bg-[#4A4A4A] rounded-md">
              <span className="text-xs text-white/50 font-mono">
                {project.liveUrl}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white text-xs font-body font-medium rounded-lg transition-colors"
            >
              <ExternalLink size={12} />
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="w-full h-[calc(100%-48px)]">
          {loadError ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <p className="text-surface-400 font-body text-sm mb-4">
                This site doesn&apos;t allow previews in iframes.
              </p>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-semibold rounded-xl transition-colors"
              >
                Visit site directly &rarr;
              </a>
            </div>
          ) : (
            <iframe
              src={project.liveUrl}
              title={`Preview of ${project.title}`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              onError={() => setLoadError(true)}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE SWIPE CARDS
   ═══════════════════════════════════════════════════════════════════ */

function MobileCards({ media }: { media: Record<string, MediaAsset> }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActive(idx);
  }, []);

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide -mx-3 px-3 gap-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PROJECTS.map((project, i) => {
          const image = media[project.imageKey];
          const video = media[project.videoKey];

          return (
            <div
              key={i}
              className="snap-center flex-shrink-0 w-[85vw] max-w-[320px]"
            >
              <PhoneFrame>
                <div className="relative w-full h-full">
                  {video ? (
                    <video
                      src={video.url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0F1D32] to-[#1a3a5c] flex items-center justify-center">
                      <span className="text-white/20 text-xs font-body">
                        Upload screenshot
                      </span>
                    </div>
                  )}
                </div>
              </PhoneFrame>

              {/* Info */}
              <div className="mt-4 text-center">
                <p className="text-[10px] text-[#FF6B4A] font-body font-medium tracking-wider uppercase mb-1">
                  {project.industry}
                </p>
                <h3 className="font-display font-semibold text-white text-base mb-1">
                  {project.title}
                </h3>
                <p className="text-xs text-surface-400 font-body mb-3">
                  {project.description}
                </p>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white text-xs font-body font-semibold rounded-lg transition-colors"
                >
                  View Live Site
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              scrollRef.current?.scrollTo({
                left: i * (scrollRef.current?.offsetWidth ?? 0),
                behavior: 'smooth',
              });
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              active === i ? 'bg-[#FF6B4A] w-5' : 'bg-white/20'
            }`}
            aria-label={`View project ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

interface PortfolioShowcaseProps {
  media: Record<string, MediaAsset>;
}

export default function PortfolioShowcase({ media }: PortfolioShowcaseProps) {
  const [modalProject, setModalProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="relative py-20 sm:py-28 bg-surface-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            Have a Glance at Our Work
          </h2>
          <p className="text-surface-500 font-body text-base sm:text-lg max-w-lg mx-auto">
            Real projects. Real clients. Real results.
          </p>
        </motion.div>

        {/* Desktop: 3 laptop cards */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {PROJECTS.map((project, i) => (
            <DesktopCard
              key={project.title}
              project={project}
              media={media}
              index={i}
              onExplore={setModalProject}
            />
          ))}
        </div>

        {/* Mobile: phone frame swipe */}
        <div className="lg:hidden">
          <MobileCards media={media} />
        </div>
      </div>

      {/* iframe modal */}
      <AnimatePresence>
        {modalProject && (
          <IframeModal
            project={modalProject}
            onClose={() => setModalProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
