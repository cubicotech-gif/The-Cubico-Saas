import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SolutionsShowcase from '@/components/SolutionsShowcase';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { getSiteSettings, getServices } from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero settings={settings} />
        <SolutionsShowcase services={services} />
        <AboutSection />
      </main>
      <Footer settings={settings} />
    </>
  );
}
