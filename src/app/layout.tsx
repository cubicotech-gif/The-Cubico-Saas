import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cubico Technologies — Enterprise Software for Pakistan',
  description:
    'Cubico Technologies delivers enterprise-grade software for institutions, healthcare providers, and growing businesses across Pakistan.',
  keywords: ['school management system', 'hospital management system', 'EHR', 'LMS', 'Karachi', 'Pakistan', 'SaaS'],
  openGraph: {
    title: 'Cubico Technologies',
    description: 'Enterprise software for institutions, healthcare, and businesses across Pakistan.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
