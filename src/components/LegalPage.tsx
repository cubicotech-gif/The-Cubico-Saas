import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { SiteSettings } from '@/lib/types';

interface Props {
  locale: string;
  settings: SiteSettings;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPage({ locale, settings, title, lastUpdated, children }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-950 pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors font-body mb-8"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>

          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-3">
            {title}
          </h1>
          <p className="text-sm text-surface-500 font-body mb-10">
            Last updated: {lastUpdated}
          </p>

          <article className="legal-prose font-body text-surface-300 space-y-6 leading-relaxed">
            {children}
          </article>

          <div className="mt-14 pt-6 border-t border-white/5 text-sm text-surface-500 font-body">
            Questions about this document? Email us at{' '}
            <a
              href={`mailto:${settings.contact_email}`}
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              {settings.contact_email}
            </a>
            .
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
