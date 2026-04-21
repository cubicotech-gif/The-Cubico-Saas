import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPage from '@/components/LegalPage';
import { getSiteSettings } from '@/lib/data';
import { isLocale, type Locale } from '@/i18n/config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Refund Policy — Cubico',
  description: 'When and how refunds are provided for Cubico services.',
};

interface Props {
  params: { locale: string };
}

const LAST_UPDATED = 'April 21, 2026';

export default async function RefundPolicyPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const settings = await getSiteSettings();

  return (
    <LegalPage
      locale={locale}
      settings={settings}
      title="Refund Policy"
      lastUpdated={LAST_UPDATED}
    >
      <p>
        We want you to be happy with the work. This policy explains when and how refunds are
        available for services provided by <strong>Cubico Technologies</strong>. By placing
        an order you agree to this policy and to our{' '}
        <a href={`/${locale}/terms`}>Terms of Service</a>.
      </p>

      <h2>1. One-Time Development Fees</h2>
      <p>
        One-time development fees (Starter, Growth, Professional, and any e-commerce
        add-ons) are refundable on a sliding scale based on how far the project has
        progressed:
      </p>
      <ul>
        <li>
          <strong>Before work begins — 100% refund.</strong> If you cancel within 48 hours
          of placing the order <em>and</em> before we assign a developer to the project, we
          refund the full amount.
        </li>
        <li>
          <strong>Discovery &amp; planning complete — up to 50% refund.</strong> If we have
          confirmed requirements, set up tooling, or started wireframes, up to 50% of the
          fee is refundable at our discretion, based on hours already invested.
        </li>
        <li>
          <strong>Design or development in progress — no refund.</strong> Once design or
          coding work is underway, the fee is non-refundable. We will still deliver the work
          completed to date.
        </li>
        <li>
          <strong>After delivery — no refund.</strong> Once the Deliverables have been
          handed over, the fee is non-refundable. Post-delivery adjustments covered by your
          plan&apos;s free-adjustment window will be honored separately.
        </li>
      </ul>

      <h2>2. Recurring Monthly Fees</h2>
      <ul>
        <li>
          Monthly fees are billed in advance for the coming month.
        </li>
        <li>
          You may cancel a monthly plan at any time by emailing us at{' '}
          <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>. Your
          plan will remain active until the end of the current paid month.
        </li>
        <li>
          <strong>We do not provide partial refunds</strong> for unused days within a paid
          month.
        </li>
      </ul>

      <h2>3. Add-Ons and Third-Party Costs</h2>
      <p>
        Third-party costs paid through us on your behalf — including domain registrations,
        premium templates, stock media, paid plugins, third-party SaaS subscriptions, and
        advertising spend — are <strong>non-refundable</strong> once purchased from the
        vendor.
      </p>

      <h2>4. Circumstances That Are Not Eligible for Refunds</h2>
      <ul>
        <li>
          Changes to your business plan, branding, or strategy after work has begun.
        </li>
        <li>
          Failure to provide required content, approvals, or feedback within a reasonable
          time (we will remind you in writing before considering a project stalled).
        </li>
        <li>
          Issues caused by external services, vendors, hosting outside our infrastructure,
          or third-party integrations.
        </li>
        <li>
          Incompatibility with hardware, browsers, or software we did not commit to support
          in the order.
        </li>
        <li>Violation of our Terms or Acceptable Use Policy.</li>
      </ul>

      <h2>5. How to Request a Refund</h2>
      <p>Email us at{' '}
        <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>{' '}
        with:
      </p>
      <ul>
        <li>The order reference or email used at checkout.</li>
        <li>A short description of the reason for the refund request.</li>
        <li>Any supporting information that helps us evaluate the request.</li>
      </ul>
      <p>
        We aim to respond within 3 business days and resolve every request within 14
        business days. Approved refunds are issued to the original payment method
        (typically PayPal). Depending on your bank, funds may take an additional 5–10
        business days to appear.
      </p>

      <h2>6. Chargebacks</h2>
      <p>
        If you have a billing concern, please contact us <strong>before</strong> filing a
        chargeback with PayPal or your card issuer. Chargebacks filed without first giving
        us an opportunity to resolve the issue may result in:
      </p>
      <ul>
        <li>Immediate suspension of your account and services.</li>
        <li>Removal of Deliverables until the dispute is resolved.</li>
        <li>
          Recovery of chargeback fees, administrative costs, and any amounts still owed to
          us.
        </li>
      </ul>

      <h2>7. Goodwill Exceptions</h2>
      <p>
        This policy sets our standard terms. We may, at our sole discretion, grant refunds
        or credits outside this policy as a goodwill gesture. Doing so in one case does not
        obligate us to do so in others.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes take effect when posted on
        this page. Orders placed before a change remain governed by the policy in effect at
        the time of order.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this policy? Email{' '}
        <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
      </p>
    </LegalPage>
  );
}
