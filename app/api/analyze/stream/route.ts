import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { runAnalysisPipeline, type PipelineContext } from '@/lib/ai/pipeline';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

interface ProgressEvent {
  type: 'progress' | 'stage_complete' | 'complete' | 'error';
  stage?: string;
  stageNumber?: number;
  totalStages?: number;
  progress?: number;
  message?: string;
  data?: any;
  error?: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { ideaId } = body;

  if (!ideaId) {
    return new Response(
      JSON.stringify({ error: 'ideaId is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Create a TransformStream for SSE
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Helper to send SSE events
  const sendEvent = async (event: ProgressEvent) => {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    await writer.write(encoder.encode(data));
  };

  // Start the pipeline in the background
  (async () => {
    try {
      // Get idea from database
      const ideaResult = await query(
        'SELECT id, title, description, category as categories, source_url, status FROM ideas WHERE id = $1',
        [ideaId]
      );

      if (ideaResult.rows.length === 0) {
        await sendEvent({
          type: 'error',
          error: `Idea with id ${ideaId} not found`,
        });
        await writer.close();
        return;
      }

      const idea = ideaResult.rows[0];

      // Update idea status to analyzing
      await query(
        'UPDATE ideas SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['analyzing', ideaId]
      );

      await sendEvent({
        type: 'progress',
        stage: 'initializing',
        stageNumber: 0,
        totalStages: 8,
        progress: 0,
        message: 'Initializing analysis pipeline...',
      });

      // Prepare pipeline context
      const context: PipelineContext = {
        ideaId: idea.id,
        title: idea.title,
        description: idea.description,
        categories: idea.categories || [],
        sourceUrl: idea.source_url,
        targetAudience: 'US market professionals',
      };

      // Progress callback
      const onProgress = async (stageName: string, stageNumber: number, totalStages: number) => {
        const progress = Math.round((stageNumber / totalStages) * 100);
        await sendEvent({
          type: 'progress',
          stage: stageName,
          stageNumber,
          totalStages,
          progress,
          message: `Analyzing stage ${stageNumber}/${totalStages}: ${stageName}`,
        });
      };

      // Stage complete callback
      const onStageComplete = async (stageName: string, stageNumber: number, result: any) => {
        await sendEvent({
          type: 'stage_complete',
          stage: stageName,
          stageNumber,
          totalStages: 8,
          progress: Math.round((stageNumber / 8) * 100),
          message: `Completed ${stageName}`,
          data: {
            citations: result.citations?.length || 0,
            relatedQuestions: result.relatedQuestions?.length || 0,
          },
        });
      };

      // Run the pipeline with callbacks
      const results = await runAnalysisPipeline(context, {
        onProgress,
        onStageComplete,
      });

      // Update idea status to published
      await query(
        'UPDATE ideas SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['published', ideaId]
      );

      // Calculate total sources
      const totalSources = Object.values(results).reduce(
        (sum, stage) => sum + (stage.citations?.length || 0),
        0
      );

      // Send completion event
      await sendEvent({
        type: 'complete',
        progress: 100,
        message: 'Analysis complete!',
        data: {
          ideaId,
          stages: results,
          totalSources,
          stageCount: Object.keys(results).length,
          completedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Pipeline error:', error);

      // Update idea status to failed
      await query(
        'UPDATE ideas SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['failed', ideaId]
      );

      await sendEvent({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Analysis failed',
      });
    } finally {
      await writer.close();
    }
  })();

  // Return SSE response
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
