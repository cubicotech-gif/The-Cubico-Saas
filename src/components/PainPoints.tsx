'use client';

import { motion } from 'framer-motion';

const painPoints = [
  {
    title: 'You tried building it yourself',
    description:
      'Wix, WordPress, Squarespace — you spent weekends fighting templates that never looked like the demo. The result? A site that screams "I made this in a weekend."',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="10" width="36" height="26" rx="3" stroke="#FF6B4A" strokeWidth="2" />
        <line x1="6" y1="18" x2="42" y2="18" stroke="#FF6B4A" strokeWidth="2" />
        <circle cx="10" cy="14" r="1.5" fill="#FF6B4A" />
        <circle cx="15" cy="14" r="1.5" fill="#FF6B4A" />
        <circle cx="20" cy="14" r="1.5" fill="#FF6B4A" />
        {/* Crack / broken lines */}
        <path d="M20 24L24 28L22 32L26 36" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 22L32 26L30 30" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: 'You hired someone who vanished',
    description:
      'The freelancer was great — until they weren\'t. Halfway through, they ghosted. Now you\'re stuck with half a site, no source files, and zero answers.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Person outline fading */}
        <circle cx="24" cy="16" r="6" stroke="#FF6B4A" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M14 38C14 32.477 18.477 28 24 28C29.523 28 34 32.477 34 38" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
        {/* Question mark */}
        <path d="M36 10C36 7.79 37.79 6 40 6C42.21 6 44 7.79 44 10C44 11.66 42.92 13.07 41.41 13.64C40.88 13.84 40.5 14.35 40.5 14.93V16" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40.5" cy="19" r="1" fill="#FF6B4A" />
      </svg>
    ),
  },
  {
    title: 'You\'re paying monthly for a site you don\'t own',
    description:
      'Subscription site builders keep you locked in. You pay $30/month forever, can\'t export your site, and if you stop paying — it all disappears.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Coin / dollar */}
        <circle cx="20" cy="24" r="12" stroke="#FF6B4A" strokeWidth="2" />
        <path d="M20 18V30" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 21C17 19.9 18.34 19 20 19C21.66 19 23 19.9 23 21C23 22.1 21.66 23 20 23C18.34 23 17 23.9 17 25C17 26.1 18.34 27 20 27C21.66 27 23 26.1 23 25" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" />
        {/* Circular arrow — subscription loop */}
        <path d="M34 14C37.31 17.31 39 21.58 38.5 26" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 12L34 14L36.5 16" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 34C30.69 37.31 26.42 39 22 38.5" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: 'You just want it done — properly',
    description:
      'You don\'t want to learn code. You don\'t want another meeting about "sprints." You want a site that looks incredible, works perfectly, and is live this week.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Person with hands up / overwhelmed */}
        <circle cx="24" cy="12" r="5" stroke="#FF6B4A" strokeWidth="2" />
        <path d="M24 20V32" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 42L24 32L30 42" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Arms up */}
        <path d="M16 22L20 26" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 22L28 26" stroke="#FF6B4A" strokeWidth="2" strokeLinecap="round" />
        {/* Stress marks */}
        <line x1="10" y1="8" x2="10" y2="12" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="38" y1="8" x2="38" y2="12" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="8" y1="16" x2="12" y2="16" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <line x1="36" y1="16" x2="40" y2="16" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
];

export default function PainPoints() {
  return (
    <section className="relative py-20 sm:py-28 bg-surface-950 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B4A]/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
            We Know Why You&apos;re Here
          </h2>
          <p className="text-surface-500 font-body text-base sm:text-lg max-w-lg mx-auto">
            You&apos;ve been through the cycle. Let&apos;s break it.
          </p>
        </motion.div>

        {/* 2x2 grid on desktop, stack on mobile */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.15 }}
              className="group flex flex-row sm:flex-col items-start gap-4 sm:gap-0 rounded-xl border border-white/10 bg-[#0F1D32] p-5 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF6B4A]/[0.06] hover:border-[#FF6B4A]/20"
            >
              {/* Icon */}
              <div className="flex-shrink-0 sm:mb-5">
                {point.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-display font-semibold text-white text-base sm:text-lg mb-1.5 sm:mb-2">
                  {point.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-surface-400 font-body leading-relaxed">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-14 sm:mt-16 text-center"
        >
          <p className="text-lg sm:text-xl font-display font-semibold text-white">
            Cubico eliminates all of this.{' '}
            <span className="text-[#FF6B4A]">Here&apos;s how.</span>
          </p>
          {/* Downward indicator */}
          <div className="mt-4 flex justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-[#FF6B4A]/40 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
