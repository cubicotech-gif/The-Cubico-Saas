import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicePageContent from '@/components/ServicePageContent';
import { getServiceBySlug, getAllServiceSlugs, getSiteSettings } from '@/lib/data';
import { getMediaAssets } from '@/lib/mediaData';
import { locales } from '@/i18n/config';

export const revalidate = 60;

interface Props {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.page_hero_title ?? service.title} — Cubico Technologies`,
    description: service.page_hero_subtitle ?? service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const [service, settings, media] = await Promise.all([
    getServiceBySlug(params.slug),
    getSiteSettings(),
    getMediaAssets(),
  ]);

  if (!service) notFound();

  return (
    <>
      <Navbar />
      <ServicePageContent
        service={service}
        contactWhatsapp={settings.contact_whatsapp}
        media={media}
      />
      <Footer settings={settings} />
    </>
  );
}
