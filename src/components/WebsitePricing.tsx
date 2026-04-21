'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight, Loader2, Info } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocale } from '@/i18n/LocaleProvider';

// Tier names (Starter/Growth/Professional) are product brand names and stay
// in English across all locales — only copy around them is localised.
type TierKey = 'starter' | 'growth' | 'professional';

interface PricingTier {
  key: TierKey;
  name: string;
  devCostPKR: number;
  devCostUSD: number;
  monthlyPKR: number;
  monthlyUSD: number;
  ecommerceExtraPKR: number;
  ecommerceExtraUSD: number;
  is_featured: boolean;
}

const tiers: PricingTier[] = [
  {
    key: 'starter',
    name: 'Starter',
    devCostPKR: 12000,
    devCostUSD: 65,
    monthlyPKR: 0,
    monthlyUSD: 0,
    ecommerceExtraPKR: 5000,
    ecommerceExtraUSD: 25,
    is_featured: false,
  },
  {
    key: 'growth',
    name: 'Growth',
    devCostPKR: 10000,
    devCostUSD: 48,
    monthlyPKR: 1000,
    monthlyUSD: 15,
    ecommerceExtraPKR: 5000,
    ecommerceExtraUSD: 25,
    is_featured: true,
  },
  {
    key: 'professional',
    name: 'Professional',
    devCostPKR: 8000,
    devCostUSD: 35,
    monthlyPKR: 1500,
    monthlyUSD: 10,
    ecommerceExtraPKR: 5000,
    ecommerceExtraUSD: 25,
    is_featured: false,
  },
];

interface WebsitePricingProps {
  waNumber?: string;
  serviceTitle?: string;
}

export default function WebsitePricing(_props: WebsitePricingProps) {
  const { format, loading, isPakistan } = useCurrency();
  const { locale, dict } = useLocale();

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
            {dict.webPricing.title}
          </h2>
          <p className="text-surface-400 font-body max-w-xl mx-auto">
            {dict.webPricing.subtitle}
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
              {dict.webPricing.detecting}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-900 border border-surface-800 text-xs text-surface-400 font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {isPakistan
                ? dict.webPricing.pricesInPkr
                : dict.webPricing.pricesInUsd}
            </span>
          )}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier, i) => {
            const tierDict = dict.webPricing.tiers[tier.key];
            return (
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
                    {tierDict.highlight}
                  </div>
                )}

                <p className="font-display font-semibold text-white mb-1">
                  {tier.name}
                </p>
                <p className="text-xs text-surface-500 font-body mb-4">
                  {tierDict.subtitle}
                </p>

                {/* Development cost */}
                <div className="mb-1">
                  <p className="text-3xl font-display font-bold text-white">
                    {format({ pkr: tier.devCostPKR, usd: tier.devCostUSD })}
                  </p>
                  <p className="text-sm text-surface-500 font-body">
                    {dict.webPricing.oneTimeDev}
                  </p>
                </div>

                {/* Monthly cost */}
                {tier.monthlyPKR > 0 && (
                  <div className="mb-4">
                    <p className="text-lg font-display font-semibold text-brand-400">
                      + {format({ pkr: tier.monthlyPKR, usd: tier.monthlyUSD })}
                      <span className="text-sm text-surface-500 font-body font-normal">
                        {' '}
                        {dict.webPricing.perMonth}
                      </span>
                    </p>
                  </div>
                )}
                {tier.monthlyPKR === 0 && <div className="mb-4" />}

                {/* E-commerce add-on note */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-800/50 border border-surface-700/50 mb-5">
                  <Info size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-surface-400 font-body leading-relaxed">
                    {dict.webPricing.ecommerceNote.replace(
                      '{amount}',
                      format({ pkr: tier.ecommerceExtraPKR, usd: tier.ecommerceExtraUSD }),
                    )}
                  </p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {tierDict.features.map((feat, fi) => (
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

                <Link
                  href={`/${locale}/order?plan=${encodeURIComponent(tier.name)}`}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors font-body ${
                    tier.is_featured
                      ? 'bg-[#FF6B4A] hover:bg-[#ff7f61] text-white'
                      : 'bg-surface-800 hover:bg-surface-700 text-white'
                  }`}
                >
                  {dict.webPricing.pickTier.replace('{tier}', tier.name)}
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Support note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-surface-500 font-body mt-8 max-w-lg mx-auto leading-relaxed"
        >
          {dict.webPricing.supportNote}
        </motion.p>
      </div>
    </section>
  );
}
