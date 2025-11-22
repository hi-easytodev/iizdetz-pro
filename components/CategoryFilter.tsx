'use client';

import { Tag, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onChange,
  className = '',
}: CategoryFilterProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-3">
        <Tag className="w-5 h-5 text-[var(--accent-gold)]" />
        <h3 className="text-lg font-semibold text-white">Категории</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={clearAll}
            className="ml-auto text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Очистить
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-[var(--accent-purple)] to-pink-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-[var(--card-bg)] border border-[var(--border)] text-gray-300 hover:border-[var(--accent-purple)] hover:text-white'
              }`}
            >
              {category}
              {isSelected && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-3 text-sm text-gray-400">
          Выбрано: <span className="text-white font-medium">{selectedCategories.length}</span> из{' '}
          <span className="text-white font-medium">{categories.length}</span>
        </div>
      )}
    </div>
  );
}
