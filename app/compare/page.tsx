'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ComparisonView } from '@/components/ComparisonView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { IdeaCardProps } from '@/types';
import type { NicheId } from '@/components/NichePicker';

// Mock data - same as on homepage
const mockIdeas: (IdeaCardProps & { niche: NicheId })[] = [
  {
    id: 1,
    title: 'AI-платформа для автоматизации создания контента в соцсетях',
    description: 'Автоматизируйте создание постов, сторис и видео для всех социальных сетей с помощью AI. Экономьте 20+ часов в неделю.',
    arrRange: '$600K-$780K ARR',
    categories: ['AI', 'SaaS', 'Marketing'],
    niche: 'ai',
    reactions: [
      { emoji: '👍', count: 24 },
      { emoji: '🔥', count: 18 },
      { emoji: '💡', count: 12 },
    ],
    chartData: [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 45 },
      { x: 3, y: 60 },
      { x: 4, y: 85 },
      { x: 5, y: 100 },
    ],
    isFavorite: false,
  },
  {
    id: 2,
    title: 'Платформа для обучения детей программированию через игры',
    description: 'Интерактивная платформа с геймификацией для обучения детей 7-14 лет основам программирования на Python, JavaScript и Scratch.',
    arrRange: '$1.2M-$1.8M ARR',
    categories: ['EdTech', 'B2C', 'Gamification'],
    niche: 'edtech',
    reactions: [
      { emoji: '🎮', count: 42 },
      { emoji: '💻', count: 31 },
      { emoji: '❤️', count: 28 },
    ],
    chartData: [
      { x: 0, y: 15 },
      { x: 1, y: 30 },
      { x: 2, y: 55 },
      { x: 3, y: 75 },
      { x: 4, y: 90 },
      { x: 5, y: 120 },
    ],
    isFavorite: true,
  },
  {
    id: 3,
    title: 'Анализ эффективности удаленных команд с помощью AI',
    description: 'AI-инструмент для HR и менеджеров, который анализирует продуктивность команд, выявляет burnout и предлагает решения.',
    arrRange: '$500K-$900K ARR',
    categories: ['B2B', 'HR Tech', 'AI', 'Analytics'],
    niche: 'b2b',
    reactions: [
      { emoji: '📊', count: 19 },
      { emoji: '💼', count: 15 },
    ],
    chartData: [
      { x: 0, y: 8 },
      { x: 1, y: 22 },
      { x: 2, y: 38 },
      { x: 3, y: 52 },
      { x: 4, y: 68 },
      { x: 5, y: 85 },
    ],
    isFavorite: false,
  },
  {
    id: 4,
    title: 'Маркетплейс для фрилансеров с AI-подбором проектов',
    description: 'Платформа, которая использует AI для идеального матчинга фрилансеров с проектами на основе навыков, опыта и предпочтений.',
    arrRange: '$800K-$1.3M ARR',
    categories: ['Marketplace', 'AI', 'Freelance'],
    niche: 'saas',
    reactions: [
      { emoji: '💰', count: 38 },
      { emoji: '🚀', count: 29 },
      { emoji: '👥', count: 22 },
    ],
    chartData: [
      { x: 0, y: 12 },
      { x: 1, y: 28 },
      { x: 2, y: 48 },
      { x: 3, y: 70 },
      { x: 4, y: 95 },
      { x: 5, y: 115 },
    ],
    isFavorite: false,
  },
  {
    id: 5,
    title: 'SaaS для автоматизации документооборота в малом бизнесе',
    description: 'Простое решение для оцифровки и автоматизации документов: договоры, счета, накладные. Интеграция с 1С и другими системами.',
    arrRange: '$400K-$650K ARR',
    categories: ['B2B', 'SaaS', 'Legal Tech'],
    niche: 'saas',
    reactions: [
      { emoji: '📄', count: 16 },
      { emoji: '✅', count: 14 },
    ],
    chartData: [
      { x: 0, y: 6 },
      { x: 1, y: 18 },
      { x: 2, y: 32 },
      { x: 3, y: 48 },
      { x: 4, y: 62 },
      { x: 5, y: 78 },
    ],
    isFavorite: false,
  },
  {
    id: 6,
    title: 'AI-ассистент для персонализированного питания и здоровья',
    description: 'Приложение, которое анализирует данные о здоровье, создает персонализированные планы питания и рекомендует рецепты.',
    arrRange: '$700K-$1.1M ARR',
    categories: ['HealthTech', 'AI', 'B2C', 'Mobile'],
    niche: 'healthtech',
    reactions: [
      { emoji: '🍎', count: 33 },
      { emoji: '💪', count: 27 },
      { emoji: '❤️', count: 24 },
    ],
    chartData: [
      { x: 0, y: 10 },
      { x: 1, y: 26 },
      { x: 2, y: 44 },
      { x: 3, y: 64 },
      { x: 4, y: 88 },
      { x: 5, y: 105 },
    ],
    isFavorite: true,
  },
];

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedIdeas, setSelectedIdeas] = useState<IdeaCardProps[]>([]);

  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const ids = idsParam.split(',').map((id) => parseInt(id, 10));
      const ideas = mockIdeas.filter((idea) => ids.includes(idea.id));
      setSelectedIdeas(ideas);
    }
  }, [searchParams]);

  const handleRemoveIdea = (id: number) => {
    const newIdeas = selectedIdeas.filter((idea) => idea.id !== id);
    setSelectedIdeas(newIdeas);

    // Update URL
    const newIds = newIdeas.map((idea) => idea.id).join(',');
    if (newIds) {
      router.push(`/compare?ids=${newIds}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к идеям
        </Button>
        <h1 className="text-4xl font-bold text-white">
          Сравнение бизнес-идей
        </h1>
      </div>

      {/* Comparison View */}
      <ComparisonView ideas={selectedIdeas} onRemoveIdea={handleRemoveIdea} />
    </div>
  );
}
