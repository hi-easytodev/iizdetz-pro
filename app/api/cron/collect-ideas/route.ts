import { NextRequest, NextResponse } from 'next/server';
import { collectIdeas, deduplicateIdeas, scoreIdeas, type ScrapedIdea } from '@/lib/scraper';
import { query } from '@/lib/db';
import { sendNewIdeasEmail } from '@/lib/email/resend';

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

    // Step 5: Send email notifications to subscribed users
    let emailsSent = 0;
    if (savedCount > 0) {
      try {
        // Get users who want daily notifications
        const usersResult = await query(
          `SELECT id, email, name FROM users
           WHERE email_notifications = true
             AND notification_frequency = 'daily'
             AND email IS NOT NULL`
        );

        const topIdeas = scoredIdeas.slice(0, 5).map((idea) => ({
          title: idea.title,
          description: idea.description.slice(0, 200),
          source: idea.source,
          score: (idea.metadata?.upvotes || 0) + (idea.metadata?.comments || 0) * 2,
          url: idea.sourceUrl,
        }));

        // Send emails in parallel
        const emailPromises = usersResult.rows.map(async (user: any) => {
          try {
            await sendNewIdeasEmail({
              to: user.email,
              userName: user.name || 'there',
              ideas: topIdeas,
              totalIdeas: savedCount,
            });

            // Log notification
            await query(
              `INSERT INTO email_notifications (user_id, email, type, ideas_count, status)
               VALUES ($1, $2, 'new_ideas', $3, 'sent')`,
              [user.id, user.email, savedCount]
            );

            emailsSent++;
          } catch (error) {
            console.error(`[Cron] Failed to send email to ${user.email}:`, error);
            // Log failed notification
            await query(
              `INSERT INTO email_notifications (user_id, email, type, ideas_count, status)
               VALUES ($1, $2, 'new_ideas', $3, 'failed')`,
              [user.id, user.email, savedCount]
            );
          }
        });

        await Promise.allSettled(emailPromises);
        console.log(`[Cron] Sent ${emailsSent} email notifications`);
      } catch (error) {
        console.error('[Cron] Error sending email notifications:', error);
      }
    }

    // Step 6: Return summary
    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        collected: ideas.length,
        unique: uniqueIdeas.length,
        saved: savedCount,
        skipped: skippedCount,
        errors: errors.length,
        emailsSent,
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
