'use client';

import Link from 'next/link';
import { Heart, CheckSquare, Square } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MiniChart } from './MiniChart';
import { cn } from '@/lib/utils';
import type { IdeaCardProps } from '@/types';

interface ExtendedIdeaCardProps extends IdeaCardProps {
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
  comparisonMode?: boolean;
}

export function IdeaCard({
  id,
  title,
  description,
  arrRange,
  categories,
  reactions,
  chartData,
  isFavorite,
  isSelected = false,
  onToggleSelect,
  comparisonMode = false,
}: ExtendedIdeaCardProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSelect?.(id);
  };

  return (
    <Link href={`/idea/${id}`} className="block group">
      <Card className={`relative hover:border-[var(--accent-purple)] transition-all duration-300 overflow-hidden ${
        isSelected ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]' : ''
      }`}>
        <div className="p-6">
          {/* Mini Graph */}
          <MiniChart data={chartData} />

          {/* Reactions */}
          <div className="flex gap-2 mt-4 mb-3">
            {reactions && reactions.length > 0 ? (
              reactions.map((reaction, i) => (
                <span
                  key={i}
                  className="text-xs bg-[var(--border)] px-2 py-1 rounded"
                >
                  {reaction.emoji} {reaction.count}
                </span>
              ))
            ) : (
              <>
                <span className="text-xs bg-[var(--border)] px-2 py-1 rounded">
                  👍 12
                </span>
                <span className="text-xs bg-[var(--border)] px-2 py-1 rounded">
                  🔥 8
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2 group-hover:text-[var(--accent-purple)] transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* ARR Range */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-orange-400">💰</span>
            <span className="text-gray-300 text-sm font-medium">{arrRange}</span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <span
                key={i}
                className="bg-[var(--border)] text-gray-300 text-xs px-3 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Comparison Checkbox */}
          {comparisonMode && (
            <button
              className="absolute top-4 left-4 p-2 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--border)] transition-colors z-10"
              onClick={handleCheckboxClick}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-[var(--accent-gold)]" />
              ) : (
                <Square className="w-5 h-5 text-gray-500 hover:text-[var(--accent-gold)]" />
              )}
            </button>
          )}

          {/* Favorite Button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--border)] transition-colors z-10"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement favorite toggle
              console.log('Toggle favorite:', id);
            }}
          >
            <Heart
              className={cn(
                'w-5 h-5',
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              )}
            />
          </button>
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-900/0 to-purple-900/0 group-hover:from-purple-900/10 group-hover:via-pink-900/10 group-hover:to-purple-900/10 transition-all duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
}
