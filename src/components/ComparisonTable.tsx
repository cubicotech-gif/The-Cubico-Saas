'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Table data ── */
const rows = [
  {
    criteria: 'Technical knowledge',
    diy: 'Required',
    freelancer: 'You manage them',
    cubico: 'None needed',
  },
  {
    criteria: 'Cost',
    diy: '$200–800/year forever',
    freelancer: '$2,000–10,000 if they finish',
    cubico: 'One-time affordable fee',
  },
  {
    criteria: 'You own the website',
    diy: 'Usually no (platform lock-in)',
    freelancer: 'Depends on contract',
    cubico: 'Always — domain, files, everything',
  },
  {
    criteria: 'Dedicated support',
    diy: 'Chatbot',
    freelancer: 'Disappears after delivery',
    cubico: 'Stays with you — same person',
  },
  {
    criteria: 'Revision process',
    diy: 'Figure it out yourself',
    freelancer: 'Back-and-forth emails for weeks',
    cubico: 'WhatsApp message or live chat',
  },
  {
    criteria: 'Can leave anytime',
    diy: 'Often no',
    freelancer: 'Your code, but who maintains?',
    cubico: 'Your site, your domain, your choice',
  },
];

/* ── Mobile comparison cards ── */
const mobileCards = [
  {
    label: 'Technical Knowledge',
    pain: 'They require it.',
    benefit: 'We don\'t.',
  },
  {
    label: 'Cost',
    pain: 'They charge monthly forever.',
    benefit: 'We charge once.',
  },
  {
    label: 'After Launch',
    pain: 'They disappear.',
    benefit: 'We stay.',
  },
];

/* ── Icons ── */
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
      <path d="M3 8.5L6.5 12L13 4" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
      <path d="M4 4L12 12M12 4L4 12" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Desktop Table ── */
function DesktopTable() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setShimmer(true), 700);
      const t2 = setTimeout(() => setShimmer(false), 1500);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="hidden lg:block rounded-xl border border-white/10 bg-[#0F1D32] overflow-hidden"
    >
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-4 px-6 text-sm font-body text-surface-500 font-medium w-[22%]">
              Criteria
            </th>
            <th className="py-4 px-6 text-sm font-body text-surface-500 font-medium w-[26%]">
              DIY Builders
            </th>
            <th className="py-4 px-6 text-sm font-body text-surface-500 font-medium w-[26%]">
              Freelancers
            </th>
            <th
              className={`relative py-4 px-6 text-sm font-display font-semibold text-[#FF6B4A] w-[26%] border-t-2 border-l border-[#FF6B4A] bg-[#152238] transition-all duration-500 ${
                shimmer ? 'shadow-[inset_0_0_30px_rgba(255,107,74,0.08)]' : ''
              }`}
            >
              Cubico
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-white/5">
              <td className="py-4 px-6 text-sm font-body text-surface-300 font-medium">
                {row.criteria}
              </td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center gap-2 text-sm font-body text-surface-500">
                  <XIcon />
                  {row.diy}
                </span>
              </td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center gap-2 text-sm font-body text-surface-500">
                  <XIcon />
                  {row.freelancer}
                </span>
              </td>
              <td
                className={`py-4 px-6 border-l border-[#FF6B4A]/20 bg-[#152238] transition-all duration-500 ${
                  shimmer ? 'shadow-[inset_0_0_20px_rgba(255,107,74,0.05)]' : ''
                }`}
              >
                <span className="inline-flex items-center gap-2 text-sm font-body text-white">
                  <CheckIcon />
                  {row.cubico}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

/* ── Mobile Swipe Cards ── */
function MobileCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActive(idx);
  }, []);

  return (
    <div className="lg:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide gap-4 pb-4 -mx-5 px-5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mobileCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="snap-center flex-shrink-0 w-[85vw] max-w-[340px] rounded-xl border border-white/10 bg-[#0F1D32] overflow-hidden"
          >
            {/* Label */}
            <div className="px-5 py-3 border-b border-white/5">
              <span className="text-xs font-body text-surface-500 uppercase tracking-wider">
                {card.label}
              </span>
            </div>

            <div className="flex">
              {/* Pain side */}
              <div className="flex-1 p-5 border-r border-white/5">
                <div className="flex items-center gap-1.5 mb-2">
                  <XIcon />
                  <span className="text-xs font-body text-surface-600 uppercase tracking-wide">Others</span>
                </div>
                <p className="text-sm font-body text-surface-400 leading-relaxed">
                  {card.pain}
                </p>
              </div>

              {/* Cubico side */}
              <div className="flex-1 p-5 bg-[#152238]">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckIcon />
                  <span className="text-xs font-display text-[#FF6B4A] uppercase tracking-wide font-semibold">Cubico</span>
                </div>
                <p className="text-sm font-body text-white leading-relaxed">
                  {card.benefit}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {mobileCards.map((_, i) => (
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
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ComparisonTable() {
  return (
    <section className="relative py-20 sm:py-28 bg-surface-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FF6B4A]/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            Why This Is Different
          </h2>
          <p className="text-surface-500 font-body text-base sm:text-lg max-w-lg mx-auto">
            A side-by-side look at what you actually get.
          </p>
        </motion.div>

        <DesktopTable />
        <MobileCards />
      </div>
    </section>
  );
}
