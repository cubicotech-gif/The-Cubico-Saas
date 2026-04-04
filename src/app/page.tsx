import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HomeServicesBento from '@/components/HomeServicesBento';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <main>
        <Hero settings={settings} />
        <HomeServicesBento />
        <AboutSection />
      </main>
      <Footer settings={settings} />
    </>
  );
}
