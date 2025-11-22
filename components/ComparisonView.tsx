'use client';

import { X, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MiniChart } from './MiniChart';
import Link from 'next/link';
import type { IdeaCardProps } from '@/types';

interface ComparisonViewProps {
  ideas: IdeaCardProps[];
  onRemoveIdea?: (id: number) => void;
}

export function ComparisonView({ ideas, onRemoveIdea }: ComparisonViewProps) {
  if (ideas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Выберите идеи для сравнения
        </h3>
        <p className="text-[var(--text-secondary)]">
          Активируйте режим сравнения и выберите минимум 2 идеи
        </p>
      </div>
    );
  }

  const comparisonRows = [
    { label: 'Название', key: 'title' },
    { label: 'Описание', key: 'description' },
    { label: 'ARR Range', key: 'arrRange' },
    { label: 'Категории', key: 'categories' },
    { label: 'График роста', key: 'chart' },
    { label: 'Реакции', key: 'reactions' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Сравнение идей ({ideas.length})
        </h2>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Ideas Header */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${ideas.length}, minmax(300px, 1fr))` }}>
            <div className="font-semibold text-gray-400 self-center">
              Характеристика
            </div>
            {ideas.map((idea) => (
              <Card key={idea.id} className="p-4 relative">
                {onRemoveIdea && (
                  <button
                    onClick={() => onRemoveIdea(idea.id)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-[var(--border)] transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                )}
                <Link
                  href={`/idea/${idea.id}`}
                  className="font-semibold text-white hover:text-[var(--accent-purple)] transition-colors flex items-center gap-2"
                >
                  Идея #{idea.id}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Card>
            ))}
          </div>

          {/* Comparison Rows */}
          {comparisonRows.map((row) => (
            <div
              key={row.key}
              className="grid gap-4 mb-4"
              style={{ gridTemplateColumns: `200px repeat(${ideas.length}, minmax(300px, 1fr))` }}
            >
              <div className="font-semibold text-gray-400 self-start pt-4">
                {row.label}
              </div>
              {ideas.map((idea) => (
                <Card key={idea.id} className="p-4">
                  {row.key === 'title' && (
                    <h3 className="text-white font-semibold">{idea.title}</h3>
                  )}
                  {row.key === 'description' && (
                    <p className="text-[var(--text-secondary)] text-sm">
                      {idea.description}
                    </p>
                  )}
                  {row.key === 'arrRange' && (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400">💰</span>
                      <span className="text-gray-300 font-medium">
                        {idea.arrRange}
                      </span>
                    </div>
                  )}
                  {row.key === 'categories' && (
                    <div className="flex flex-wrap gap-2">
                      {idea.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="bg-[var(--border)] text-gray-300 text-xs px-3 py-1 rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  {row.key === 'chart' && idea.chartData && (
                    <div className="h-24">
                      <MiniChart data={idea.chartData} />
                    </div>
                  )}
                  {row.key === 'reactions' && (
                    <div className="flex flex-wrap gap-2">
                      {idea.reactions && idea.reactions.length > 0 ? (
                        idea.reactions.map((reaction, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[var(--border)] px-2 py-1 rounded"
                          >
                            {reaction.emoji} {reaction.count}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Нет реакций
                        </span>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-4">
        <p className="text-sm text-gray-400">
          💡 <strong>Совет:</strong> Кликните на "Идея #X" чтобы перейти к
          детальному анализу
        </p>
      </div>
    </div>
  );
}
