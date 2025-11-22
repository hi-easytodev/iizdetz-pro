import { NextRequest, NextResponse } from 'next/server';
import { runAnalysisPipeline, getAnalysisResults, type PipelineContext } from '@/lib/ai/pipeline';
import { query } from '@/lib/db';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for full 8-stage analysis

interface AnalyzeRequest {
  ideaId: number;
}

/**
 * POST /api/analyze
 *
 * Run comprehensive 8-stage analysis for an idea
 *
 * Body:
 * {
 *   "ideaId": 123
 * }
 *
 * Returns:
 * {
 *   "success": true,
 *   "ideaId": 123,
 *   "stages": {
 *     "market": { analysis, citations, relatedQuestions },
 *     "demand": { ... },
 *     ...
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { ideaId } = body;

    if (!ideaId || typeof ideaId !== 'number') {
      return NextResponse.json(
        { error: 'ideaId is required and must be a number' },
        { status: 400 }
      );
    }

    // Get idea from database
    const ideaResult = await query<{
      id: number;
      title: string;
      description: string;
      categories: string[];
      source_url: string;
      target_audience: string;
      status: string;
    }>(
      'SELECT id, title, description, categories, source_url, target_audience, status FROM ideas WHERE id = $1',
      [ideaId]
    );

    if (ideaResult.rows.length === 0) {
      return NextResponse.json(
        { error: `Idea #${ideaId} not found` },
        { status: 404 }
      );
    }

    const idea = ideaResult.rows[0];

    // Check if analysis already exists
    const existingAnalysis = await getAnalysisResults(ideaId);
    if (existingAnalysis && Object.keys(existingAnalysis).length === 8) {
      return NextResponse.json({
        success: true,
        ideaId,
        message: 'Analysis already exists',
        stages: existingAnalysis,
      });
    }

    // Update idea status to "analyzing"
    await query(
      'UPDATE ideas SET status = $1, analysis_started_at = NOW() WHERE id = $2',
      ['analyzing', ideaId]
    );

    // Prepare pipeline context
    const context: PipelineContext = {
      ideaId: idea.id,
      title: idea.title,
      description: idea.description,
      categories: idea.categories,
      sourceUrl: idea.source_url,
      targetAudience: idea.target_audience || 'US market professionals',
    };

    // Run the pipeline
    const results = await runAnalysisPipeline(context);

    return NextResponse.json({
      success: true,
      ideaId,
      stages: results,
      totalSources: Object.values(results).reduce(
        (sum, stage) => sum + stage.citations.length,
        0
      ),
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API /analyze] Error:', error);

    // Update idea status to "error"
    const body: AnalyzeRequest = await request.json().catch(() => ({ ideaId: null }));
    if (body.ideaId) {
      await query(
        'UPDATE ideas SET status = $1 WHERE id = $2',
        ['error', body.ideaId]
      ).catch(console.error);
    }

    return NextResponse.json(
      {
        error: 'Failed to complete analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze?ideaId=123
 *
 * Get existing analysis results for an idea
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ideaIdParam = searchParams.get('ideaId');

    if (!ideaIdParam) {
      return NextResponse.json(
        { error: 'ideaId query parameter is required' },
        { status: 400 }
      );
    }

    const ideaId = parseInt(ideaIdParam, 10);
    if (isNaN(ideaId)) {
      return NextResponse.json(
        { error: 'ideaId must be a valid number' },
        { status: 400 }
      );
    }

    const results = await getAnalysisResults(ideaId);

    if (!results) {
      return NextResponse.json(
        { error: `No analysis found for idea #${ideaId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ideaId,
      stages: results,
      stageCount: Object.keys(results).length,
      totalSources: Object.values(results).reduce(
        (sum, stage) => sum + stage.citations.length,
        0
      ),
    });
  } catch (error) {
    console.error('[API /analyze GET] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
