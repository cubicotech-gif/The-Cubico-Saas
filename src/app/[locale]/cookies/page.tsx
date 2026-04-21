import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPage from '@/components/LegalPage';
import { getSiteSettings } from '@/lib/data';
import { isLocale, type Locale } from '@/i18n/config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Cookie Policy — Cubico',
  description: 'How Cubico uses cookies and similar technologies.',
};

interface Props {
  params: { locale: string };
}

const LAST_UPDATED = 'April 21, 2026';

export default async function CookiePolicyPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const settings = await getSiteSettings();

  return (
    <LegalPage
      locale={locale}
      settings={settings}
      title="Cookie Policy"
      lastUpdated={LAST_UPDATED}
    >
      <p>
        This Cookie Policy explains how <strong>Cubico Technologies</strong> uses cookies
        and similar technologies on our website. It should be read together with our{' '}
        <a href={`/${locale}/privacy`}>Privacy Policy</a>.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that a website stores on your device when you visit.
        They are widely used to make websites work, make them work more efficiently, and
        provide analytics and personalization.
      </p>

      <h2>2. Categories of Cookies We Use</h2>
      <h3>Strictly necessary</h3>
      <ul>
        <li>
          <strong>Authentication session</strong> — set by Supabase after you log in so we
          know it&apos;s you on subsequent requests.
        </li>
        <li>
          <strong>Locale preference</strong> (<code>cubico_locale</code>) — remembers the
          language you chose.
        </li>
        <li>
          <strong>CSRF / security tokens</strong> — used to prevent cross-site request
          forgery on authenticated actions.
        </li>
      </ul>
      <h3>Functional</h3>
      <ul>
        <li>
          <strong>Country detection cache</strong> (<code>cubico_country</code>, stored in
          session storage, not a cookie) — avoids re-running IP geolocation on every page
          view to pick currency and language.
        </li>
        <li>
          <strong>Order draft</strong> (local storage) — saves progress in the order flow
          if you are redirected to sign in.
        </li>
      </ul>
      <h3>Analytics</h3>
      <p>
        We may use privacy-respecting analytics to understand how the Services are used
        (e.g. page views, aggregate device type). If we introduce third-party analytics
        that require consent, we will present a consent banner before loading them.
      </p>
      <h3>Advertising</h3>
      <p>We do not currently use advertising cookies.</p>

      <h2>3. Third-Party Cookies</h2>
      <p>
        When you pay through PayPal, PayPal may set its own cookies as part of the checkout
        popup. Those cookies are controlled by PayPal and are subject to PayPal&apos;s
        privacy policy.
      </p>

      <h2>4. How to Manage Cookies</h2>
      <p>
        Most browsers let you control cookies through their settings (block, delete, or
        warn before storing cookies). Blocking strictly necessary cookies may break parts
        of the Services (for example, you may not stay logged in). Helpful guides:
      </p>
      <ul>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
            target="_blank"
            rel="noopener noreferrer"
          >
            Edge
          </a>
        </li>
      </ul>

      <h2>5. Do Not Track</h2>
      <p>
        We honor signals that indicate a privacy preference where technically feasible.
        Because there is no consistent industry standard for interpreting &quot;Do Not
        Track&quot;, our behavior may vary over time.
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. The &quot;Last updated&quot;
        date above will reflect the most recent change.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions? Email{' '}
        <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
      </p>
    </LegalPage>
  );
}
