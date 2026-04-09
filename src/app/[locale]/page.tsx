import Navbar from '@/components/Navbar';
import HeroWithServices from '@/components/HeroWithServices';
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
        {/* Screen 1: Hero + Services — everything at one glance */}
        <HeroWithServices settings={settings} services={homeServices} />
        {/* Screen 2: About + Footer */}
        <section className="h-screen snap-start flex flex-col bg-[#060d18]">
          <div className="flex-1 flex items-center overflow-hidden">
            <AboutSection settings={settings} />
          </div>
          <Footer settings={settings} />
        </section>
      </main>
    </>
  );
}
