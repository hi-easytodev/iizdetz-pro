'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, ExternalLink, Sparkles } from 'lucide-react';
import type { StageResult } from '@/types';

interface AnalysisStageCardProps {
  stageName: string;
  stageTitle: string;
  stageIcon: string;
  result: StageResult;
  index: number;
}

export function AnalysisStageCard({
  stageName,
  stageTitle,
  stageIcon,
  result,
  index,
}: AnalysisStageCardProps) {
  const [showCitations, setShowCitations] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  return (
    <Card className="relative overflow-hidden border-[var(--border)] hover:border-[var(--accent-purple)] transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl">{stageIcon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[var(--accent-gold)] font-bold text-sm">
                ЭТАП {index}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {stageName}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{stageTitle}</h3>
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                {result.citations.length} источников
              </span>
              {result.relatedQuestions?.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {result.relatedQuestions.length} связанных вопросов
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Content */}
        <div className="prose prose-invert max-w-none mb-6">
          <div className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
            {result.analysis}
          </div>
        </div>

        {/* Citations Section */}
        {result.citations.length > 0 && (
          <div className="border-t border-[var(--border)] pt-4 mb-4">
            <button
              onClick={() => setShowCitations(!showCitations)}
              className="flex items-center justify-between w-full text-left mb-2 hover:text-[var(--accent-purple)] transition-colors"
            >
              <span className="font-semibold text-white flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Источники ({result.citations.length})
              </span>
              {showCitations ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {showCitations && (
              <div className="space-y-2 mt-3">
                {result.citations.map((citation, idx) => (
                  <a
                    key={idx}
                    href={citation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-[var(--accent-purple)] hover:text-[var(--accent-gold)] transition-colors break-all"
                  >
                    [{idx + 1}] {citation}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Questions Section */}
        {result.relatedQuestions?.length > 0 && (
          <div className="border-t border-[var(--border)] pt-4">
            <button
              onClick={() => setShowQuestions(!showQuestions)}
              className="flex items-center justify-between w-full text-left mb-2 hover:text-[var(--accent-purple)] transition-colors"
            >
              <span className="font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Связанные вопросы ({result.relatedQuestions.length})
              </span>
              {showQuestions ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {showQuestions && (
              <ul className="space-y-2 mt-3 list-disc list-inside">
                {result.relatedQuestions.map((question, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  >
                    {question}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
    </Card>
  );
}
