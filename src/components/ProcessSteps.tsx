'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Pick a Design',
    description:
      'Browse our template library. Not sure what fits? We\'ll recommend one for your industry.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="14" height="14" rx="2" stroke="#FF6B4A" strokeWidth="2" />
        <rect x="22" y="4" width="14" height="14" rx="2" stroke="#FF6B4A" strokeWidth="2" />
        <rect x="4" y="22" width="14" height="14" rx="2" stroke="#FF6B4A" strokeWidth="2" />
        <rect x="22" y="22" width="14" height="14" rx="2" stroke="#FF6B4A" strokeWidth="2" />
        <line x1="8" y1="9" x2="14" y2="9" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="8" y1="13" x2="12" y2="13" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="26" y1="9" x2="32" y2="9" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <line x1="26" y1="13" x2="30" y2="13" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Share Your Details',
    description:
      'Logo, content, colors — through a form, WhatsApp, or just a phone call. Or let us handle the creative direction.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M8 8H32C33.1 8 34 8.9 34 10V26C34 27.1 33.1 28 32 28H14L8 34V10C8 8.9 8.9 8 10 8H8Z" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="18" r="1.5" fill="#FF6B4A" />
        <circle cx="22" cy="18" r="1.5" fill="#FF6B4A" />
        <circle cx="28" cy="18" r="1.5" fill="#FF6B4A" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Review & Revise',
    description:
      'We build within hours. You get a live preview link. Your dedicated agent handles revisions — no re-explaining.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="14" ry="9" stroke="#FF6B4A" strokeWidth="2" />
        <circle cx="20" cy="20" r="4" stroke="#FF6B4A" strokeWidth="2" />
        <circle cx="20" cy="20" r="1.5" fill="#FF6B4A" />
        <path d="M6 20C6 20 10 12 20 12" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M34 20C34 20 30 28 20 28" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Pay & Own',
    description:
      'One-time fee. Domain in your name. Full ownership. No lock-in. No monthly subscription.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="16" cy="22" r="8" stroke="#FF6B4A" strokeWidth="2" />
        <circle cx="16" cy="22" r="3" stroke="#FF6B4A" strokeWidth="1.5" />
        <path d="M22 16L34 4" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" />
        <path d="M28 4H34V10" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="29" y1="9" x2="32" y2="6" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ── Desktop horizontal timeline (SVG line between nodes) ── */
function DesktopTimeline({ progress }: { progress: number }) {
  return (
    <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-[2px] pointer-events-none">
      {/* Background line */}
      <div className="absolute inset-0 bg-white/5 rounded-full" />
      {/* Animated coral fill */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #FF6B4A 0%, #FF6B4A 80%, transparent 100%)',
          width: `${progress}%`,
        }}
      />
      {/* Nodes */}
      {steps.map((_, i) => {
        const pct = (i / (steps.length - 1)) * 100;
        const active = progress >= pct;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${pct}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: active ? 1 : 0.5, opacity: active ? 1 : 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                active
                  ? 'bg-[#FF6B4A] border-[#FF6B4A] shadow-[0_0_12px_rgba(255,107,74,0.5)]'
                  : 'bg-surface-950 border-white/20'
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Mobile vertical timeline ── */
function MobileTimeline({ progress }: { progress: number }) {
  return (
    <div className="lg:hidden absolute left-5 top-0 bottom-0 w-[2px] pointer-events-none">
      <div className="absolute inset-0 bg-white/5 rounded-full" />
      <motion.div
        className="absolute inset-x-0 top-0 rounded-full"
        style={{
          background: 'linear-gradient(180deg, #FF6B4A 0%, #FF6B4A 80%, transparent 100%)',
          height: `${progress}%`,
        }}
      />
      {steps.map((_, i) => {
        const pct = (i / (steps.length - 1)) * 100;
        const active = progress >= pct;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: `${pct}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: active ? 1 : 0.5, opacity: active ? 1 : 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                active
                  ? 'bg-[#FF6B4A] border-[#FF6B4A] shadow-[0_0_10px_rgba(255,107,74,0.5)]'
                  : 'bg-surface-950 border-white/20'
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ProcessSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    // Animate the timeline drawing over 1.2s
    let start: number | null = null;
    const duration = 1200;
    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (elapsed < duration) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [isInView]);

  return (
    <section className="relative py-20 sm:py-28 bg-surface-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-600/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8" ref={sectionRef}>
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            4 Steps. That&apos;s It.
          </h2>
          <p className="text-surface-500 font-body text-base sm:text-lg max-w-md mx-auto">
            No sprints. No stand-ups. No nonsense.
          </p>
        </motion.div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden lg:block relative">
          {/* Timeline */}
          <div className="relative mb-8 h-[56px]">
            <DesktopTimeline progress={progress} />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const cardActive = progress >= (i / (steps.length - 1)) * 100;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  animate={cardActive ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group relative rounded-xl border border-white/10 bg-[#0F1D32] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF6B4A]/[0.06] hover:border-[#FF6B4A]/20 overflow-hidden"
                >
                  {/* Watermark number */}
                  <span className="absolute -top-2 -right-1 text-[5rem] font-display font-extrabold text-white/[0.03] leading-none select-none pointer-events-none">
                    {step.num}
                  </span>

                  <div className="relative">
                    <div className="mb-4">{step.icon}</div>
                    <h3 className="font-display font-semibold text-white text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-surface-400 font-body leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="lg:hidden relative pl-12">
          <MobileTimeline progress={progress} />

          <div className="space-y-6">
            {steps.map((step, i) => {
              const cardActive = progress >= (i / (steps.length - 1)) * 100;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={cardActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.12 }}
                  className="relative rounded-xl border border-white/10 bg-[#0F1D32] p-5 overflow-hidden"
                >
                  {/* Watermark number */}
                  <span className="absolute -top-1 -right-1 text-[4rem] font-display font-extrabold text-white/[0.03] leading-none select-none pointer-events-none">
                    {step.num}
                  </span>

                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">{step.icon}</div>
                    <div>
                      <h3 className="font-display font-semibold text-white text-base mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-surface-400 font-body leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
