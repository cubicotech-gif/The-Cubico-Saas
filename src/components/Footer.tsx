'use client';

import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';
import { useLocale } from '@/i18n/LocaleProvider';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const { locale, dict } = useLocale();
  const p = (path: string) => `/${locale}${path}`;

  return (
    <footer className="bg-surface-950 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="text-xl font-display font-bold text-white mb-2">
              cubico<span className="text-brand-400">.</span>
            </p>
            <p className="text-sm text-surface-500 font-body leading-relaxed">
              {dict.footer.brandDesc}
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs text-surface-500 font-body uppercase tracking-widest mb-3">
              {dict.footer.servicesHeader}
            </p>
            <ul className="space-y-2 text-sm font-body text-surface-400">
              <li>
                <Link
                  href={p('/services/website-development')}
                  className="hover:text-white transition-colors"
                >
                  {dict.footer.linkWebsiteDev}
                </Link>
              </li>
              <li>
                <Link
                  href={p('/services/client-portals')}
                  className="hover:text-white transition-colors"
                >
                  {dict.footer.linkClientPortals}
                </Link>
              </li>
              <li>
                <Link
                  href={p('/services/crm-systems')}
                  className="hover:text-white transition-colors"
                >
                  {dict.footer.linkCrmSystems}
                </Link>
              </li>
              <li>
                <Link
                  href={p('/services/digital-marketing')}
                  className="hover:text-white transition-colors"
                >
                  {dict.footer.linkDigitalMarketing}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs text-surface-500 font-body uppercase tracking-widest mb-3">
              {dict.footer.contactHeader}
            </p>
            <ul className="space-y-2 text-sm font-body text-surface-400">
              <li>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.contact_email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {dict.footer.whatsapp}
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  {dict.footer.adminPanel}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 pt-6 text-center text-xs text-surface-600 font-body">
          {dict.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
        </div>
      </div>
    </footer>
  );
}
