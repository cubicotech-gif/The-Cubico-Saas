'use client';

import { motion } from 'framer-motion';
import ServiceCard from '@/components/ServiceCard';
import DynamicIcon from '@/components/ui/DynamicIcon';
import type { Service, ServiceCategory } from '@/lib/types';

const categoryMeta: Record<
  ServiceCategory,
  { label: string; icon: string; accent: string; description: string }
> = {
  institution: {
    label: 'Institution',
    icon: 'Building2',
    accent: 'text-brand-400',
    description: 'School & university management, LMS, and marketing platforms.',
  },
  healthcare: {
    label: 'Healthcare',
    icon: 'Stethoscope',
    accent: 'text-emerald-400',
    description: 'Hospital management systems and clinic EHR solutions.',
  },
  individual: {
    label: 'Individual',
    icon: 'UserCircle',
    accent: 'text-violet-400',
    description: 'Websites, portals, CRM, and digital marketing for growing businesses.',
  },
  creative: {
    label: 'Creative',
    icon: 'Sparkles',
    accent: 'text-amber-400',
    description: 'Brand design, creative studio, and video production.',
  },
};

interface CategorySectionProps {
  category: ServiceCategory;
  services: Service[];
  globalIndex: number;
}

export default function CategorySection({
  category,
  services,
  globalIndex,
}: CategorySectionProps) {
  const meta = categoryMeta[category];

  return (
    <div className="mb-16">
      {/* Category header */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className={`${meta.accent}`}>
          <DynamicIcon name={meta.icon} size={20} />
        </div>
        <div>
          <h2 className={`text-lg font-display font-semibold ${meta.accent}`}>
            {meta.label}
          </h2>
          <p className="text-sm text-surface-500 font-body">{meta.description}</p>
        </div>
      </motion.div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service, i) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={globalIndex + i}
          />
        ))}
      </div>
    </div>
  );
}
