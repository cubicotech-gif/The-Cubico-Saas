import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalPage from '@/components/LegalPage';
import { getSiteSettings } from '@/lib/data';
import { isLocale, type Locale } from '@/i18n/config';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Acceptable Use Policy — Cubico',
  description:
    'What you may and may not do when using Cubico Technologies services and Deliverables.',
};

interface Props {
  params: { locale: string };
}

const LAST_UPDATED = 'April 21, 2026';

export default async function AcceptableUsePage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const settings = await getSiteSettings();

  return (
    <LegalPage
      locale={locale}
      settings={settings}
      title="Acceptable Use Policy"
      lastUpdated={LAST_UPDATED}
    >
      <p>
        This Acceptable Use Policy (&quot;AUP&quot;) applies to everyone who uses the
        Services provided by <strong>Cubico Technologies</strong>, including anyone whose
        website, portal, or system we host or build. It is part of our{' '}
        <a href={`/${locale}/terms`}>Terms of Service</a>.
      </p>

      <h2>1. Prohibited Activities</h2>
      <p>You may not use the Services, or allow anyone else to use them, to:</p>
      <ul>
        <li>Violate any applicable law, regulation, or third-party right.</li>
        <li>
          Send spam, unsolicited marketing, phishing messages, or any kind of bulk messaging
          without proper consent and opt-out mechanisms.
        </li>
        <li>
          Transmit viruses, worms, ransomware, or any other malicious or destructive code.
        </li>
        <li>
          Attempt to gain unauthorized access to our systems, our customers&apos; systems,
          or any third-party systems (including probing, scanning, or penetration testing
          without written authorization).
        </li>
        <li>
          Interfere with or disrupt the integrity or performance of the Services, including
          denial-of-service attacks, resource exhaustion, or abuse of rate limits.
        </li>
        <li>
          Reverse engineer, decompile, or attempt to extract source code of our
          non-customer-facing software, except where expressly permitted by law.
        </li>
        <li>
          Resell, sublicense, or make the Services available to third parties as a
          standalone offering, except as expressly permitted in your order.
        </li>
        <li>
          Use the Services to train any AI model, index our content, or build a competing
          service, except with prior written consent.
        </li>
      </ul>

      <h2>2. Prohibited Content</h2>
      <p>
        You may not use the Services to host, distribute, or promote content that is:
      </p>
      <ul>
        <li>Illegal, including child sexual abuse material, human trafficking, or the sale of illegal drugs, weapons, or endangered species.</li>
        <li>
          Defamatory, harassing, threatening, or hateful, including content that incites
          violence against individuals or groups based on race, ethnicity, nationality,
          religion, gender, sexual orientation, disability, or other protected
          characteristics.
        </li>
        <li>
          Invasive of another&apos;s privacy, including doxxing or sharing sexual imagery of
          any person without their express consent.
        </li>
        <li>
          Infringing on intellectual property rights, including pirated software, music,
          video, or counterfeit goods.
        </li>
        <li>
          Used to operate gambling, adult-only, cryptocurrency/token-launch, MLM, or
          high-risk financial services without our prior written approval and evidence of
          the necessary licenses.
        </li>
        <li>
          Deceptive — including impersonation, misleading advertising, fake reviews, or
          manipulated content presented as authentic.
        </li>
      </ul>

      <h2>3. Fair Use of Resources</h2>
      <p>
        Plans that include managed hosting are intended for normal business use. We may
        contact you if your usage materially exceeds the typical consumption for your plan
        (e.g. sustained high traffic, excessive storage, or abusive automated requests) and
        ask you to move to a higher plan or reduce usage. Persistent abuse may result in
        suspension.
      </p>

      <h2>4. Security and Responsible Disclosure</h2>
      <p>
        If you discover a security vulnerability in our Services, please report it to{' '}
        <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>. Please
        give us a reasonable period to investigate and remediate before any public
        disclosure. Do not access, modify, or delete data belonging to others.
      </p>

      <h2>5. Enforcement</h2>
      <p>
        We may investigate suspected violations and take action at our discretion,
        including:
      </p>
      <ul>
        <li>Removing or disabling offending content.</li>
        <li>Suspending or terminating accounts or Services, with or without notice.</li>
        <li>Cooperating with law enforcement where legally required.</li>
        <li>Seeking legal remedies and damages where appropriate.</li>
      </ul>
      <p>
        Termination for an AUP violation does not entitle you to a refund, and you remain
        responsible for any outstanding fees.
      </p>

      <h2>6. Reporting Abuse</h2>
      <p>
        If you believe a Cubico-hosted site, portal, or system is violating this policy,
        email{' '}
        <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a> with the
        URL, a description of the issue, and any supporting evidence.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this policy as threats and the regulatory landscape evolve. The
        &quot;Last updated&quot; date above will reflect the most recent change.
      </p>
    </LegalPage>
  );
}
