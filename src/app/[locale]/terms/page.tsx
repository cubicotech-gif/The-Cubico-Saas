import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPage from '@/components/LegalPage';
import { getSiteSettings } from '@/lib/data';
import { isLocale, type Locale } from '@/i18n/config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Terms of Service — Cubico',
  description: 'The rules that govern your use of Cubico Technologies services.',
};

interface Props {
  params: { locale: string };
}

const LAST_UPDATED = 'April 21, 2026';

export default async function TermsPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const settings = await getSiteSettings();

  return (
    <LegalPage
      locale={locale}
      settings={settings}
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
    >
      <p>
        These Terms of Service (&quot;Terms&quot;) are a binding agreement between you and{' '}
        <strong>Cubico Technologies</strong> (&quot;Cubico&quot;, &quot;we&quot;, &quot;our&quot;,
        or &quot;us&quot;). By accessing or using our website, ordering a project, or using
        any part of our services (together, the &quot;Services&quot;), you agree to these
        Terms and to our <a href={`/${locale}/privacy`}>Privacy Policy</a>. If you do not
        agree, do not use the Services.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old (or the age of legal majority in your jurisdiction)
        and legally capable of entering into a contract to use the Services. By using the
        Services, you represent that you meet these requirements.
      </p>

      <h2>2. Accounts</h2>
      <p>
        When you create an account, you agree to provide accurate, current, and complete
        information and to keep it updated. You are responsible for safeguarding your
        credentials and for all activity under your account. Notify us immediately at{' '}
        <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a> if you
        suspect unauthorized access.
      </p>

      <h2>3. Services</h2>
      <p>
        Cubico provides website development, client portals, CRM systems, digital marketing,
        and related digital services, as described on our website and in your individual
        order. Specific deliverables, timelines, and responsibilities are defined in the
        order you place.
      </p>

      <h2>4. Orders, Pricing, and Payments</h2>
      <ul>
        <li>
          <strong>Orders.</strong> You place an order by completing the order flow and
          selecting a plan. The order becomes binding when we confirm it and you complete
          payment (or the applicable deposit).
        </li>
        <li>
          <strong>Pricing.</strong> Prices are shown on the website and in your order.
          Pricing may be displayed in USD or PKR based on your detected location. We reserve
          the right to change prices for future orders; changes do not affect orders already
          placed.
        </li>
        <li>
          <strong>Payment.</strong> Payments are processed by PayPal. By paying, you accept
          PayPal&apos;s terms. Recurring monthly fees (for plans that include them) are
          billed in advance.
        </li>
        <li>
          <strong>Taxes.</strong> Prices are exclusive of taxes unless stated. You are
          responsible for any applicable taxes, duties, or withholdings.
        </li>
        <li>
          <strong>Late payment.</strong> If a payment is more than 14 days overdue, we may
          suspend work, remove deliverables, and/or charge a reasonable late fee, in
          addition to any other remedies.
        </li>
      </ul>

      <h2>5. Your Content and Responsibilities</h2>
      <p>
        You retain ownership of content you provide (logos, text, images, brand materials,
        etc. — &quot;Client Content&quot;). You grant us a worldwide, non-exclusive,
        royalty-free license to use, copy, modify, and display Client Content solely to
        perform the Services. You represent and warrant that:
      </p>
      <ul>
        <li>You own or have the rights to provide us with Client Content.</li>
        <li>
          Client Content does not infringe any third-party rights and complies with all
          applicable laws.
        </li>
        <li>
          Your business and any content you submit comply with our{' '}
          <a href={`/${locale}/acceptable-use`}>Acceptable Use Policy</a>.
        </li>
      </ul>

      <h2>6. Deliverables and Intellectual Property</h2>
      <p>
        Upon full payment for a project, we assign to you ownership of the final, custom
        deliverables specifically created for you under the order (the &quot;Deliverables&quot;),
        excluding:
      </p>
      <ul>
        <li>
          <strong>Pre-existing materials</strong> — tools, templates, libraries, frameworks,
          code snippets, and know-how we owned or developed before or outside your project.
          We grant you a worldwide, perpetual, non-exclusive, royalty-free license to use
          these solely as integrated into the Deliverables.
        </li>
        <li>
          <strong>Third-party materials</strong> — software, fonts, images, or services
          licensed from third parties, which remain subject to their own license terms.
        </li>
      </ul>
      <p>
        Until full payment is received, all Deliverables remain our property. We may use a
        non-confidential description of the work, screenshots, and your public logo to
        promote our Services (portfolio and case studies). Tell us in writing if you want to
        opt out.
      </p>

      <h2>7. Cancellation, Refunds, and Chargebacks</h2>
      <p>
        Cancellations and refunds are governed by our{' '}
        <a href={`/${locale}/refund`}>Refund Policy</a>. If you have a billing concern,
        please contact us first — initiating a chargeback without giving us a chance to
        resolve the issue may result in immediate suspension of your account and
        Deliverables.
      </p>

      <h2>8. Acceptable Use</h2>
      <p>
        Your use of the Services is subject to our{' '}
        <a href={`/${locale}/acceptable-use`}>Acceptable Use Policy</a>. Violations may
        result in suspension or termination of the Services and deletion of Deliverables,
        without refund.
      </p>

      <h2>9. Confidentiality</h2>
      <p>
        Each party agrees to protect the other&apos;s non-public business information it
        receives in the course of the engagement with the same care it uses for its own, and
        to use it only to perform or receive the Services. This obligation survives
        termination.
      </p>

      <h2>10. Warranties and Disclaimers</h2>
      <p>
        We will perform the Services in a professional and workmanlike manner. Except as
        expressly stated in these Terms or your order,{' '}
        <strong>
          the Services and Deliverables are provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;,
          without warranties of any kind, whether express, implied, or statutory
        </strong>
        , including the implied warranties of merchantability, fitness for a particular
        purpose, non-infringement, and any warranties arising out of course of dealing or
        usage of trade. We do not warrant that the Services will be uninterrupted,
        error-free, or free of harmful components, or that results will meet your specific
        expectations.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law:
      </p>
      <ul>
        <li>
          <strong>
            In no event will Cubico be liable for indirect, incidental, special,
            consequential, exemplary, or punitive damages
          </strong>
          , including lost profits, lost data, lost goodwill, business interruption, or
          costs of substitute services, arising out of or related to the Services, even if
          advised of the possibility of such damages.
        </li>
        <li>
          <strong>
            Our total aggregate liability to you for any claim arising out of or related to
            these Terms or the Services will not exceed the amount you paid us for the
            specific Service giving rise to the claim in the twelve (12) months preceding
            the event
          </strong>
          . If you have paid nothing, our total liability is limited to USD 50.
        </li>
      </ul>
      <p>
        Some jurisdictions do not allow the exclusion or limitation of certain damages, so
        some of these limitations may not apply to you.
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You will defend, indemnify, and hold harmless Cubico and its officers, employees,
        and agents from and against any third-party claims, losses, liabilities, damages,
        costs, and expenses (including reasonable attorneys&apos; fees) arising out of or
        related to (a) your use of the Services in breach of these Terms, (b) Client Content,
        or (c) your violation of applicable law or third-party rights.
      </p>

      <h2>13. Termination</h2>
      <p>
        You may close your account at any time by contacting us. We may suspend or terminate
        your access immediately if you breach these Terms, if required by law, or if we
        reasonably believe your use creates risk or potential liability for Cubico or other
        users. Provisions that by their nature should survive termination (payment
        obligations, IP ownership, confidentiality, warranties, limitation of liability,
        indemnification, and dispute resolution) survive termination.
      </p>

      <h2>14. Dispute Resolution and Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, United States, without
        regard to conflict-of-law rules. You and Cubico agree that any dispute arising out
        of or related to these Terms or the Services will be resolved exclusively in the
        state or federal courts located in Delaware, and each party consents to personal
        jurisdiction and venue there. Nothing prevents either party from seeking injunctive
        relief in any court of competent jurisdiction to protect its intellectual property
        or confidential information.
      </p>

      <h2>15. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we will update the
        &quot;Last updated&quot; date above and, if the changes are material, notify you.
        Continued use of the Services after an update constitutes acceptance of the revised
        Terms.
      </p>

      <h2>16. Miscellaneous</h2>
      <ul>
        <li>
          <strong>Entire agreement.</strong> These Terms, your order, the Privacy Policy, and
          referenced policies are the entire agreement between you and Cubico regarding the
          Services.
        </li>
        <li>
          <strong>Severability.</strong> If any provision is unenforceable, the rest remain
          in effect.
        </li>
        <li>
          <strong>No waiver.</strong> Our failure to enforce a provision is not a waiver of
          the right to enforce it later.
        </li>
        <li>
          <strong>Assignment.</strong> You may not assign these Terms without our written
          consent. We may assign them to an affiliate or in connection with a merger or
          sale.
        </li>
        <li>
          <strong>Notices.</strong> We may send notices to the email address associated with
          your account. Notices to us must be sent to{' '}
          <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
        </li>
      </ul>
    </LegalPage>
  );
}
