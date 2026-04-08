'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  type Template,
  type TemplateCategory,
} from '@/data/templates';
import TemplateThumb from '@/components/TemplateThumb';
import { PreviewModal } from '@/components/TemplatePreview';
import { useLocale } from '@/i18n/LocaleProvider';

type SortKey = 'featured' | 'az' | 'category';

export default function TemplatesBrowser() {
  const { locale, dict } = useLocale();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<TemplateCategory | 'All'>('All');
  const [sort, setSort] = useState<SortKey>('featured');
  const [preview, setPreview] = useState<Template | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = TEMPLATES.filter((t) => {
      if (activeCat !== 'All' && t.category !== activeCat) return false;
      if (!q) return true;
      const haystack = [
        t.name,
        t.industry,
        t.category,
        t.description,
        ...t.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    if (sort === 'az') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'category') {
      list = [...list].sort((a, b) => a.category.localeCompare(b.category));
    }
    return list;
  }, [query, activeCat, sort]);

  return (
    <div className="min-h-screen bg-surface-950">
      {/* ── Header ── */}
      <section className="relative pt-28 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6B4A]/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 text-[#FF6B4A] text-xs font-body font-semibold mb-5">
              <Sparkles size={12} />
              {dict.templates.badge.replace('{count}', String(TEMPLATES.length))}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight mb-4">
              {dict.templates.heroTitle}
            </h1>
            <p className="text-surface-400 font-body text-lg max-w-2xl mx-auto leading-relaxed">
              {dict.templates.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="sticky top-16 z-30 bg-surface-950/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4">
          {/* Search row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.templates.searchPlaceholder}
                className="w-full pl-11 pr-10 py-3 bg-surface-900 border border-white/10 rounded-xl text-sm text-white font-body placeholder:text-surface-600 focus:outline-none focus:border-[#FF6B4A]/40 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label={dict.templates.searchClearAria}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-surface-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="hidden sm:block px-4 py-3 bg-surface-900 border border-white/10 rounded-xl text-sm text-white font-body focus:outline-none focus:border-[#FF6B4A]/40 cursor-pointer"
            >
              <option value="featured">{dict.templates.sortFeatured}</option>
              <option value="az">{dict.templates.sortAz}</option>
              <option value="category">{dict.templates.sortCategory}</option>
            </select>
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 overflow-x-auto -mx-2 px-2 pb-1">
            {(['All', ...TEMPLATE_CATEGORIES] as const).map((c) => {
              const active = activeCat === c;
              const count =
                c === 'All'
                  ? TEMPLATES.length
                  : TEMPLATES.filter((t) => t.category === c).length;
              const label = c === 'All' ? dict.templates.filterAll : c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCat(c as TemplateCategory | 'All')}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-body font-medium border transition-all ${
                    active
                      ? 'bg-[#FF6B4A] text-white border-[#FF6B4A]'
                      : 'bg-surface-900 text-surface-300 border-white/10 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {label}
                  <span
                    className={`text-[10px] font-semibold ${
                      active ? 'text-white/80' : 'text-surface-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-surface-400 font-body text-lg mb-2">
              {dict.templates.emptyTitle.replace('{query}', query)}
            </p>
            <button
              onClick={() => {
                setQuery('');
                setActiveCat('All');
              }}
              className="text-[#FF6B4A] font-body text-sm hover:underline"
            >
              {dict.templates.emptyClear}
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((t, i) => (
              <motion.button
                key={t.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                onClick={() => setPreview(t)}
                className="group relative rounded-xl overflow-hidden border border-white/10 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <TemplateThumb template={t} className="absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[10px] font-body font-semibold uppercase tracking-wider mb-1.5"
                      style={{ backgroundColor: t.color + '30', color: t.color }}
                    >
                      {t.industry}
                    </span>
                    <h3 className="font-display font-bold text-white text-lg leading-tight drop-shadow-lg">
                      {t.name}
                    </h3>
                  </div>
                </div>
                <div className="px-4 py-3 bg-[#0F1D32] border-t border-white/5 flex items-center justify-between gap-2">
                  <p className="text-xs text-surface-400 font-body line-clamp-1">
                    {t.description}
                  </p>
                  <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] text-[#FF6B4A] font-body font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {dict.templates.cardPreview}
                    <ExternalLink size={10} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Footer hint */}
        <div className="mt-14 text-center">
          <p className="text-sm text-surface-500 font-body mb-3">
            {dict.templates.footerHintQuestion}
          </p>
          <Link
            href={`/${locale}/order`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-semibold rounded-xl transition-all hover:scale-[1.02] text-sm shadow-lg shadow-[#FF6B4A]/25"
          >
            {dict.templates.footerHintCta}
          </Link>
        </div>
      </section>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <PreviewModal template={preview} onClose={() => setPreview(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
