'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════════════
   TEMPLATE DATA
   ═══════════════════════════════════════════════════════════════════ */

export interface Template {
  key: string;
  name: string;
  industry: string;
  color: string;
  gradient: string;
  file: string;
  description: string;
}

export const TEMPLATES: Template[] = [
  {
    key: 'restaurant',
    name: 'Flavor House',
    industry: 'Restaurant',
    color: '#C9A227',
    gradient: 'linear-gradient(135deg, #5C1A1B 0%, #8B2E2F 50%, #C9A227 100%)',
    file: '/templates/restaurant.html',
    description: 'Warm tones, menu cards, reservation form',
  },
  {
    key: 'clinic',
    name: 'CareFirst Medical',
    industry: 'Healthcare',
    color: '#0D9488',
    gradient: 'linear-gradient(135deg, #1E293B 0%, #0D9488 50%, #5EEAD4 100%)',
    file: '/templates/clinic.html',
    description: 'Clean clinical layout, booking system, doctor profiles',
  },
  {
    key: 'shop',
    name: 'Urban Threads',
    industry: 'E-Commerce',
    color: '#FF6B4A',
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #FF6B4A 100%)',
    file: '/templates/shop.html',
    description: 'Product grid, cart UI, newsletter signup',
  },
  {
    key: 'school',
    name: 'Bright Minds',
    industry: 'Education',
    color: '#FBBF24',
    gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #FBBF24 100%)',
    file: '/templates/school.html',
    description: 'Programs, facilities, admissions form',
  },
  {
    key: 'portfolio',
    name: 'Alex Morgan',
    industry: 'Portfolio',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #111111 0%, #1A1A1A 50%, #8B5CF6 100%)',
    file: '/templates/portfolio.html',
    description: 'Bold typography, project grid, creative layout',
  },
  {
    key: 'corporate',
    name: 'Nexus Solutions',
    industry: 'Corporate',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #3B82F6 100%)',
    file: '/templates/corporate.html',
    description: 'Gradient mesh hero, services, case studies',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   IFRAME PREVIEW MODAL
   ═══════════════════════════════════════════════════════════════════ */

function PreviewModal({
  template,
  onClose,
}: {
  template: Template;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-6xl h-[88vh] rounded-2xl overflow-hidden border border-white/10 bg-surface-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2D2D2D] border-b border-white/5">
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
            <div className="hidden sm:flex items-center px-3 py-1 bg-[#4A4A4A] rounded-md">
              <span className="text-xs text-white/50 font-mono truncate">
                cubico.dev/templates/{template.industry.toLowerCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/order?template=${template.key}`}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white text-xs font-body font-semibold rounded-lg transition-colors"
            >
              Use This Template
              <ArrowRight size={12} />
            </Link>
            <a
              href={template.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-white/60 hover:text-white border border-white/10 rounded-md transition-colors"
            >
              <ExternalLink size={11} />
              Open
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="relative" style={{ height: 'calc(100% - 44px)' }}>
          <iframe
            src={template.file}
            title={`${template.name} template preview`}
            className="w-full h-full border-0"
            loading="lazy"
          />
          {/* Sticky bottom CTA bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex items-center justify-center">
            <Link
              href={`/order?template=${template.key}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-semibold rounded-xl transition-all hover:scale-[1.02] text-sm shadow-lg shadow-[#FF6B4A]/25"
            >
              Use This Template — Get Your Website
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE SWIPE CARDS
   ═══════════════════════════════════════════════════════════════════ */

function MobileCards({ onPreview }: { onPreview: (t: Template) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.offsetWidth));
  }, []);

  return (
    <div className="lg:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto gap-4 -mx-5 px-5 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {TEMPLATES.map((t, i) => (
          <button
            key={i}
            onClick={() => onPreview(t)}
            className="snap-center flex-shrink-0 w-[80vw] max-w-[300px] rounded-xl overflow-hidden border border-white/10 text-left transition-all active:scale-[0.98]"
          >
            <div
              className="aspect-[4/3] flex items-end p-5"
              style={{ background: t.gradient }}
            >
              <div>
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-body font-medium uppercase tracking-wider mb-2"
                  style={{ backgroundColor: t.color + '30', color: t.color }}
                >
                  {t.industry}
                </span>
                <h3 className="font-display font-bold text-white text-lg leading-tight">
                  {t.name}
                </h3>
              </div>
            </div>
            <div className="p-4 bg-[#0F1D32]">
              <p className="text-xs text-surface-400 font-body">{t.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-[#FF6B4A] font-body font-medium mt-2">
                Preview Template
                <ExternalLink size={10} />
              </span>
            </div>
          </button>
        ))}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {TEMPLATES.map((_, i) => (
          <button
            key={i}
            onClick={() =>
              scrollRef.current?.scrollTo({
                left: i * (scrollRef.current?.offsetWidth ?? 0),
                behavior: 'smooth',
              })
            }
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? 'bg-[#FF6B4A] w-4' : 'bg-white/15 w-1.5'
            }`}
            aria-label={`Template ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function TemplatePreview() {
  const [preview, setPreview] = useState<Template | null>(null);

  return (
    <section className="relative py-20 sm:py-28 bg-surface-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            Pick a Template. Any Template.
          </h2>
          <p className="text-surface-500 font-body text-base sm:text-lg max-w-lg mx-auto">
            Every industry. Every style. Click to preview live.
          </p>
        </motion.div>

        {/* Desktop: 3x2 grid */}
        <div className="hidden lg:grid grid-cols-3 gap-5">
          {TEMPLATES.map((t, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onClick={() => setPreview(t)}
              className="group relative rounded-xl overflow-hidden border border-white/10 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/20"
            >
              {/* Gradient card top */}
              <div
                className="aspect-[16/10] flex items-end p-6 relative overflow-hidden"
                style={{ background: t.gradient }}
              >
                {/* Hover shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" style={{ transition: 'transform 0.8s ease, opacity 0.3s' }} />
                <div className="relative">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded text-[10px] font-body font-medium uppercase tracking-wider mb-2"
                    style={{ backgroundColor: t.color + '30', color: t.color }}
                  >
                    {t.industry}
                  </span>
                  <h3 className="font-display font-bold text-white text-xl leading-tight">
                    {t.name}
                  </h3>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-5 py-4 bg-[#0F1D32] flex items-center justify-between">
                <p className="text-xs text-surface-400 font-body">
                  {t.description}
                </p>
                <span className="flex-shrink-0 ml-3 flex items-center gap-1 text-xs text-[#FF6B4A] font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Preview
                  <ExternalLink size={10} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mobile: swipe cards */}
        <MobileCards onPreview={setPreview} />
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <PreviewModal template={preview} onClose={() => setPreview(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
