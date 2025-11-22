'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  color: 'blue' | 'gold' | 'purple' | 'cyan';
}

const colorVariants = {
  blue: 'bg-[#1a1a2e] border-blue-600/50',
  gold: 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-600/50',
  purple: 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-600/50',
  cyan: 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-600/50',
};

const numberColorVariants = {
  blue: 'bg-blue-600/20 text-blue-400',
  gold: 'bg-amber-600/20 text-amber-400',
  purple: 'bg-purple-600/20 text-purple-400',
  cyan: 'bg-cyan-600/20 text-cyan-400',
};

export function StepCard({ number, title, description, color }: StepCardProps) {
  return (
    <Card className={cn('p-6 relative overflow-hidden', colorVariants[color])}>
      {/* Large Number in Background */}
      <div className="absolute top-0 right-0 text-9xl font-bold opacity-5">
        {number}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Step Number */}
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-lg',
            numberColorVariants[color]
          )}
        >
          {number}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>

        {/* Description */}
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}
