import { NextRequest, NextResponse } from 'next/server';
import { collectIdeas, deduplicateIdeas, scoreIdeas, type ScrapedIdea } from '@/lib/scraper';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const maxDuration = 60; // 1 minute timeout

/**
 * Vercel Cron Job Endpoint
 *
 * Automatically collects business ideas from various sources
 * Runs daily via Vercel Cron
 *
 * Security: Only accessible via Vercel Cron (checks Authorization header)
 */
export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');

  if (process.env.NODE_ENV === 'production') {
    // In production, verify the cron secret
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  console.log('[Cron] Starting idea collection job...');

  try {
    // Step 1: Collect ideas from all sources
    const ideas = await collectIdeas();

    // Step 2: Deduplicate ideas
    const uniqueIdeas = deduplicateIdeas(ideas);

    // Step 3: Score and rank ideas
    const scoredIdeas = scoreIdeas(uniqueIdeas);

    // Step 4: Save to database
    let savedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const idea of scoredIdeas) {
      try {
        // Check if idea already exists (by source URL)
        const existing = await query(
          'SELECT id FROM ideas WHERE source_url = $1',
          [idea.sourceUrl]
        );

        if (existing.rows.length > 0) {
          skippedCount++;
          continue;
        }

        // Calculate score based on metadata
        const score =
          (idea.metadata?.upvotes || 0) * 1 +
          (idea.metadata?.comments || 0) * 2;

        // Insert new idea
        await query(
          `INSERT INTO ideas (
            title,
            description,
            source_url,
            category,
            score,
            status,
            created_at,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [
            idea.title,
            idea.description,
            idea.sourceUrl,
            idea.categories,
            score,
            'pending', // New ideas start as pending
          ]
        );

        savedCount++;
      } catch (error) {
        const errorMsg = `Failed to save idea "${idea.title}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        errors.push(errorMsg);
        console.error('[Cron]', errorMsg);
      }
    }

    // Step 5: Return summary
    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        collected: ideas.length,
        unique: uniqueIdeas.length,
        saved: savedCount,
        skipped: skippedCount,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('[Cron] Job completed:', summary);

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error('[Cron] Job failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger endpoint (for testing)
 * POST /api/cron/collect-ideas
 */
export async function POST(request: NextRequest) {
  // Allow manual triggers in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Manual triggers only available in development' },
      { status: 403 }
    );
  }

  return GET(request);
}
