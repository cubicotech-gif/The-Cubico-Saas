'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import {
  locales,
  localeLabels,
  localeShort,
  isLocale,
  type Locale,
} from '@/i18n/config';

/**
 * Small language picker for the navbar. Keeps the user on the same page
 * but swaps the first path segment. Stores the choice in a cookie so
 * the middleware respects it on their next visit.
 */
export default function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchTo(target: Locale) {
    // Persist so middleware respects it next visit too.
    document.cookie = `cubico_locale=${target}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // Swap the first path segment.
    const parts = (pathname ?? '/').split('/');
    const firstSegment = parts[1] ?? '';
    if (isLocale(firstSegment)) {
      parts[1] = target;
    } else {
      parts.splice(1, 0, target);
    }
    const nextPath = parts.join('/') || `/${target}`;
    setOpen(false);
    router.push(nextPath);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-body text-surface-300 hover:text-white transition-colors"
        aria-label="Change language"
      >
        <Globe size={13} />
        <span>{localeShort[currentLocale]}</span>
      </button>

      {open && (
        <div className="absolute end-0 top-10 w-40 rounded-xl border border-white/10 bg-[#0F1D32] shadow-xl shadow-black/30 py-1 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-surface-300 hover:text-white hover:bg-white/5 transition-colors font-body text-start"
            >
              <span>{localeLabels[loc]}</span>
              {loc === currentLocale && <Check size={12} className="text-[#FF6B4A]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
