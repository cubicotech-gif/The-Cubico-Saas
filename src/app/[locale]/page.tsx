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
      <main className="h-screen overflow-y-auto snap-y snap-mandatory">
        <Hero settings={settings} />
        <HomeServicesBento services={homeServices} settings={settings} />
        {/* About + Footer share the final snap screen */}
        <section className="h-screen snap-start flex flex-col bg-surface-950">
          <div className="flex-1 flex items-center overflow-hidden">
            <AboutSection settings={settings} />
          </div>
          <Footer settings={settings} />
        </section>
      </main>
    </>
  );
}
