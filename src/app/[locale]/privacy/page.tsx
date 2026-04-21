import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPage from '@/components/LegalPage';
import { getSiteSettings } from '@/lib/data';
import { isLocale, type Locale } from '@/i18n/config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Privacy Policy — Cubico',
  description:
    'How Cubico Technologies collects, uses, and protects your personal information.',
};

interface Props {
  params: { locale: string };
}

const LAST_UPDATED = 'April 21, 2026';

export default async function PrivacyPolicyPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const settings = await getSiteSettings();

  return (
    <LegalPage
      locale={locale}
      settings={settings}
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
    >
      <p>
        This Privacy Policy describes how <strong>Cubico Technologies</strong> (&quot;Cubico&quot;,
        &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, shares, and protects
        information about you when you use our website, client portal, and related services
        (together, the &quot;Services&quot;). By using the Services you agree to this Policy. If
        you do not agree, please do not use the Services.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Account data</strong> — name, email address, and password when you create an
          account.
        </li>
        <li>
          <strong>Order data</strong> — business name, industry, description, template
          preferences, reference URLs, color preferences, preferred language, logo files, and
          contact details you submit through the order form.
        </li>
        <li>
          <strong>Communications</strong> — messages you send via our order chat, email, or
          WhatsApp.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Device and usage data</strong> — IP address, browser type, device type,
          operating system, referring URL, pages visited, and timestamps.
        </li>
        <li>
          <strong>Location (approximate)</strong> — country-level location derived from your IP
          address to show prices in your local currency and the right language.
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> — see our{' '}
          <a href={`/${locale}/cookies`}>Cookie Policy</a>.
        </li>
      </ul>
      <h3>Information from third parties</h3>
      <ul>
        <li>
          <strong>PayPal</strong> — when you pay, PayPal shares the capture ID, payer email,
          payer name, amount, and currency with us. We never see your full card number or CVV.
        </li>
        <li>
          <strong>Supabase</strong> — our database provider passes back your authentication
          status for each request.
        </li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To deliver, maintain, and improve the Services.</li>
        <li>To process orders, deliver websites and related work, and handle payments.</li>
        <li>To communicate with you about your orders, account, and updates.</li>
        <li>
          To detect, prevent, and address security issues, fraud, and technical problems.
        </li>
        <li>
          To comply with legal obligations, enforce our Terms, and defend legal claims.
        </li>
      </ul>

      <h2>3. Legal Bases (GDPR / UK GDPR)</h2>
      <p>
        If you are in the European Economic Area or United Kingdom, we rely on the following
        legal bases: (a) <strong>contract</strong> — to provide the Services you requested; (b){' '}
        <strong>legitimate interests</strong> — to secure, improve, and market our Services;
        (c) <strong>consent</strong> — where required for certain cookies or marketing emails;
        (d) <strong>legal obligation</strong> — to comply with tax, accounting, and other laws.
      </p>

      <h2>4. How We Share Information</h2>
      <p>We share information only as described below:</p>
      <ul>
        <li>
          <strong>Service providers</strong> that help us operate the Services, including
          Supabase (database and authentication), Vercel (hosting), PayPal (payment
          processing), and email providers for transactional messages. These providers are
          bound by contract to use your information only on our instructions.
        </li>
        <li>
          <strong>Legal and safety</strong> — to comply with applicable law, respond to valid
          legal process, protect the rights and safety of Cubico, our users, and the public,
          and enforce our agreements.
        </li>
        <li>
          <strong>Business transfers</strong> — in connection with a merger, acquisition, or
          sale of assets, your information may be transferred, subject to this Policy.
        </li>
      </ul>
      <p>
        <strong>We do not sell your personal information.</strong> We do not share personal
        information with third parties for their own independent marketing purposes.
      </p>

      <h2>5. International Data Transfers</h2>
      <p>
        We operate globally. Your information may be stored and processed in countries other
        than the one in which you live, including the United States, the European Union, and
        Pakistan. Where required by law, we use appropriate safeguards (such as Standard
        Contractual Clauses) for international transfers.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain personal information for as long as needed to provide the Services, comply
        with legal obligations (such as tax record retention), resolve disputes, and enforce
        our agreements. When information is no longer needed, we delete or anonymize it.
      </p>

      <h2>7. Security</h2>
      <p>
        We use reasonable technical and organizational measures designed to protect personal
        information — including encryption in transit (HTTPS/TLS), encrypted storage at our
        infrastructure providers, role-based access controls, and row-level security on our
        database. No method of transmission or storage is 100% secure; we cannot guarantee
        absolute security.
      </p>

      <h2>8. Your Rights</h2>
      <p>Depending on where you live, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you.</li>
        <li>Correct inaccurate or incomplete information.</li>
        <li>Delete your account and associated personal information.</li>
        <li>Export your information in a portable format.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent at any time, where processing is based on consent.</li>
        <li>Lodge a complaint with your local data protection authority.</li>
      </ul>
      <h3>California residents (CCPA / CPRA)</h3>
      <p>
        California residents have the right to know what personal information we collect, the
        right to delete personal information, the right to correct inaccurate information,
        and the right not to be discriminated against for exercising these rights. We do not
        sell or share personal information as those terms are defined by the CCPA.
      </p>
      <p>
        To exercise any right, contact us at{' '}
        <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>. We will
        verify your request and respond within the time required by applicable law.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        The Services are not directed to children under 13 (or the equivalent minimum age in
        your jurisdiction). We do not knowingly collect personal information from children.
        If you believe a child has provided us with personal information, contact us and we
        will delete it.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Policy from time to time. When we do, we will update the &quot;Last
        updated&quot; date above and, if the changes are material, provide a more prominent
        notice. Continued use of the Services after an update constitutes acceptance of the
        revised Policy.
      </p>

      <h2>11. Contact</h2>
      <p>
        For privacy questions or to exercise your rights, email{' '}
        <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
      </p>
    </LegalPage>
  );
}
