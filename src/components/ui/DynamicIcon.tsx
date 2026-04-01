'use client';

import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export default function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.FC<LucideProps>>)[name];
  if (!Icon) {
    const Fallback = LucideIcons.Box;
    return <Fallback {...props} />;
  }
  return <Icon {...props} />;
}
