'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import type { MediaAsset } from '@/lib/media';

/* ═══════════════════════════════════════════════════════════════════
   STAGE DATA
   ═══════���═══════════════════════════════════════════════════════════ */

const STAGES = [
  {
    num: '01',
    url: 'about:blank',
    label: 'Pick a design from our library',
    sublabel: 'Hundreds of templates. Every industry.',
  },
  {
    num: '02',
    url: 'cubico.dev/preview/your-site',
    label: 'Share your details. We handle the rest.',
    sublabel: 'Logo, colors, content — WhatsApp or form.',
  },
  {
    num: '03',
    url: 'cubico.dev/preview/your-site',
    label: 'Review and revise. Your agent handles it.',
    sublabel: 'No re-explaining. Same person. Always.',
  },
  {
    num: '04',
    url: 'www.your-business.com',
    label: 'Pay once. Own everything. Forever.',
    sublabel: 'Domain in your name. No subscriptions. No lock-in.',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   CONFETTI
   ════���═══════════════════════��═══════════════════════════��══════════ */

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  drift: number;
  rot: number;
  size: number;
}

function useConfetti(): Particle[] {
  return useMemo(() => {
    const colors = ['#FF6B4A', '#FFD700', '#ffffff', '#FF6B4A', '#FFD700'];
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 40,
      color: colors[i % colors.length],
      delay: Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 120,
      rot: Math.random() * 720 - 360,
      size: 4 + Math.random() * 4,
    }));
  }, []);
}

