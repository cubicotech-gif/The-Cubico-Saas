'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Check, MessageCircle } from 'lucide-react';
import DynamicIcon from '@/components/ui/DynamicIcon';
import WebDevHero from '@/components/WebDevHero';
import TechLogoTicker from '@/components/TechLogoTicker';
import PainPoints from '@/components/PainPoints';
import BentoShowcase from '@/components/BentoShowcase';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import WebsitePricing from '@/components/WebsitePricing';
import type { Service } from '@/lib/types';
import type { MediaAsset } from '@/lib/media';

interface ServicePageContentProps {
  service: Service;
  contactWhatsapp: string;
  media?: Record<string, MediaAsset>;
}

const isWebsiteDev = (slug?: string) => slug === 'website-development';

export default function ServicePageContent({
  service,
  contactWhatsapp,
  media = {},
}: ServicePageContentProps) {
  const waNumber = contactWhatsapp.replace(/\D/g, '');

  // ── Website Development — fully custom visual page ──
  if (isWebsiteDev(service.slug)) {
    return (
      <div className="min-h-screen bg-surface-950">
        {/* 1. Cinematic Split Hero */}
        <WebDevHero
          title={service.page_hero_title ?? service.title}
          subtitle={service.page_hero_subtitle ?? service.description}
          waNumber={waNumber}
          media={media}
        />

        {/* 2. Tech Logo Ticker — trust bar */}
        <TechLogoTicker media={media} />

        {/* 3. Pain Points — agitation */}
        <PainPoints />

        {/* 4. Bento Grid — everything at a glance */}
        <BentoShowcase media={media} />

        {/* 4. Portfolio Showcase — large image cards + iframe */}
        <PortfolioShowcase media={media} />

        {/* 5. Pricing — geo-dynamic */}
        <WebsitePricing waNumber={waNumber} serviceTitle={service.title} />

        {/* 6. Final CTA */}
        <section id="webdev-cta" className="relative py-20 bg-surface-900/50 border-t border-surface-800 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/8 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                Let&apos;s build something your customers can&apos;t stop scrolling
              </h2>
              <p className="text-surface-400 font-body mb-8 max-w-lg mx-auto">
                Message us on WhatsApp and we&apos;ll have your project scoped,
                designed, and in development within days — not months.
              </p>
              <a
                href={`https://wa.me/${waNumber}?text=Hi, I'm interested in Website Development`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-semibold rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#FF6B4A]/25 font-body text-lg"
              >
                <MessageCircle size={18} />
                Start Your Project
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // ── Generic service page (all other services) ──
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/#services"
              className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-white transition-colors mb-8 font-body"
            >
              <ArrowLeft size={14} />
              Back to services
            </Link>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-950 border border-brand-800 text-brand-400 mb-6">
              <DynamicIcon name={service.icon} size={28} />
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-4">
              {service.page_hero_title ?? service.title}
            </h1>
            <p className="text-lg text-surface-400 font-body max-w-2xl mx-auto leading-relaxed">
              {service.page_hero_subtitle ?? service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href={`https://wa.me/${waNumber}?text=Hi, I'm interested in ${encodeURIComponent(service.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-brand-600/25 font-body"
              >
                <MessageCircle size={16} />
                Get Started on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <section className="py-20 bg-surface-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-3">
                Everything you need
              </h2>
              <p className="text-surface-400 font-body">
                Built-in features that cover every workflow out of the box.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, i) => (
                <motion.div
                  key={feature.id ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="p-6 rounded-2xl bg-surface-900 border border-surface-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400 mb-4">
                    <DynamicIcon name={feature.icon} size={18} />
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-surface-400 font-body leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      {service.pricing && service.pricing.length > 0 && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-3">
                Simple, transparent pricing
              </h2>
              <p className="text-surface-400 font-body">
                No hidden fees. Cancel or upgrade any time.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.pricing.map((tier, i) => (
                <motion.div
                  key={tier.id ?? i}
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
                      Most Popular
                    </div>
                  )}

                  <p className="font-display font-semibold text-white mb-2">
                    {tier.name}
                  </p>
                  <p className="text-3xl font-display font-bold text-white mb-0.5">
                    {tier.price}
                  </p>
                  {tier.period && (
                    <p className="text-sm text-surface-500 font-body mb-5">
                      / {tier.period}
                    </p>
                  )}

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
                    href={`https://wa.me/${waNumber}?text=Hi, I'd like to know more about the ${encodeURIComponent(tier.name)} plan for ${encodeURIComponent(service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors font-body ${
                      tier.is_featured
                        ? 'bg-brand-600 hover:bg-brand-500 text-white'
                        : 'bg-surface-800 hover:bg-surface-700 text-white'
                    }`}
                  >
                    Get Started
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA footer */}
      <section className="py-16 bg-surface-900/50 border-t border-surface-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-surface-400 font-body mb-6">
            Message us on WhatsApp and we&apos;ll have you up and running within
            days, not months.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=Hi, I'm interested in ${encodeURIComponent(service.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-brand-600/25 font-body"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
