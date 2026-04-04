'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MediaAsset } from '@/lib/media';

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

interface StoryCard {
  mediaKey: string; // maps to media[key]
  mediaType: 'video' | 'image';
  headline: string;
  subtext: string;
  buttons: 'pair' | 'single-cta' | 'result';
}

const CARDS: StoryCard[] = [
  {
    mediaKey: 'paincard-1-video',
    mediaType: 'video',
    headline: '2 weeks. 6 tutorials. Still broken.',
    subtext:
      "You tried building it yourself. The AI tools promised 5 minutes. It's been 5 weeks.",
    buttons: 'pair',
  },
  {
    mediaKey: 'paincard-2-image',
    mediaType: 'image',
    headline: 'Paid $800. Got ghosted.',
    subtext:
      'You hired a freelancer. They took your money, delivered half the work, and stopped responding.',
    buttons: 'pair',
  },
  {
    mediaKey: 'paincard-3-image',
    mediaType: 'image',
    headline: "$468/year. And you can't even leave.",
    subtext:
      'Monthly subscriptions that never end. Want to move your site? Start from zero.',
    buttons: 'pair',
  },
  {
    mediaKey: 'paincard-4-video',
    mediaType: 'video',
    headline: 'You just want it done.',
    subtext:
      'No tutorials. No subscriptions. No freelancers. Just someone who builds it and stays.',
    buttons: 'single-cta',
  },
  {
    mediaKey: '',
    mediaType: 'image',
    headline: '',
    subtext: '',
    buttons: 'result',
  },
];

const TOTAL = CARDS.length;
const AUTO_ADVANCE_MS = 5000;

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

interface PainPointsProps {
  media?: Record<string, MediaAsset>;
}

