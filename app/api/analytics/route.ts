import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics
 *
 * Returns comprehensive analytics and metrics:
 * - Total ideas, analyses, users
 * - Ideas by source, category, status
 * - Trend data (last 30 days)
 * - Top performing ideas
 * - User engagement metrics
 */
export async function GET() {
  try {
    // Run all analytics queries in parallel
    const [
      totals,
      sourceDistribution,
      categoryDistribution,
      statusDistribution,
      trendData,
      topIdeas,
      recentAnalyses,
      userStats,
    ] = await Promise.all([
      // Total counts
      query(`
        SELECT
          (SELECT COUNT(*) FROM ideas) as total_ideas,
          (SELECT COUNT(*) FROM analyses) as total_analyses,
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM pipeline_runs WHERE status = 'completed') as completed_runs
      `),

      // Ideas by source
      query(`
        SELECT source, COUNT(*) as count
        FROM ideas
        GROUP BY source
        ORDER BY count DESC
      `),

      // Ideas by category (flatten array and count)
      query(`
        SELECT
          unnest(category) as category,
          COUNT(*) as count
        FROM ideas
        WHERE category IS NOT NULL AND array_length(category, 1) > 0
        GROUP BY category
        ORDER BY count DESC
        LIMIT 10
      `),

      // Ideas by status
      query(`
        SELECT status, COUNT(*) as count
        FROM ideas
        GROUP BY status
        ORDER BY count DESC
      `),

      // Trend data (last 30 days)
      query(`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM ideas
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `),

      // Top ideas by score
      query(`
        SELECT id, title, source, score, category,
               (SELECT COUNT(*) FROM analyses WHERE idea_id = ideas.id) as analysis_count
        FROM ideas
        ORDER BY score DESC
        LIMIT 10
      `),

      // Recent analyses
      query(`
        SELECT
          a.id,
          a.stage,
          a.created_at,
          i.title as idea_title,
          i.id as idea_id
        FROM analyses a
        JOIN ideas i ON a.idea_id = i.id
        ORDER BY a.created_at DESC
        LIMIT 20
      `),

      // User engagement stats
      query(`
        SELECT
          u.id,
          u.name,
          u.email,
          COUNT(DISTINCT i.id) as ideas_analyzed,
          u.created_at as joined_at
        FROM users u
        LEFT JOIN ideas i ON i.user_id = u.id
        GROUP BY u.id, u.name, u.email, u.created_at
        ORDER BY ideas_analyzed DESC
        LIMIT 10
      `),
    ]);

    const analytics = {
      totals: totals.rows[0],
      distribution: {
        sources: sourceDistribution.rows,
        categories: categoryDistribution.rows,
        statuses: statusDistribution.rows,
      },
      trends: {
        daily: trendData.rows,
      },
      topIdeas: topIdeas.rows,
      recentAnalyses: recentAnalyses.rows,
      topUsers: userStats.rows,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('[Analytics] Error fetching analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
