import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TemplatesBrowser from '@/components/TemplatesBrowser';
import { getSiteSettings } from '@/lib/data';
import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale, type Locale } from '@/i18n/config';

export const revalidate = 60;

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale as Locale);
  return {
    title: dict.templates.metaTitle,
    description: dict.templates.metaDescription,
  };
}

export default async function TemplatesPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <TemplatesBrowser />
      <Footer settings={settings} />
    </>
  );
}
