import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { getSiteSettings, getServices } from '@/lib/data';
import type { ServiceCategory } from '@/lib/types';

export const revalidate = 60;

const CATEGORY_ORDER: ServiceCategory[] = [
  'institution',
  'healthcare',
  'individual',
  'creative',
];

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);

  let globalIndex = 0;

  return (
    <>
      <Navbar />
      <main>
        <Hero settings={settings} />

        <section id="services" className="py-20 bg-surface-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-14">
              <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
                Our Services
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                Find the right solution for you
              </h2>
            </div>

            {CATEGORY_ORDER.map((category) => {
              const categoryServices = services.filter(
                (s) => s.category === category
              );
              if (categoryServices.length === 0) return null;
              const start = globalIndex;
              globalIndex += categoryServices.length;
              return (
                <CategorySection
                  key={category}
                  category={category}
                  services={categoryServices}
                  globalIndex={start}
                />
              );
            })}
          </div>
        </section>

        <AboutSection />
      </main>
      <Footer settings={settings} />
    </>
  );
}
