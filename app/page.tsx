'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IdeaCard } from '@/components/IdeaCard';
import { Button } from '@/components/ui/button';
import { NichePicker, type NicheId } from '@/components/NichePicker';
import { CustomNicheResearch } from '@/components/CustomNicheResearch';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ChevronDown, Star, GitCompare, X } from 'lucide-react';
import type { IdeaCardProps } from '@/types';

// Моковые данные для демонстрации
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

export default function HomePage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'score' | 'created_at'>('score');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState<NicheId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<number[]>([]);

  // Extract unique categories from all ideas
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    mockIdeas.forEach((idea) => {
      idea.categories.forEach((category) => categorySet.add(category));
    });
    return Array.from(categorySet).sort();
  }, []);

  // Comparison functions
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (comparisonMode) {
      setSelectedIdeaIds([]);
    }
  };

  const toggleIdeaSelection = (id: number) => {
    setSelectedIdeaIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((ideaId) => ideaId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCompare = () => {
    if (selectedIdeaIds.length >= 2) {
      router.push(`/compare?ids=${selectedIdeaIds.join(',')}`);
    }
  };

  const filteredIdeas = mockIdeas
    .filter((idea) => selectedNiche === 'all' || idea.niche === selectedNiche)
    .filter((idea) => !showFavoritesOnly || idea.isFavorite)
    .filter((idea) => {
      // Search filter
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        idea.title.toLowerCase().includes(query) ||
        idea.description.toLowerCase().includes(query)
      );
    })
    .filter((idea) => {
      // Category filter
      if (selectedCategories.length === 0) return true;
      return idea.categories.some((cat) => selectedCategories.includes(cat));
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Идеи для тебя
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          {filteredIdeas.length} готовых бизнес-планов
        </p>
      </div>

      {/* Niche Picker */}
      <div className="mb-6">
        <NichePicker selectedNiche={selectedNiche} onNicheChange={setSelectedNiche} />
      </div>

      {/* Custom Niche Research */}
      <div className="mb-8">
        <CustomNicheResearch
          onResearchComplete={(niche, results) => {
            console.log('Research completed for:', niche, results);
            // TODO: Save results to database or state
          }}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={allCategories}
          selectedCategories={selectedCategories}
          onChange={setSelectedCategories}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-white hover:border-[var(--accent-purple)] transition-colors"
              onClick={() => {
                setSortBy(sortBy === 'score' ? 'created_at' : 'score');
              }}
            >
              <span>
                {sortBy === 'score' ? 'По рейтингу' : 'Новые первыми'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Favorites Toggle */}
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex items-center gap-2"
          >
            <Star className={showFavoritesOnly ? 'fill-current' : ''} />
            Избранное
          </Button>
        </div>

        {/* Comparison Controls */}
        <div className="flex items-center gap-3">
          {comparisonMode && selectedIdeaIds.length >= 2 && (
            <Button
              onClick={handleCompare}
              className="flex items-center gap-2 bg-gradient-to-r from-[var(--accent-gold)] to-yellow-600 hover:from-yellow-600 hover:to-[var(--accent-gold)] text-black font-semibold"
            >
              <GitCompare className="w-4 h-4" />
              Сравнить ({selectedIdeaIds.length})
            </Button>
          )}
          <Button
            variant={comparisonMode ? 'default' : 'outline'}
            onClick={toggleComparisonMode}
            className="flex items-center gap-2"
          >
            {comparisonMode ? (
              <>
                <X className="w-4 h-4" />
                Отменить
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4" />
                Сравнить идеи
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <IdeaCard
            key={idea.id}
            {...idea}
            comparisonMode={comparisonMode}
            isSelected={selectedIdeaIds.includes(idea.id)}
            onToggleSelect={toggleIdeaSelection}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredIdeas.length === 0 && (
        <div className="text-center py-20">
          <Star className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)]" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {showFavoritesOnly
              ? 'Нет избранных идей'
              : 'Ничего не найдено'}
          </h3>
          <p className="text-[var(--text-secondary)]">
            {showFavoritesOnly
              ? 'Добавьте идеи в избранное, чтобы быстро находить их'
              : 'Попробуйте изменить параметры поиска или фильтры'}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {filteredIdeas.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Загрузить еще
          </Button>
        </div>
      )}
    </div>
  );
}
