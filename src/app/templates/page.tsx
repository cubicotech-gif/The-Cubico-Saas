import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TemplatesBrowser from '@/components/TemplatesBrowser';
import { getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Template Library — Cubico Technologies',
  description:
    'Browse our complete library of website templates. Every industry, every style. Click any template for a live preview, then start your project in minutes.',
};

export default async function TemplatesPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <TemplatesBrowser />
      <Footer settings={settings} />
    </>
  );
}
