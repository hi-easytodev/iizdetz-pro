'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: string;
  title: string;
  features: string[];
  color: 'blue' | 'purple' | 'cyan';
}

const colorVariants = {
  blue: 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-600/50',
  purple: 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-600/50',
  cyan: 'bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border-cyan-600/50',
};

export function FeatureCard({ icon, title, features, color }: FeatureCardProps) {
  return (
    <Card className={cn('p-6', colorVariants[color])}>
      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>

      {/* Features List */}
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start text-[var(--text-secondary)] text-sm"
          >
            <span className="text-[var(--accent-purple)] mr-2">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
