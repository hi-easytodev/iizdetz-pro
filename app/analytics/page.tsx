'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/analytics/StatCard';
import { TrendChart } from '@/components/analytics/TrendChart';
import { DistributionChart } from '@/components/analytics/DistributionChart';
import { Lightbulb, FileText, Users, TrendingUp, Loader2 } from 'lucide-react';

interface AnalyticsData {
  totals: {
    total_ideas: string;
    total_analyses: string;
    total_users: string;
    completed_runs: string;
  };
  distribution: {
    sources: Array<{ source: string; count: string }>;
    categories: Array<{ category: string; count: string }>;
    statuses: Array<{ status: string; count: string }>;
  };
  trends: {
    daily: Array<{ date: string; count: string }>;
  };
  topIdeas: Array<{
    id: number;
    title: string;
    source: string;
    score: number;
    analysis_count: string;
  }>;
  recentAnalyses: Array<{
    id: number;
    stage: string;
    idea_title: string;
    created_at: string;
  }>;
  topUsers: Array<{
    id: number;
    name: string;
    email: string;
    ideas_analyzed: string;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">⚠️ {error || 'Failed to load analytics'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-[var(--text-secondary)]">
            Track your idea analysis performance and trends
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Ideas"
            value={Number(data.totals.total_ideas).toLocaleString()}
            icon={Lightbulb}
            color="purple"
          />
          <StatCard
            title="Analyses Completed"
            value={Number(data.totals.total_analyses).toLocaleString()}
            icon={FileText}
            color="pink"
          />
          <StatCard
            title="Registered Users"
            value={Number(data.totals.total_users).toLocaleString()}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Successful Runs"
            value={Number(data.totals.completed_runs).toLocaleString()}
            icon={TrendingUp}
            color="green"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendChart
            data={data.trends.daily.map((d) => ({
              date: d.date,
              count: Number(d.count),
            }))}
            title="Ideas Collected (Last 30 Days)"
            color="#8B5CF6"
          />

          <DistributionChart
            data={data.distribution.sources.map((s) => ({
              name: s.source,
              count: Number(s.count),
            }))}
            title="Ideas by Source"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DistributionChart
            data={data.distribution.categories.map((c) => ({
              name: c.category,
              count: Number(c.count),
            }))}
            title="Top Categories"
          />

          <DistributionChart
            data={data.distribution.statuses.map((s) => ({
              name: s.status,
              count: Number(s.count),
            }))}
            title="Ideas by Status"
            colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444']}
          />
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Ideas */}
          <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              🔥 Top Ideas by Score
            </h3>
            <div className="space-y-3">
              {data.topIdeas.slice(0, 5).map((idea) => (
                <div
                  key={idea.id}
                  className="p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)] line-clamp-1">
                        {idea.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[var(--text-secondary)]">
                          {idea.source}
                        </span>
                        <span className="text-xs text-purple-500">
                          {idea.analysis_count} analyses
                        </span>
                      </div>
                    </div>
                    <div className="ml-3 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded">
                      {idea.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              👥 Most Active Users
            </h3>
            <div className="space-y-3">
              {data.topUsers.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className="p-3 bg-[var(--bg-primary)] rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {user.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-500">
                        {user.ideas_analyzed}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">ideas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            📊 Recent Analyses
          </h3>
          <div className="space-y-2">
            {data.recentAnalyses.slice(0, 10).map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-2 hover:bg-purple-500/5 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <span className="text-sm text-[var(--text-primary)]">
                    {analysis.idea_title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-600 rounded">
                    {analysis.stage}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
