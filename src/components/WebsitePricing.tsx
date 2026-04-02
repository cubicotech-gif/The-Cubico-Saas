'use client';

import { motion } from 'framer-motion';
import { Check, MessageCircle, Loader2, Info } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface PricingTier {
  name: string;
  subtitle: string;
  devCostPKR: number;
  monthlyPKR: number;
  ecommerceExtraPKR: number;
  period: string;
  features: string[];
  highlight: string;
  is_featured: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    subtitle: 'You bring domain & hosting',
    devCostPKR: 12000,
    monthlyPKR: 0,
    ecommerceExtraPKR: 5000,
    period: 'one-time',
    features: [
      'Up to 4 pages',
      'Basic content & layout',
      'Mobile responsive design',
      'Contact form integration',
      'Basic SEO setup',
      '3 months free adjustments',
      'You provide domain & hosting',
    ],
    highlight: 'No monthly fees',
    is_featured: false,
  },
  {
    name: 'Growth',
    subtitle: 'We handle hosting',
    devCostPKR: 10000,
    monthlyPKR: 1000,
    ecommerceExtraPKR: 5000,
    period: 'month',
    features: [
      'Up to 4 pages',
      'Brand-aligned design',
      'Mobile responsive',
      'Contact form + WhatsApp widget',
      'SEO optimised',
      '3 months free adjustments',
      'Managed hosting included',
      'SSL certificate included',
    ],
    highlight: 'Most Popular',
    is_featured: true,
  },
  {
    name: 'Professional',
    subtitle: 'We handle domain + hosting',
    devCostPKR: 8000,
    monthlyPKR: 1500,
    ecommerceExtraPKR: 5000,
    period: 'month',
    features: [
      'Up to 4 pages',
      'Psychology-based design',
      'Mobile responsive',
      'Contact form + WhatsApp widget',
      'Advanced SEO',
      'Domain registration included',
      'Managed hosting included',
      'SSL + security headers',
      'Continuous support & updates',
      'Monthly performance reports',
    ],
    highlight: 'Full Service',
    is_featured: false,
  },
];

interface WebsitePricingProps {
  waNumber: string;
  serviceTitle: string;
}

export default function WebsitePricing({
  waNumber,
  serviceTitle,
}: WebsitePricingProps) {
  const { format, loading, isPakistan } = useCurrency();

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl font-display font-bold text-white mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-surface-400 font-body max-w-xl mx-auto">
            Choose the plan that fits your needs. All plans include
            brand-oriented design with colour psychology principles.
          </p>
        </motion.div>

        {/* Currency indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2 text-xs text-surface-500 font-body">
              <Loader2 size={12} className="animate-spin" />
              Detecting your location...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-900 border border-surface-800 text-xs text-surface-400 font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Prices shown in {isPakistan ? 'PKR (Pakistan)' : 'USD (International)'}
            </span>
          )}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
                tier.is_featured
                  ? 'bg-brand-900/40 border-brand-700 shadow-xl shadow-brand-900/20'
                  : 'bg-surface-900 border-surface-800'
              }`}
            >
              {tier.is_featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 text-white text-xs font-medium rounded-full font-body">
                  {tier.highlight}
                </div>
              )}

              <p className="font-display font-semibold text-white mb-1">
                {tier.name}
              </p>
              <p className="text-xs text-surface-500 font-body mb-4">
                {tier.subtitle}
              </p>

              {/* Development cost */}
              <div className="mb-1">
                <p className="text-3xl font-display font-bold text-white">
                  {format(tier.devCostPKR)}
                </p>
                <p className="text-sm text-surface-500 font-body">
                  one-time development
                </p>
              </div>

              {/* Monthly cost */}
              {tier.monthlyPKR > 0 && (
                <div className="mb-4">
                  <p className="text-lg font-display font-semibold text-brand-400">
                    + {format(tier.monthlyPKR)}
                    <span className="text-sm text-surface-500 font-body font-normal">
                      {' '}
                      / month
                    </span>
                  </p>
                </div>
              )}
              {tier.monthlyPKR === 0 && <div className="mb-4" />}

              {/* E-commerce add-on note */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-800/50 border border-surface-700/50 mb-5">
                <Info size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-surface-400 font-body leading-relaxed">
                  E-commerce functionality: +{format(tier.ecommerceExtraPKR)} added
                  to development cost
                </p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((feat, fi) => (
                  <li
                    key={fi}
                    className="flex items-start gap-2 text-sm text-surface-300 font-body"
                  >
                    <Check
                      size={14}
                      className="text-brand-400 mt-0.5 flex-shrink-0"
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/${waNumber}?text=Hi, I'd like to know more about the ${encodeURIComponent(tier.name)} website plan`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors font-body ${
                  tier.is_featured
                    ? 'bg-brand-600 hover:bg-brand-500 text-white'
                    : 'bg-surface-800 hover:bg-surface-700 text-white'
                }`}
              >
                <MessageCircle size={14} />
                Get Started
              </a>
            </motion.div>
          ))}
        </div>

        {/* Support note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-surface-500 font-body mt-8 max-w-lg mx-auto leading-relaxed"
        >
          Starter plan includes 3 months of free adjustments after delivery.
          Growth and Professional plans include continuous support and updates
          for as long as you&apos;re subscribed.
        </motion.p>
      </div>
    </section>
  );
}
