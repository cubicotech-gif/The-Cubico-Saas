import 'server-only';
import type { Locale } from './config';

/**
 * Server-side dictionary loader. Bundle each locale lazily so we don't ship
 * every language to every visitor.
 */
const loaders = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  ur: () => import('./dictionaries/ur.json').then((m) => m.default),
  ar: () => import('./dictionaries/ar.json').then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof loaders)['en']>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = loaders[locale] ?? loaders.en;
  return load();
}
