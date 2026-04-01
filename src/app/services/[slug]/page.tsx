import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicePageContent from '@/components/ServicePageContent';
import { getServiceBySlug, getAllServiceSlugs, getSiteSettings } from '@/lib/data';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
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
  const [service, settings] = await Promise.all([
    getServiceBySlug(params.slug),
    getSiteSettings(),
  ]);

  if (!service) notFound();

  return (
    <>
      <Navbar />
      <ServicePageContent
        service={service}
        contactWhatsapp={settings.contact_whatsapp}
      />
      <Footer settings={settings} />
    </>
  );
}
