/**
 * Central i18n configuration.
 *
 * Adding a new locale:
 *   1. Add the code here + update `dir`/`label` maps.
 *   2. Create `src/i18n/dictionaries/<code>.json`.
 *   3. Register the loader in `get-dictionary.ts`.
 *   4. Update the country → locale map in the middleware.
 */

export const locales = ['en', 'ur', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Human-readable label shown in the switcher. */
export const localeLabels: Record<Locale, string> = {
  en: 'English',
  ur: 'اردو (Roman)',
  ar: 'العربية',
};

/** A short flag/label used in the compact switcher button. */
export const localeShort: Record<Locale, string> = {
  en: 'EN',
  ur: 'UR',
  ar: 'AR',
};

/** Text direction per locale. */
export const localeDir: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ur: 'ltr', // Roman Urdu uses Latin characters, so LTR
  ar: 'rtl',
};

/**
 * Country → locale map used by middleware to pick a default on first visit.
 * Anything not listed falls through to `defaultLocale`.
 */
export const countryLocaleMap: Record<string, Locale> = {
  PK: 'ur',
  SA: 'ar',
  AE: 'ar',
  QA: 'ar',
  BH: 'ar',
  KW: 'ar',
  OM: 'ar',
  JO: 'ar',
  EG: 'ar',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
