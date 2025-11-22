'use client';

import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface ProgressStage {
  name: string;
  title: string;
  icon: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface AnalysisProgressIndicatorProps {
  currentStage?: string;
  currentStageNumber?: number;
  totalStages?: number;
  progress?: number;
  message?: string;
  completedStages?: string[];
}

const ALL_STAGES = [
  { key: 'market', name: 'Market Analysis', title: 'Анализ рынка', icon: '📊' },
  { key: 'demand', name: 'Demand Analysis', title: 'Анализ спроса', icon: '🎯' },
  { key: 'communities', name: 'Communities', title: 'Сообщества', icon: '👥' },
  { key: 'competition', name: 'Competition', title: 'Конкуренты', icon: '⚔️' },
  { key: 'forecast', name: 'Forecast', title: 'Прогноз', icon: '🔮' },
  { key: 'gtm', name: 'GTM Strategy', title: 'GTM стратегия', icon: '🚀' },
  { key: 'tech', name: 'Tech Stack', title: 'Технологии', icon: '⚙️' },
  { key: 'customers', name: 'Customers', title: 'Клиенты', icon: '🧠' },
];

export function AnalysisProgressIndicator({
  currentStage,
  currentStageNumber = 0,
  totalStages = 8,
  progress = 0,
  message,
  completedStages = [],
}: AnalysisProgressIndicatorProps) {
  const stages: ProgressStage[] = ALL_STAGES.map((stage) => ({
    ...stage,
    status:
      completedStages.includes(stage.key)
        ? 'completed'
        : currentStage === stage.key
        ? 'in_progress'
        : 'pending',
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="w-16 h-16 mx-auto text-[var(--accent-purple)] animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Анализ в процессе...
        </h2>
        {message && (
          <p className="text-[var(--text-secondary)] text-lg">{message}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-[var(--text-secondary)]">
            Этап {currentStageNumber} из {totalStages}
          </span>
          <span className="text-[var(--accent-gold)] font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent-purple)] to-pink-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {stages.map((stage, idx) => (
          <div
            key={stage.key}
            className={`relative rounded-lg p-4 border-2 transition-all duration-300 ${
              stage.status === 'completed'
                ? 'bg-green-900/20 border-green-500/50'
                : stage.status === 'in_progress'
                ? 'bg-purple-900/30 border-[var(--accent-purple)] shadow-lg shadow-purple-500/20'
                : 'bg-[var(--border)] border-gray-700'
            }`}
          >
            {/* Status Icon */}
            <div className="absolute top-2 right-2">
              {stage.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : stage.status === 'in_progress' ? (
                <Loader2 className="w-5 h-5 text-[var(--accent-purple)] animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600" />
              )}
            </div>

            {/* Stage Info */}
            <div className="text-center">
              <div className="text-3xl mb-2">{stage.icon}</div>
              <div className="text-xs text-gray-400 mb-1">Этап {idx + 1}</div>
              <div
                className={`text-sm font-medium ${
                  stage.status === 'completed'
                    ? 'text-green-300'
                    : stage.status === 'in_progress'
                    ? 'text-white'
                    : 'text-gray-500'
                }`}
              >
                {stage.title}
              </div>
            </div>

            {/* Pulse Animation for In Progress */}
            {stage.status === 'in_progress' && (
              <div className="absolute inset-0 rounded-lg bg-purple-500/10 animate-pulse pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-[var(--text-secondary)]">
            Завершено: <span className="text-white font-semibold">{completedStages.length}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[var(--accent-purple)] animate-spin" />
          <span className="text-[var(--text-secondary)]">
            В процессе: <span className="text-white font-semibold">{currentStage ? 1 : 0}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-4 h-4 text-gray-600" />
          <span className="text-[var(--text-secondary)]">
            Осталось:{' '}
            <span className="text-white font-semibold">
              {totalStages - completedStages.length - (currentStage ? 1 : 0)}
            </span>
          </span>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="text-center text-sm text-[var(--text-secondary)]">
        <p>
          Примерное время завершения:{' '}
          <span className="text-[var(--accent-gold)]">
            {Math.max(1, Math.round((totalStages - currentStageNumber) * 0.5))} мин
          </span>
        </p>
      </div>
    </div>
  );
}
