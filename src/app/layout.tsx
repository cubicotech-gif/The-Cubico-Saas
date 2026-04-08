import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { defaultLocale, isLocale, localeDir, type Locale } from '@/i18n/config';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cubico Technologies — Enterprise Software',
  description:
    'Cubico Technologies delivers enterprise-grade software for institutions, healthcare providers, and growing businesses.',
  keywords: [
    'school management system',
    'hospital management system',
    'EHR',
    'LMS',
    'Karachi',
    'Pakistan',
    'Saudi Arabia',
    'SaaS',
  ],
  openGraph: {
    title: 'Cubico Technologies',
    description:
      'Enterprise software for institutions, healthcare, and businesses.',
    type: 'website',
  },
};

/**
 * Resolve the current request's locale on the server using the `x-pathname`
 * header that the middleware injects. Falls back to the default locale for
 * non-localized routes (dashboard, admin, auth).
 */
function resolveLocale(): Locale {
  const h = headers();
  const pathname = h.get('x-pathname') ?? '';
  const first = pathname.split('/')[1] ?? '';
  return isLocale(first) ? first : defaultLocale;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = resolveLocale();
  const dir = localeDir[locale];

  return (
    <html lang={locale} dir={dir}>
      <body className={locale === 'ar' ? 'font-arabic' : undefined}>
        {children}
      </body>
    </html>
  );
}
