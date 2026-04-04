import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
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
              Websites, portals, CRMs, and marketing — engineered for businesses
              worldwide.
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs text-surface-500 font-body uppercase tracking-widest mb-3">
              Services
            </p>
            <ul className="space-y-2 text-sm font-body text-surface-400">
              <li>
                <Link
                  href="/services/website-development"
                  className="hover:text-white transition-colors"
                >
                  Website Development
                </Link>
              </li>
              <li>
                <Link
                  href="/services/client-portals"
                  className="hover:text-white transition-colors"
                >
                  Client Portals
                </Link>
              </li>
              <li>
                <Link
                  href="/services/crm-systems"
                  className="hover:text-white transition-colors"
                >
                  CRM Systems
                </Link>
              </li>
              <li>
                <Link
                  href="/services/digital-marketing"
                  className="hover:text-white transition-colors"
                >
                  Digital Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs text-surface-500 font-body uppercase tracking-widest mb-3">
              Contact
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
                  WhatsApp
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 pt-6 text-center text-xs text-surface-600 font-body">
          {settings.footer_text}
        </div>
      </div>
    </footer>
  );
}
