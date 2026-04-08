import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HomeServicesBento from '@/components/HomeServicesBento';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { getSiteSettings, getHomeServices } from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, homeServices] = await Promise.all([
    getSiteSettings(),
    getHomeServices(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero settings={settings} />
        <HomeServicesBento services={homeServices} settings={settings} />
        <AboutSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
