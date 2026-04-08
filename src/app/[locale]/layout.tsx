import { notFound } from 'next/navigation';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale, locales, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params }: Props) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  const dict = await getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dict={dict}>
      {children}
    </LocaleProvider>
  );
}
