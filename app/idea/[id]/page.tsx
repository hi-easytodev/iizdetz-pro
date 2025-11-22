import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { AnalysisResults } from '@/components/AnalysisResults';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface IdeaPageProps {
  params: { id: string };
}

export default async function IdeaDetailPage({ params }: IdeaPageProps) {
  const ideaId = parseInt(params.id, 10);

  if (isNaN(ideaId)) {
    notFound();
  }

  // Fetch idea from database
  const idea = await db.getIdeaById(ideaId);

  if (!idea) {
    notFound();
  }

  // Try to fetch existing analysis results
  let initialResults = undefined;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analyze?ideaId=${ideaId}`,
      { cache: 'no-store' }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.stages) {
        initialResults = data.stages;
      }
    }
  } catch (error) {
    console.error('Failed to fetch initial analysis results:', error);
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к идеям
        </Link>

        {/* Idea header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.category?.map((cat: string, i: number) => (
              <span
                key={i}
                className="bg-[var(--border)] text-gray-300 text-xs px-3 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{idea.title}</h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-4xl">
            {idea.description}
          </p>

          <div className="flex items-center gap-6 mt-6 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="text-orange-400">📊</span>
              <span>Score: {idea.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🔗</span>
              <a
                href={idea.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-purple)] transition-colors"
              >
                Источник: {idea.source}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  idea.status === 'published'
                    ? 'bg-green-900/30 text-green-400'
                    : idea.status === 'analyzing'
                    ? 'bg-yellow-900/30 text-yellow-400'
                    : idea.status === 'failed'
                    ? 'bg-red-900/30 text-red-400'
                    : 'bg-gray-900/30 text-gray-400'
                }`}
              >
                {idea.status}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-[var(--border)] mb-8" />

        {/* Analysis Results */}
        <AnalysisResults ideaId={ideaId} initialResults={initialResults} />
      </div>
    </div>
  );
}