function Confetti({ particles, active }: { particles: Particle[]; active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            bottom: '50%',
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            borderRadius: 1,
            animation: `confetti-burst 2s ${p.delay}s ease-out forwards`,
            opacity: 0,
            ['--drift' as string]: `${p.drift}px`,
            ['--rot' as string]: `${p.rot}deg`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-burst {
          0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); }
          20% { opacity: 1; transform: translateY(-120px) translateX(calc(var(--drift) * 0.3)) rotate(calc(var(--rot) * 0.3)); }
          100% { opacity: 0; transform: translateY(180px) translateX(var(--drift)) rotate(var(--rot)); }
        }
      `}</style>
    </div>
  );
}

/* ═══���════════════════════���════════════════════════��═════════════════
   BROWSER MOCKUP CONTENT
   ════════════════════════���══════════════════════════════════════════ */

function BrowserContent({
  progress,
  media,
  showConfetti,
}: {
  progress: number;
  media: Record<string, MediaAsset>;
  showConfetti: boolean;
}) {
  const confettiParticles = useConfetti();
  const stage = progress < 25 ? 0 : progress < 50 ? 1 : progress < 75 ? 2 : 3;
  const stageProgress =
    stage === 0
      ? progress / 25
      : stage === 1
        ? (progress - 25) / 25
        : stage === 2
          ? (progress - 50) / 25
          : (progress - 75) / 25;

  const heroImage = media['process-hero-image'];
  const swapImage = media['process-hero-swap'];
  const showSwap = stage >= 2 && stageProgress > 0.3;

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* ── HEADER ── */}
      <div
        className="w-full flex items-center px-3 transition-all duration-700"
        style={{
          height: stage >= 2 ? '10%' : '12%',
          backgroundColor:
            stage >= 1 && stageProgress > 0.2 ? '#0A1628' : '#E0E0E0',
          opacity: stage === 0 ? Math.min(stageProgress * 3, 1) : 1,
        }}
      >
        {stage >= 1 && stageProgress > 0.3 ? (
          <>
            <div
              className="w-6 h-3 rounded-sm mr-auto"
              style={{
                backgroundColor:
                  media['process-sample-logo'] ? 'transparent' : '#FF6B4A',
                backgroundImage: media['process-sample-logo']
                  ? `url(${media['process-sample-logo'].url})`
                  : 'none',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
            <div className="flex gap-2">
              {['Home', 'About', 'Services', 'Contact'].map((t) => (
                <span
                  key={t}
                  className="text-[6px] sm:text-[8px] text-white/70 font-body"
                >
                  {t}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-2 bg-white/20 rounded" />
        )}
      </div>

      {/* ── HERO ── */}
      <div
        className="w-full relative overflow-hidden transition-all duration-500"
        style={{
          height: '40%',
          opacity: stage === 0 ? Math.min(stageProgress * 2.5, 1) : 1,
        }}
      >
        {/* Stage 0: grey placeholder */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
          style={{
            backgroundColor: '#ECECEC',
            opacity: stage === 0 ? 1 : 0,
          }}
        >
          <svg width="40" height="32" viewBox="0 0 40 32" fill="none" opacity="0.3">
            <path d="M0 28L12 16L20 24L28 12L40 24V32H0V28Z" fill="#ccc" />
            <circle cx="30" cy="8" r="4" fill="#ccc" />
          </svg>
        </div>

        {/* Stage 1+: real image or gradient placeholder */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: stage >= 1 ? stageProgress : 0 }}
        >
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage.url}
              alt="Sample hero"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0A1628] to-[#1a3a5c]" />
          )}
        </div>

        {/* Stage 2+: swap image crossfade */}
        {(swapImage || !heroImage) && (
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: showSwap ? 1 : 0 }}
          >
            {swapImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={swapImage.url}
                alt="Swapped hero"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a3a5c] to-[#0d2847]" />
            )}
          </div>
        )}

        {/* Hero text overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: stage >= 1 && stageProgress > 0.5 ? 1 : 0 }}
        >
          <div className="text-center px-4">
            <p className="text-[8px] sm:text-xs font-display font-bold text-white drop-shadow-lg">
              Welcome to Your Business
            </p>
            <p className="text-[5px] sm:text-[7px] text-white/70 mt-1 font-body">
              Professional solutions for modern brands
            </p>
          </div>
        </div>

        {/* Stage 3: highlight flash */}
        {stage === 2 && stageProgress > 0.4 && stageProgress < 0.7 && (
          <div className="absolute inset-0 border-2 border-[#FF6B4A]/50 rounded animate-pulse pointer-events-none" />
        )}
      </div>

      {/* ── 3 COLUMNS ── */}
      <div
        className="w-full flex gap-[3%] px-[4%] transition-all duration-500"
        style={{
          height: '22%',
          paddingTop: '3%',
          opacity: stage === 0 ? Math.min(stageProgress * 2 - 0.3, 1) : 1,
        }}
      >
        {[0, 1, 2].map((col) => (
          <div
            key={col}
            className="flex-1 rounded-sm overflow-hidden transition-all duration-700"
            style={{
              backgroundColor:
                stage >= 1 && stageProgress > 0.4 + col * 0.15
                  ? '#f8f9fa'
                  : '#E8E8E8',
              opacity:
                stage === 0
                  ? Math.max(0, Math.min((stageProgress - 0.2 - col * 0.1) * 4, 1))
                  : 1,
            }}
          >
            {stage >= 1 && stageProgress > 0.5 + col * 0.1 ? (
              <div className="flex flex-col items-center justify-center h-full p-1">
                <div
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mb-1"
                  style={{
                    backgroundColor:
                      col === 0 ? '#FF6B4A' : col === 1 ? '#3B82F6' : '#10B981',
                    opacity: 0.8,
                  }}
                />
                <div className="w-[60%] h-1 bg-gray-300 rounded mb-0.5" />
                <div className="w-[45%] h-1 bg-gray-200 rounded" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-1 p-1">
                <div className="w-[50%] h-1.5 bg-white/40 rounded" />
                <div className="w-[70%] h-1 bg-white/30 rounded" />
                <div className="w-[40%] h-1 bg-white/20 rounded" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── BUTTON ── */}
      <div
        className="w-full flex justify-center transition-all duration-500"
        style={{
          paddingTop: '3%',
          height: '14%',
          opacity: stage === 0 ? Math.min(stageProgress * 2 - 0.5, 1) : 1,
        }}
      >
        <div
          className="rounded-sm flex items-center justify-center transition-all duration-700"
          style={{
            width: stage >= 1 ? '30%' : '25%',
            height: '55%',
            backgroundColor:
              stage >= 1 && stageProgress > 0.6 ? '#FF6B4A' : '#D8D8D8',
            borderRadius:
              stage >= 2 && stageProgress > 0.5 ? '6px' : '3px',
          }}
        >
          {stage >= 1 && stageProgress > 0.7 && (
            <span className="text-[5px] sm:text-[7px] text-white font-body font-medium">
              Get Started
            </span>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div
        className="absolute bottom-0 w-full flex items-center justify-center transition-all duration-500"
        style={{
          height: '10%',
          backgroundColor: stage >= 1 ? '#0A1628' : '#E8E8E8',
          opacity: stage === 0 ? Math.min(stageProgress * 2 - 0.6, 1) : 1,
        }}
      >
        {stage >= 1 && stageProgress > 0.5 ? (
          <div className="flex gap-2 items-center">
            {['◯', '◯', '◯'].map((icon, i) => (
              <span key={i} className="text-[6px] text-white/40">
                {icon}
              </span>
            ))}
          </div>
        ) : (
          <div className="w-[40%] h-1.5 bg-white/20 rounded" />
        )}
      </div>

      {/* ── CURSOR (Stage 3) ── */}
      {stage === 2 && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            animation: 'cursor-move 2.5s ease-in-out infinite',
            opacity: stageProgress > 0.1 ? 1 : 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 3L19 12L12 13L9 21L5 3Z"
              fill="#FF6B4A"
              stroke="#fff"
              strokeWidth="1"
            />
          </svg>
          {stageProgress > 0.6 && (
            <div className="absolute -top-6 left-4 bg-[#0A1628] text-white text-[6px] px-1.5 py-0.5 rounded font-body whitespace-nowrap animate-bounce">
              Done ✓
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes cursor-move {
          0% { top: 8%; left: 30%; }
          25% { top: 12%; left: 60%; }
          50% { top: 42%; left: 45%; }
          75% { top: 72%; left: 50%; }
          100% { top: 8%; left: 30%; }
        }
      `}</style>

      {/* ── Stage 4: Sheen + Badge + Confetti ── */}
      {stage === 3 && (
        <>
          {/* Sheen sweep */}
          {stageProgress > 0.2 && stageProgress < 0.7 && (
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(255,107,74,0.12) 50%, transparent 60%)',
                animation: 'sheen-sweep 1.5s ease-out forwards',
              }}
            />
          )}

          {/* OWNED BY YOU badge */}
          {stageProgress > 0.5 && (
            <div
              className="absolute bottom-[14%] right-[6%] z-20 flex items-center gap-1 px-2 py-1 rounded border border-[#FF6B4A]/40 bg-[#0A1628]/90"
              style={{
                animation: 'stamp 0.5s ease-out forwards',
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8.5L6.5 12L13 4"
                  stroke="#FF6B4A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[5px] sm:text-[7px] font-display font-bold text-[#FF6B4A] tracking-wider">
                OWNED BY YOU
              </span>
            </div>
          )}

          <Confetti particles={confettiParticles} active={showConfetti} />
        </>
      )}
      <style>{`
        @keyframes sheen-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes stamp {
          0% { opacity: 0; transform: scale(1.5) rotate(-8deg); }
          60% { opacity: 1; transform: scale(0.95) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(-2deg); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BROWSER CHROME
   ═══════════════════════════════���═══════════════════════════════════ */

function BrowserChrome({
  progress,
  media,
  showConfetti,
}: {
  progress: number;
  media: Record<string, MediaAsset>;
  showConfetti: boolean;
}) {
  const stage = progress < 25 ? 0 : progress < 50 ? 1 : progress < 75 ? 2 : 3;
  const stageProgress = stage === 3 ? (progress - 75) / 25 : 0;

  const urlText =
    stage === 0
      ? 'about:blank'
      : stage <= 2
        ? 'cubico.dev/preview/your-site'
        : stageProgress > 0.3
          ? 'www.your-business.com'
          : 'cubico.dev/preview/your-site';

  const showLock = stage === 3 && stageProgress > 0.4;

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10">
      {/* Top bar */}
      <div className="bg-[#2D2D2D] h-10 flex items-center px-3 gap-2">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>

        {/* Tab */}
        <div className="ml-2 px-3 py-1 bg-[#3C3C3C] rounded-t-md flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-white/20" />
          <span className="text-[9px] text-white/60 font-body truncate max-w-[100px]">
            {stage === 3 && stageProgress > 0.5
              ? 'Your Business — Official Website'
              : 'New Website'}
          </span>
        </div>

        {/* URL bar */}
        <div className="flex-1 mx-2 h-6 bg-[#4A4A4A] rounded-md flex items-center px-2 gap-1.5 overflow-hidden">
          {showLock && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              className="flex-shrink-0"
            >
              <rect x="3" y="7" width="10" height="8" rx="1.5" fill="#27C93F" />
              <path
                d="M5 7V5C5 3.34 6.34 2 8 2C9.66 2 11 3.34 11 5V7"
                stroke="#27C93F"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          )}
          <span className="text-[9px] text-white/50 font-mono truncate">
            {urlText}
          </span>
        </div>
      </div>

      {/* Browser body */}
      <div
        className="w-full bg-white"
        style={{ aspectRatio: '16/10' }}
      >
        <BrowserContent
          progress={progress}
          media={media}
          showConfetti={showConfetti}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════��═══════════════════════
   STEP LABELS
   ═════════════════════��════════════════════════════════��════════════ */

function StepLabels({
  progress,
  vertical,
}: {
  progress: number;
  vertical?: boolean;
}) {
  const stage = progress < 25 ? 0 : progress < 50 ? 1 : progress < 75 ? 2 : 3;

  if (!vertical) {
    /* Desktop — left side, vertical layout */
    return (
      <div className="relative flex flex-col justify-between h-full py-8">
        {/* Progress line */}
        <div className="absolute left-[14px] top-8 bottom-8 w-[2px] bg-white/5 rounded-full">
          <div
            className="absolute inset-x-0 top-0 bg-[#FF6B4A] rounded-full transition-all duration-700"
            style={{ height: `${Math.min(progress / 75 * 100, 100)}%` }}
          />
        </div>

        {STAGES.map((s, i) => (
          <div key={i} className="relative pl-10">
            {/* Step dot */}
            <div
              className={`absolute left-[9px] top-1 w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                stage >= i
                  ? 'bg-[#FF6B4A] border-[#FF6B4A] shadow-[0_0_10px_rgba(255,107,74,0.4)]'
                  : 'bg-surface-950 border-white/20'
              }`}
            />

            {/* Watermark number */}
            <span
              className="absolute -left-1 -top-4 text-5xl font-display font-extrabold leading-none select-none pointer-events-none transition-opacity duration-500"
              style={{
                color:
                  stage === i
                    ? 'rgba(255,107,74,0.08)'
                    : 'rgba(255,255,255,0.02)',
              }}
            >
              {s.num}
            </span>

            <div
              className="transition-all duration-500"
              style={{
                opacity: stage === i ? 1 : 0.3,
                transform: stage === i ? 'translateX(0)' : 'translateX(-4px)',
              }}
            >
              <p className="text-white font-display font-semibold text-[1.1rem] leading-tight mb-1">
                {s.label}
              </p>
              <p className="text-white/50 font-body text-sm">
                {s.sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* Mobile — horizontal, below browser, crossfade */
  return (
    <div className="relative h-16 overflow-hidden">
      {STAGES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-500"
          style={{
            opacity: stage === i ? 1 : 0,
            transform: stage === i ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <span className="text-[10px] text-[#FF6B4A] font-display font-bold tracking-wider mb-1">
            STEP {s.num}
          </span>
          <p className="text-white font-display font-semibold text-sm leading-tight">
            {s.label}
          </p>
          <p className="text-white/50 font-body text-xs">
            {s.sublabel}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════��════════════════════════════��══════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════��══════════ */

interface ProcessStepsProps {
  media?: Record<string, MediaAsset>;
}

export default function ProcessSteps({ media = {} }: ProcessStepsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const isMobileInView = useInView(mobileRef, { once: false, margin: '-20%' });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileProgress, setMobileProgress] = useState(0);
  const [mobileComplete, setMobileComplete] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const [mobileConfetti, setMobileConfetti] = useState(false);

  /* ── Desktop: scroll-driven progress ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollable = sectionHeight - viewportHeight;
      if (scrollable <= 0) return;

      const rawProgress = (-rect.top / scrollable) * 100;
      const clamped = Math.max(0, Math.min(100, rawProgress));
      setScrollProgress(clamped);

      if (clamped >= 90 && !confettiTriggered) {
        setConfettiTriggered(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [confettiTriggered]);

  /* ── Mobile: auto-play animation ── */
  const resetMobile = useCallback(() => {
    setMobileProgress(0);
    setMobileComplete(false);
    setMobileConfetti(false);
  }, []);

  useEffect(() => {
    if (!isMobileInView) {
      resetMobile();
      return;
    }

    const duration = 10000;
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setMobileProgress(pct);

      if (pct >= 85 && !mobileConfetti) {
        setMobileConfetti(true);
      }

      if (pct >= 100) {
        setMobileComplete(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isMobileInView, mobileConfetti, resetMobile]);

  return (
    <>
      {/* ═══ DESKTOP ═══ */}
      <section
        ref={sectionRef}
        className="hidden lg:block relative bg-surface-950"
        style={{ height: '400vh' }}
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/[0.03] rounded-full blur-[120px]" />
          </div>

          <div className="relative w-full max-w-6xl mx-auto px-8 flex items-center gap-10">
            {/* Left: title + step labels */}
            <div className="w-[35%] flex flex-col">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-display font-bold text-white text-3xl xl:text-4xl leading-tight mb-10"
              >
                From Zero to Live.
                <br />
                <span className="text-[#FF6B4A]">While You Watch.</span>
              </motion.h2>

              <div className="flex-1 min-h-[300px]">
                <StepLabels progress={scrollProgress} />
              </div>
            </div>

            {/* Right: browser mockup */}
            <div className="w-[65%]">
              <BrowserChrome
                progress={scrollProgress}
                media={media}
                showConfetti={confettiTriggered}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MOBILE ═══ */}
      <section
        ref={mobileRef}
        className="lg:hidden relative py-16 bg-surface-950 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-600/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-lg mx-auto px-3">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
              From Zero to Live.{' '}
              <span className="text-[#FF6B4A]">While You Watch.</span>
            </h2>
          </motion.div>

          {/* Browser */}
          <BrowserChrome
            progress={mobileProgress}
            media={media}
            showConfetti={mobileConfetti}
          />

          {/* Step label (below browser) */}
          <div className="mt-5">
            <StepLabels progress={mobileProgress} vertical />
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF6B4A] rounded-full transition-all duration-100"
              style={{ width: `${mobileProgress}%` }}
            />
          </div>

          {/* Replay button */}
          {mobileComplete && (
            <button
              onClick={resetMobile}
              className="mt-4 mx-auto flex items-center gap-1.5 text-xs text-surface-500 hover:text-white font-body transition-colors"
            >
              Watch again ↺
            </button>
          )}
        </div>
      </section>

      {/* ═══ TRANSITION LINE ══��� */}
      <div className="bg-surface-950 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg sm:text-xl font-display font-semibold text-white">
            Still not convinced?{' '}
            <span className="text-[#FF6B4A]">See how we compare.</span>
          </p>
          <div className="mt-4 flex justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-[#FF6B4A]/40 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
