'use client';

import { motion } from 'framer-motion';
import { Building2, Users, Globe, Award } from 'lucide-react';

const stats = [
  { icon: Building2, value: '50+', label: 'Projects delivered' },
  { icon: Users, value: '10k+', label: 'Active users' },
  { icon: Globe, value: '12+', label: 'Countries reached' },
  { icon: Award, value: '5+', label: 'Years in market' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-3">
              About Cubico
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight mb-6">
              Design meets science. Code meets strategy.
            </h2>
            <p className="text-surface-400 font-body leading-relaxed mb-4">
              Cubico Technologies is a global software company headquartered in
              Pakistan. We build websites, portals, CRMs, and marketing systems
              for businesses that want to grow — not just exist online.
            </p>
            <p className="text-surface-400 font-body leading-relaxed mb-8">
              Every product shares the same DNA — brand-first design, psychology-driven
              UX, blazing performance, and the flexibility to scale with your ambition.
            </p>
            <a
              href="mailto:hello@cubico.tech"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-colors font-body text-sm"
            >
              Get in touch
            </a>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-surface-900 border border-surface-800"
              >
                <Icon size={24} className="text-brand-400 mb-3" />
                <p className="text-3xl font-display font-bold text-white mb-1">
                  {value}
                </p>
                <p className="text-sm text-surface-400 font-body">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
