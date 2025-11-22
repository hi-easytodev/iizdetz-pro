'use client';

import { useState } from 'react';
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ResearchPreset = 'all' | 'idea_discovery' | 'market_analysis' | 'competitor';

interface ResearchProgress {
  status: 'idle' | 'researching' | 'success' | 'error';
  message: string;
  results?: {
    analysis: string;
    citations: string[];
    relatedQuestions: string[];
  };
}

interface CustomNicheResearchProps {
  onResearchComplete?: (niche: string, results: any) => void;
}

export function CustomNicheResearch({ onResearchComplete }: CustomNicheResearchProps) {
  const [niche, setNiche] = useState('');
  const [preset, setPreset] = useState<ResearchPreset>('idea_discovery');
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState<ResearchProgress>({
    status: 'idle',
    message: '',
  });

  const handleResearch = async () => {
    if (!niche.trim()) {
      alert('Please enter a niche name');
      return;
    }

    setProgress({
      status: 'researching',
      message: 'Launching Deep Research across all sources...',
    });

    try {
      const response = await fetch('/api/research/niche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, preset }),
      });

      if (!response.ok) {
        throw new Error('Research failed');
      }

      const results = await response.json();

      setProgress({
        status: 'success',
        message: 'Research completed successfully!',
        results,
      });

      onResearchComplete?.(niche, results);
    } catch (error) {
      setProgress({
        status: 'error',
        message: 'Failed to complete research. Please try again.',
      });
    }
  };

  return (
    <div className="w-full">
      {/* Trigger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all group shadow-lg hover:shadow-purple-500/50"
      >
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
        <span className="text-white font-semibold">Research New Niche</span>
        <TrendingUp className="w-5 h-5 text-white" />
      </button>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="mt-4 p-6 rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-400" />
            Discover Ideas in Any Niche
          </h3>

          {/* Niche Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter Niche Name
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Pet Tech, AgriTech, LegalTech, Gaming..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              disabled={progress.status === 'researching'}
            />
            <p className="mt-2 text-xs text-gray-500">
              AI will search YouTube, Reddit, Twitter, forums, reviews, and news for ideas
            </p>
          </div>

          {/* Research Preset Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Research Focus
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPreset('idea_discovery')}
                disabled={progress.status === 'researching'}
                className={`p-3 rounded-lg border transition-all text-left ${
                  preset === 'idea_discovery'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-sm">Idea Discovery</div>
                <div className="text-xs mt-1 opacity-80">
                  Reddit, forums, YouTube, reviews
                </div>
              </button>
              <button
                onClick={() => setPreset('market_analysis')}
                disabled={progress.status === 'researching'}
                className={`p-3 rounded-lg border transition-all text-left ${
                  preset === 'market_analysis'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-sm">Market Analysis</div>
                <div className="text-xs mt-1 opacity-80">
                  News, Crunchbase, analytics
                </div>
              </button>
              <button
                onClick={() => setPreset('competitor')}
                disabled={progress.status === 'researching'}
                className={`p-3 rounded-lg border transition-all text-left ${
                  preset === 'competitor'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-sm">Competitors</div>
                <div className="text-xs mt-1 opacity-80">
                  G2, Product Hunt, reviews
                </div>
              </button>
              <button
                onClick={() => setPreset('all')}
                disabled={progress.status === 'researching'}
                className={`p-3 rounded-lg border transition-all text-left ${
                  preset === 'all'
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-sm">All Sources</div>
                <div className="text-xs mt-1 opacity-80">
                  Maximum coverage
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleResearch}
              disabled={progress.status === 'researching' || !niche.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {progress.status === 'researching' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Start Deep Research
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="outline"
              disabled={progress.status === 'researching'}
            >
              Cancel
            </Button>
          </div>

          {/* Progress Status */}
          {progress.status !== 'idle' && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                progress.status === 'researching'
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : progress.status === 'success'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              {progress.status === 'researching' && (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
              )}
              {progress.status === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              )}
              {progress.status === 'error' && (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    progress.status === 'researching'
                      ? 'text-blue-300'
                      : progress.status === 'success'
                      ? 'text-green-300'
                      : 'text-red-300'
                  }`}
                >
                  {progress.message}
                </div>
                {progress.status === 'researching' && (
                  <div className="mt-2 text-sm text-gray-400">
                    Searching across YouTube, Telegram, Reddit, forums, social media, reviews...
                  </div>
                )}
                {progress.status === 'success' && progress.results && (
                  <div className="mt-3 space-y-2">
                    <div className="text-sm text-gray-300">
                      Found {progress.results.citations.length} sources
                    </div>
                    <Button
                      onClick={() => {
                        setIsExpanded(false);
                        setProgress({ status: 'idle', message: '' });
                        setNiche('');
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      View Results
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
