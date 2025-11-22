'use client';

import { useState, useRef } from 'react';
import { AnalysisStageCard } from './AnalysisStageCard';
import { AnalysisProgressIndicator } from './AnalysisProgressIndicator';
import { Sparkles, AlertCircle, Download, FileText } from 'lucide-react';
import type { AnalysisResults as AnalysisResultsType } from '@/types';

interface AnalysisResultsProps {
  ideaId: number;
  initialResults?: AnalysisResultsType;
}

const STAGE_CONFIG = [
  {
    key: 'market',
    name: 'Market Analysis',
    title: 'Анализ рынка',
    icon: '📊',
  },
  {
    key: 'demand',
    name: 'Demand Analysis',
    title: 'Анализ спроса и болей',
    icon: '🎯',
  },
  {
    key: 'communities',
    name: 'Communities',
    title: 'Сообщества и инфлюенсеры',
    icon: '👥',
  },
  {
    key: 'competition',
    name: 'Competitive Analysis',
    title: 'Конкурентный анализ',
    icon: '⚔️',
  },
  {
    key: 'forecast',
    name: 'Market Forecast',
    title: 'Прогноз развития рынка',
    icon: '🔮',
  },
  {
    key: 'gtm',
    name: 'GTM Strategy',
    title: 'Go-to-Market стратегия',
    icon: '🚀',
  },
  {
    key: 'tech',
    name: 'Technical Feasibility',
    title: 'Техническая реализуемость',
    icon: '⚙️',
  },
  {
    key: 'customers',
    name: 'Customer Psychology',
    title: 'Психология клиентов',
    icon: '🧠',
  },
] as const;

export function AnalysisResults({ ideaId, initialResults }: AnalysisResultsProps) {
  const [results, setResults] = useState<AnalysisResultsType | undefined>(initialResults);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Progress state
  const [currentStage, setCurrentStage] = useState<string | undefined>();
  const [currentStageNumber, setCurrentStageNumber] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);

  const handleExportMarkdown = () => {
    window.open(`/api/export/markdown?ideaId=${ideaId}`, '_blank');
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setCurrentStage(undefined);
    setCurrentStageNumber(0);
    setProgressMessage('Initializing...');
    setCompletedStages([]);

    try {
      // Create EventSource for SSE
      const eventSource = new EventSource(
        `/api/analyze/stream?ideaId=${ideaId}`,
        { withCredentials: false }
      );

      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'progress':
              setCurrentStage(data.stage);
              setCurrentStageNumber(data.stageNumber || 0);
              setProgress(data.progress || 0);
              setProgressMessage(data.message || '');
              break;

            case 'stage_complete':
              setCompletedStages((prev) => [...prev, data.stage]);
              break;

            case 'complete':
              setResults(data.data.stages);
              setProgress(100);
              setIsAnalyzing(false);
              eventSource.close();
              break;

            case 'error':
              setError(data.error || 'Analysis failed');
              setIsAnalyzing(false);
              eventSource.close();
              break;
          }
        } catch (err) {
          console.error('Failed to parse SSE message:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('EventSource error:', err);
        setError('Connection lost. Please try again.');
        setIsAnalyzing(false);
        eventSource.close();
      };
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start analysis');
      setIsAnalyzing(false);
    }
  };

  // No results yet - show start button
  if (!results && !isAnalyzing) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <Sparkles className="w-16 h-16 mx-auto text-[var(--accent-purple)] mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Комплексный анализ идеи
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto mb-6">
            Запустите глубокий анализ бизнес-идеи через 8 последовательных этапов.
            Система соберет информацию из 200+ источников и создаст детальный отчет.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            {STAGE_CONFIG.map((stage, idx) => (
              <div
                key={stage.key}
                className="bg-[var(--border)] rounded-lg p-4 text-center"
              >
                <div className="text-3xl mb-2">{stage.icon}</div>
                <div className="text-xs text-gray-400">Этап {idx + 1}</div>
                <div className="text-sm text-white font-medium mt-1">
                  {stage.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartAnalysis}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--accent-purple)] to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          Запустить анализ (~5 минут)
        </button>

        {error && (
          <div className="mt-6 max-w-md mx-auto bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <div className="font-semibold text-red-400 mb-1">Ошибка анализа</div>
              <div className="text-sm text-red-300">{error}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Analysis in progress
  if (isAnalyzing) {
    return (
      <div className="py-16">
        <AnalysisProgressIndicator
          currentStage={currentStage}
          currentStageNumber={currentStageNumber}
          totalStages={8}
          progress={progress}
          message={progressMessage}
          completedStages={completedStages}
        />
      </div>
    );
  }

  // Results available
  const availableStages = STAGE_CONFIG.filter(
    (stage) => results && results[stage.key as keyof AnalysisResultsType]
  );

  const totalSources = availableStages.reduce((sum, stage) => {
    const stageResult = results![stage.key as keyof AnalysisResultsType];
    return sum + (stageResult?.citations?.length || 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header with stats */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-[var(--accent-purple)]/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Результаты анализа
            </h2>
            <p className="text-[var(--text-secondary)]">
              Комплексное исследование бизнес-идеи в 8 этапах
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {/* Export Button */}
            <button
              onClick={handleExportMarkdown}
              className="inline-flex items-center gap-2 bg-[var(--border)] hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              title="Export as Markdown"
            >
              <Download className="w-4 h-4" />
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Export MD</span>
            </button>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-gold)]">
                  {availableStages.length}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Этапов
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-purple)]">
                  {totalSources}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Источников
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage cards */}
      <div className="space-y-6">
        {STAGE_CONFIG.map((stage, idx) => {
          const stageResult = results![stage.key as keyof AnalysisResultsType];

          if (!stageResult) return null;

          return (
            <AnalysisStageCard
              key={stage.key}
              stageName={stage.name}
              stageTitle={stage.title}
              stageIcon={stage.icon}
              result={stageResult}
              index={idx + 1}
            />
          );
        })}
      </div>

      {/* Retry button if needed */}
      {availableStages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[var(--text-secondary)] mb-4">
            Не удалось загрузить результаты анализа
          </p>
          <button
            onClick={handleStartAnalysis}
            className="inline-flex items-center gap-2 bg-[var(--accent-purple)] hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Повторить анализ
          </button>
        </div>
      )}
    </div>
  );
}
