'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { TEMPLATES, type Template } from '@/data/templates';
import TemplateThumb from '@/components/TemplateThumb';
import { useLocale } from '@/i18n/LocaleProvider';

// Re-exports for backwards compatibility with files that still import
// `TEMPLATES` / `Template` from this module.
export { TEMPLATES };
export type { Template };

/* ═══════════════════════════════════════════════════════════════════
   IFRAME PREVIEW MODAL
   ═══════════════════════════════════════════════════════════════════ */

export function PreviewModal({
  template,
  onClose,
}: {
  template: Template;
  onClose: () => void;
}) {
  const { locale, dict } = useLocale();
  // Selected page within the template (Home / About / Services / Contact …)
  const [activePage, setActivePage] = useState(template.pages[0] ?? { label: 'Home', file: template.file });

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
        className="relative w-full max-w-6xl h-[88vh] rounded-2xl overflow-hidden border border-white/10 bg-surface-950 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2D2D2D] border-b border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#ff7b73] transition-colors"
                aria-label={dict.webdev.modalClose}
              />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="hidden sm:flex items-center px-3 py-1 bg-[#4A4A4A] rounded-md min-w-0">
              <span className="text-xs text-white/50 font-mono truncate">
                cubico.dev{activePage.file}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/order?template=${template.key}`}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white text-xs font-body font-semibold rounded-lg transition-colors"
            >
              {dict.webdev.modalUseTemplate}
              <ArrowRight size={12} />
            </Link>
            <a
              href={activePage.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-white/60 hover:text-white border border-white/10 rounded-md transition-colors"
            >
              <ExternalLink size={11} />
              {dict.webdev.modalOpen}
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label={dict.webdev.modalClose}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Page tabs */}
        {template.pages.length > 1 && (
          <div className="flex items-center gap-1 px-3 py-2 bg-[#1a1a1a] border-b border-white/5 overflow-x-auto">
            {template.pages.map((p) => {
              const active = p.file === activePage.file;
              return (
                <button
                  key={p.file}
                  onClick={() => setActivePage(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-body font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        )}

        {/* iframe */}
        <div className="relative flex-1 min-h-0">
          <iframe
            // Re-key on page change so iframe reloads cleanly
            key={activePage.file}
            src={activePage.file}
            title={dict.webdev.modalIframeTitle
              .replace('{name}', template.name)
              .replace('{page}', activePage.label)}
            className="w-full h-full border-0 bg-white"
            loading="lazy"
          />
          {/* Sticky bottom CTA bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex items-center justify-center pointer-events-none">
            <Link
              href={`/${locale}/order?template=${template.key}`}
              className="pointer-events-auto inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-semibold rounded-xl transition-all hover:scale-[1.02] text-sm shadow-lg shadow-[#FF6B4A]/25"
            >
              {dict.webdev.modalStickyCta}
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
  const { locale, dict } = useLocale();
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
        {TEMPLATES.slice(0, 6).map((t) => (
          <button
            key={t.key}
            onClick={() => onPreview(t)}
            className="snap-center flex-shrink-0 w-[80vw] max-w-[300px] rounded-xl overflow-hidden border border-white/10 text-left transition-all active:scale-[0.98]"
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <TemplateThumb template={t} className="absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-body font-medium uppercase tracking-wider mb-2"
                  style={{ backgroundColor: t.color + '30', color: t.color }}
                >
                  {t.industry}
                </span>
                <h3 className="font-display font-bold text-white text-lg leading-tight drop-shadow-lg">
                  {t.name}
                </h3>
              </div>
            </div>
            <div className="p-4 bg-[#0F1D32]">
              <p className="text-xs text-surface-400 font-body line-clamp-1">{t.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-[#FF6B4A] font-body font-medium mt-2">
                {dict.webdev.templatesPreviewMobile}
                <ExternalLink size={10} />
              </span>
            </div>
          </button>
        ))}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {TEMPLATES.slice(0, 6).map((_, i) => (
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
            aria-label={dict.webdev.modalDotAria.replace('{index}', String(i + 1))}
          />
        ))}
      </div>
      <div className="lg:hidden flex justify-center mt-6">
        <Link
          href={`/${locale}/templates`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-xs text-surface-300 hover:text-white font-body font-medium transition-colors"
        >
          {dict.webdev.templatesBrowseAllMobile.replace(
            '{count}',
            String(TEMPLATES.length),
          )}
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function TemplatePreview() {
  const { locale, dict } = useLocale();
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
            {dict.webdev.templatesTitle}
          </h2>
          <p className="text-surface-500 font-body text-base sm:text-lg max-w-lg mx-auto">
            {dict.webdev.templatesSubtitle}
          </p>
        </motion.div>

        {/* Desktop: 3-col grid */}
        <div className="hidden lg:grid grid-cols-3 gap-5">
          {TEMPLATES.slice(0, 6).map((t, i) => (
            <motion.button
              key={t.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => setPreview(t)}
              className="group relative rounded-xl overflow-hidden border border-white/10 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/20"
            >
              {/* Live thumbnail */}
              <div className="aspect-[16/10] relative overflow-hidden">
                <TemplateThumb template={t} className="absolute inset-0" />
                {/* Bottom gradient for text legibility */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
                {/* Hover shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                {/* Text overlay */}
                <div className="absolute bottom-5 left-5 right-5">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded text-[10px] font-body font-medium uppercase tracking-wider mb-2"
                    style={{ backgroundColor: t.color + '30', color: t.color }}
                  >
                    {t.industry}
                  </span>
                  <h3 className="font-display font-bold text-white text-xl leading-tight drop-shadow-lg">
                    {t.name}
                  </h3>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-5 py-4 bg-[#0F1D32] flex items-center justify-between">
                <p className="text-xs text-surface-400 font-body line-clamp-1">
                  {t.description}
                </p>
                <span className="flex-shrink-0 ml-3 flex items-center gap-1 text-xs text-[#FF6B4A] font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {dict.webdev.templatesPreview}
                  <ExternalLink size={10} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* See all link → /templates */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden lg:flex justify-center mt-10"
        >
          <Link
            href={`/${locale}/templates`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-sm text-surface-300 hover:text-white hover:border-white/20 font-body font-medium transition-colors"
          >
            {dict.webdev.templatesBrowseFull.replace(
              '{count}',
              String(TEMPLATES.length),
            )}
            <ArrowRight size={14} />
          </Link>
        </motion.div>

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