export default function PainPoints({ media = {} }: PainPointsProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [beenThereCount, setBeenThereCount] = useState(0);
  const [beenThereCards, setBeenThereCards] = useState<Set<number>>(new Set());
  const [barProgress, setBarProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  // Touch tracking
  const touchStart = useRef({ x: 0, y: 0, t: 0 });
  const touchDelta = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reduced motion
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  /* ── Navigation ── */
  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= TOTAL) return;
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
      setBarProgress(0);
    },
    [current],
  );

  const goNext = useCallback(() => {
    if (current < TOTAL - 1) goTo(current + 1);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  /* ── Auto-advance timer ── */
  useEffect(() => {
    if (paused || current >= TOTAL - 1) return;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      setBarProgress(Math.min(elapsed / AUTO_ADVANCE_MS, 1));
      if (elapsed >= AUTO_ADVANCE_MS) {
        goNext();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current, paused, goNext]);

  /* ── Keyboard ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  /* ── Touch handlers (horizontal card swipe, vertical = section scroll) ── */
  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    touchDelta.current = 0;
    setPaused(true);
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    // Only capture horizontal swipe
    if (Math.abs(dx) > Math.abs(dy) + 5) {
      touchDelta.current = dx;
      setSwipeOffset(dx);
    }
  };

  const onTouchEnd = () => {
    const dx = touchDelta.current;
    const elapsed = Date.now() - touchStart.current.t;
    const velocity = Math.abs(dx) / Math.max(elapsed, 1);

    // Fast swipe or dragged > 60px
    if (dx < -60 || (dx < -20 && velocity > 0.5)) goNext();
    else if (dx > 60 || (dx > 20 && velocity > 0.5)) goPrev();

    setSwipeOffset(0);
    setPaused(false);
    touchDelta.current = 0;
  };

  /* ── "Been There" handler ── */
  const handleBeenThere = () => {
    if (!beenThereCards.has(current)) {
      setBeenThereCards((prev) => new Set(prev).add(current));
      setBeenThereCount((c) => c + 1);
    }
  };

  /* ── Scroll to CTA ── */
  const scrollToCta = () => {
    document.getElementById('webdev-cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Preload next media ── */
  useEffect(() => {
    const next = CARDS[current + 1];
    if (!next || !next.mediaKey || !media[next.mediaKey]) return;
    const url = media[next.mediaKey].url;
    if (next.mediaType === 'image') {
      const img = new Image();
      img.src = url;
    }
    // Video: browser will handle via preload attribute
  }, [current, media]);

  /* ═══ Card content renderer ═══ */
  const renderCard = (idx: number) => {
    const card = CARDS[idx];

    // ── Card 5: Results ──
    if (card.buttons === 'result') {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[#0A1628]">
          <motion.span
            key={beenThereCount}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="text-6xl sm:text-7xl font-display font-extrabold text-[#FF6B4A] mb-2"
          >
            {beenThereCount}
          </motion.span>
          <p className="text-lg sm:text-xl font-display font-semibold text-white mb-1">
            out of 4
          </p>
          <p className="text-surface-400 font-body text-center text-sm sm:text-base mb-8 max-w-xs">
            You&apos;re not alone. That&apos;s why Cubico exists.
          </p>
          <button
            onClick={scrollToCta}
            className="w-full max-w-xs py-3.5 px-6 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-display font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FF6B4A]/25 text-base"
          >
            Get Your Website &rarr;
          </button>
        </div>
      );
    }

    // ── Cards 1-4: Media + text ──
    const asset = media[card.mediaKey];
    return (
      <>
        {/* Layer 1: Media */}
        <div className="absolute inset-0">
          {asset ? (
            card.mediaType === 'video' ? (
              <video
                src={asset.url}
                autoPlay
                muted
                loop
                playsInline
                preload={idx <= current + 1 ? 'auto' : 'none'}
                className="w-full h-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset.url}
                alt={card.headline}
                className="w-full h-full object-cover"
                loading={idx <= current + 1 ? 'eager' : 'lazy'}
              />
            )
          ) : (
            /* Placeholder when no media uploaded */
            <div className="w-full h-full bg-gradient-to-br from-[#0F1D32] to-[#0A1628] flex items-center justify-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                className="opacity-20"
              >
                <rect
                  x="8"
                  y="12"
                  width="48"
                  height="36"
                  rx="4"
                  stroke="#FF6B4A"
                  strokeWidth="2"
                />
                <circle cx="22" cy="28" r="5" stroke="#FF6B4A" strokeWidth="1.5" />
                <path
                  d="M8 40L22 30L34 38L42 32L56 42"
                  stroke="#FF6B4A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Layer 2: Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Layer 3: Text + Buttons */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col">
          <h3 className="font-display font-bold text-white text-xl sm:text-2xl mb-2 leading-tight">
            {card.headline}
          </h3>
          <p className="font-body text-white/80 text-sm sm:text-base mb-6 leading-relaxed">
            {card.subtext}
          </p>

          {card.buttons === 'pair' && (
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBeenThere();
                }}
                className={`flex-1 py-2.5 rounded-lg font-body font-medium text-sm transition-all ${
                  beenThereCards.has(idx)
                    ? 'bg-[#FF6B4A]/80 text-white'
                    : 'bg-[#FF6B4A] text-white hover:bg-[#ff7f61] active:scale-95'
                }`}
              >
                {beenThereCards.has(idx) ? '✓ Been There' : 'Been There'}
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex-1 py-2.5 rounded-lg font-body font-medium text-sm border border-white/30 text-white hover:bg-white/10 transition-all active:scale-95"
              >
                Not Me
              </button>
            </div>
          )}

          {card.buttons === 'single-cta' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                scrollToCta();
              }}
              className="w-full py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-display font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-95 text-base"
            >
              That&apos;s exactly what I want &rarr;
            </button>
          )}
        </div>
      </>
    );
  };

  /* ═══ Animation variants ═══ */
  const variants = reducedMotion
    ? { enter: {}, center: {}, exit: {} }
    : {
        enter: (dir: number) => ({
          x: dir > 0 ? 300 : -300,
          scale: 0.95,
          rotate: dir > 0 ? 3 : -3,
          opacity: 0,
        }),
        center: {
          x: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
        },
        exit: (dir: number) => ({
          x: dir > 0 ? -300 : 300,
          scale: 0.92,
          rotate: dir > 0 ? -5 : 5,
          opacity: 0,
        }),
      };

  /* ═══ Desktop peek cards (stacked behind) ═══ */
  const peekCards = [];
  for (let offset = 1; offset <= 2; offset++) {
    const idx = current + offset;
    if (idx >= TOTAL) break;
    peekCards.push(
      <div
        key={`peek-${idx}`}
        className="absolute inset-0 rounded-2xl bg-[#0F1D32] border border-white/5 pointer-events-none"
        style={{
          transform: `translateY(${offset * 8}px) scale(${1 - offset * 0.03}) rotate(${offset % 2 === 0 ? 2 : -2}deg)`,
          opacity: 0.4 - offset * 0.15,
          zIndex: -offset,
        }}
      />,
    );
  }

  return (
    <section className="relative py-16 sm:py-24 bg-surface-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B4A]/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            We Know Why You&apos;re Here
          </h2>
          <p className="text-surface-500 font-body text-base sm:text-lg max-w-lg mx-auto">
            You&apos;ve been through the cycle. Let&apos;s break it.
          </p>
        </motion.div>

        {/* ── Card Deck ── */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[600px]">
            {/* Progress bars */}
            <div className="flex gap-1.5 mb-4 px-1">
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="flex-1 h-1 rounded-full overflow-hidden bg-white/10 cursor-pointer"
                  aria-label={`Go to card ${i + 1}`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{
                      width:
                        i < current
                          ? '100%'
                          : i === current
                            ? `${barProgress * 100}%`
                            : '0%',
                      background: '#FF6B4A',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Card container */}
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden rounded-2xl border border-white/10"
              style={{ aspectRatio: '4/3' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Peek cards behind (desktop) */}
              <div className="hidden sm:block">{peekCards}</div>

              {/* Active card */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: reducedMotion ? 0 : 0.35,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    x: swipeOffset,
                    rotate: swipeOffset * 0.02,
                  }}
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  role="group"
                  aria-label={CARDS[current].headline || `Result card`}
                >
                  {renderCard(current)}
                </motion.div>
              </AnimatePresence>

              {/* Tap zones (left/right) — mobile + desktop */}
              <button
                onClick={goPrev}
                className="absolute left-0 top-0 w-1/4 h-full z-20 cursor-pointer"
                aria-label="Previous card"
              />
              <button
                onClick={goNext}
                className="absolute right-0 top-0 w-1/4 h-full z-20 cursor-pointer"
                aria-label="Next card"
              />
            </div>

            {/* Desktop arrow buttons */}
            <div className="hidden sm:flex justify-between mt-4">
              <button
                onClick={goPrev}
                disabled={current === 0}
                className="p-2.5 rounded-xl border border-white/10 bg-[#0F1D32] text-white disabled:opacity-30 hover:border-[#FF6B4A]/30 transition-all"
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12 4L6 10L12 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-xs font-body text-surface-600 self-center">
                {current + 1} / {TOTAL}
              </span>
              <button
                onClick={goNext}
                disabled={current === TOTAL - 1}
                className="p-2.5 rounded-xl border border-white/10 bg-[#0F1D32] text-white disabled:opacity-30 hover:border-[#FF6B4A]/30 transition-all"
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M8 4L14 10L8 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Transition line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 sm:mt-14 text-center"
        >
          <p className="text-lg sm:text-xl font-display font-semibold text-white">
            Cubico eliminates all of this.{' '}
            <span className="text-[#FF6B4A]">Here&apos;s how.</span>
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
    </section>
  );
}
