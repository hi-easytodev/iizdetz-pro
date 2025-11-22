import fs from 'fs/promises';
import path from 'path';
import { deepResearch } from './perplexity';
import { query } from '@/lib/db';
import { extractStageSummary, createCondensedContext } from './extraction';
import type { StageSummary } from '@/types';

// ============================================
// PROMPT LOADER
// ============================================

const PROMPTS_DIR = path.join(process.cwd(), 'prompts');

/**
 * Load a prompt template from file
 */
export async function loadPrompt(stage: string): Promise<string> {
  const filename = `stage-${stage}.md`;
  const filepath = path.join(PROMPTS_DIR, filename);
  return await fs.readFile(filepath, 'utf-8');
}

/**
 * Fill prompt template with variables
 */
export function fillPrompt(
  template: string,
  vars: Record<string, string>
): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value || ''),
    template
  );
}

// ============================================
// PIPELINE ORCHESTRATOR
// ============================================

export interface PipelineContext {
  ideaId: number;
  title: string;
  description: string;
  categories: string[];
  sourceUrl?: string;
  targetAudience?: string;
}

export interface StageResult {
  stage: string;
  analysis: string;
  citations: string[];
  relatedQuestions: string[];
  completedAt: Date;
  summary?: StageSummary; // Structured extraction для context optimization
}

export interface PipelineCallbacks {
  onProgress?: (stageName: string, stageNumber: number, totalStages: number) => Promise<void> | void;
  onStageComplete?: (stageName: string, stageNumber: number, result: StageResult) => Promise<void> | void;
}

/**
 * Run comprehensive 8-stage analysis pipeline
 *
 * Each stage uses results from previous stages as context
 */
export async function runAnalysisPipeline(
  context: PipelineContext,
  callbacks?: PipelineCallbacks
): Promise<Record<string, StageResult>> {
  const results: Record<string, StageResult> = {};
  const summaries: StageSummary[] = []; // Collect structured summaries for context

  console.log(`[Pipeline] Starting analysis for idea #${context.ideaId}: "${context.title}"`);

  // ============================================
  // STAGE 1: MARKET ANALYSIS
  // ============================================
  console.log('[Stage 1/8] Analyzing market...');
  await callbacks?.onProgress?.('market', 1, 8);

  const stage1Template = await loadPrompt('1-market');
  const stage1Prompt = fillPrompt(stage1Template, {
    IDEA_TITLE: context.title,
    IDEA_DESCRIPTION: context.description,
    CATEGORIES: context.categories.join(', '),
    SOURCE_URL: context.sourceUrl || '',
    INDUSTRY: context.categories[0] || 'Technology',
  });

  const stage1Response = await deepResearch(stage1Prompt, {
    preset: 'market_analysis',
    searchRecency: 'month',
  });

  // Extract structured summary for next stages
  const marketSummary = await extractStageSummary('market', stage1Response.analysis);

  results.market = {
    stage: 'market',
    analysis: stage1Response.analysis,
    citations: stage1Response.citations,
    relatedQuestions: stage1Response.relatedQuestions,
    completedAt: new Date(),
    summary: marketSummary || undefined,
  };

  if (marketSummary) {
    summaries.push(marketSummary);
  }

  await saveStageResult(context.ideaId, 'market', results.market);
  await callbacks?.onStageComplete?.('market', 1, results.market);
  console.log(`[Stage 1/8] ✅ Market analysis complete (${stage1Response.citations.length} sources)`);

  // ============================================
  // STAGE 2: DEMAND ANALYSIS
  // ============================================
  console.log('[Stage 2/8] Analyzing demand and pain points...');
  await callbacks?.onProgress?.('demand', 2, 8);

  const stage2Template = await loadPrompt('2-demand');
  const stage2Prompt = fillPrompt(stage2Template, {
    IDEA_TITLE: context.title,
    TARGET_AUDIENCE: context.targetAudience || 'professionals in the US',
    PREVIOUS_CONTEXT: summaries.length > 0 ? createCondensedContext(summaries) : '',
  });

  const stage2Response = await deepResearch(stage2Prompt, {
    preset: 'idea_discovery',
    searchRecency: 'month',
  });

  // Extract structured summary for next stages
  const demandSummary = await extractStageSummary('demand', stage2Response.analysis);

  results.demand = {
    stage: 'demand',
    analysis: stage2Response.analysis,
    citations: stage2Response.citations,
    relatedQuestions: stage2Response.relatedQuestions,
    completedAt: new Date(),
    summary: demandSummary || undefined,
  };

  if (demandSummary) {
    summaries.push(demandSummary);
  }

  await saveStageResult(context.ideaId, 'demand', results.demand);
  await callbacks?.onStageComplete?.('demand', 2, results.demand);
  console.log(`[Stage 2/8] ✅ Demand analysis complete (${stage2Response.citations.length} sources)`);

  // ============================================
  // STAGE 3: COMMUNITIES
  // ============================================
  console.log('[Stage 3/8] Mapping communities and influencers...');
  await callbacks?.onProgress?.('communities', 3, 8);

  const stage3Template = await loadPrompt('3-communities');
  const stage3Prompt = fillPrompt(stage3Template, {
    IDEA_TITLE: context.title,
    PREVIOUS_CONTEXT: createCondensedContext(summaries),
  });

  const stage3Response = await deepResearch(stage3Prompt, {
    preset: 'idea_discovery',
    searchRecency: 'month',
  });

  const communitiesSummary = await extractStageSummary('communities', stage3Response.analysis);

  results.communities = {
    stage: 'communities',
    analysis: stage3Response.analysis,
    citations: stage3Response.citations,
    relatedQuestions: stage3Response.relatedQuestions,
    completedAt: new Date(),
    summary: communitiesSummary || undefined,
  };

  if (communitiesSummary) {
    summaries.push(communitiesSummary);
  }

  await saveStageResult(context.ideaId, 'communities', results.communities);
  await callbacks?.onStageComplete?.('communities', 3, results.communities);
  console.log(`[Stage 3/8] ✅ Communities mapped (${stage3Response.citations.length} sources)`);

  // ============================================
  // STAGE 4: COMPETITIVE ANALYSIS
  // ============================================
  console.log('[Stage 4/8] Analyzing competitors...');
  await callbacks?.onProgress?.('competition', 4, 8);

  const stage4Template = await loadPrompt('4-competition');
  const stage4Prompt = fillPrompt(stage4Template, {
    IDEA_TITLE: context.title,
    PREVIOUS_CONTEXT: createCondensedContext(summaries),
  });

  const stage4Response = await deepResearch(stage4Prompt, {
    preset: 'competitor',
    searchRecency: 'month',
  });

  const competitionSummary = await extractStageSummary('competition', stage4Response.analysis);

  results.competition = {
    stage: 'competition',
    analysis: stage4Response.analysis,
    citations: stage4Response.citations,
    relatedQuestions: stage4Response.relatedQuestions,
    completedAt: new Date(),
    summary: competitionSummary || undefined,
  };

  if (competitionSummary) {
    summaries.push(competitionSummary);
  }

  await saveStageResult(context.ideaId, 'competition', results.competition);
  await callbacks?.onStageComplete?.('competition', 4, results.competition);
  console.log(`[Stage 4/8] ✅ Competitive analysis complete (${stage4Response.citations.length} sources)`);

  // ============================================
  // STAGE 5: FORECAST
  // ============================================
  console.log('[Stage 5/8] Forecasting market evolution...');
  await callbacks?.onProgress?.('forecast', 5, 8);

  const stage5Template = await loadPrompt('5-forecast');
  const stage5Prompt = fillPrompt(stage5Template, {
    IDEA_TITLE: context.title,
    PREVIOUS_CONTEXT: createCondensedContext(summaries),
  });

  const stage5Response = await deepResearch(stage5Prompt, {
    preset: 'market_analysis',
    searchRecency: 'week',
  });

  const forecastSummary = await extractStageSummary('forecast', stage5Response.analysis);

  results.forecast = {
    stage: 'forecast',
    analysis: stage5Response.analysis,
    citations: stage5Response.citations,
    relatedQuestions: stage5Response.relatedQuestions,
    completedAt: new Date(),
    summary: forecastSummary || undefined,
  };

  if (forecastSummary) {
    summaries.push(forecastSummary);
  }

  await saveStageResult(context.ideaId, 'forecast', results.forecast);
  await callbacks?.onStageComplete?.('forecast', 5, results.forecast);
  console.log(`[Stage 5/8] ✅ Forecast complete (${stage5Response.citations.length} sources)`);

  // ============================================
  // STAGE 6: GTM STRATEGY
  // ============================================
  console.log('[Stage 6/8] Developing GTM strategy...');
  await callbacks?.onProgress?.('gtm', 6, 8);

  const stage6Template = await loadPrompt('6-gtm');
  const stage6Prompt = fillPrompt(stage6Template, {
    IDEA_TITLE: context.title,
    TARGET_AUDIENCE: context.targetAudience || 'US professionals',
    PREVIOUS_CONTEXT: createCondensedContext(summaries),
  });

  const stage6Response = await deepResearch(stage6Prompt, {
    preset: 'idea_discovery',
    searchRecency: 'month',
  });

  const gtmSummary = await extractStageSummary('gtm', stage6Response.analysis);

  results.gtm = {
    stage: 'gtm',
    analysis: stage6Response.analysis,
    citations: stage6Response.citations,
    relatedQuestions: stage6Response.relatedQuestions,
    completedAt: new Date(),
    summary: gtmSummary || undefined,
  };

  if (gtmSummary) {
    summaries.push(gtmSummary);
  }

  await saveStageResult(context.ideaId, 'gtm', results.gtm);
  await callbacks?.onStageComplete?.('gtm', 6, results.gtm);
  console.log(`[Stage 6/8] ✅ GTM strategy complete (${stage6Response.citations.length} sources)`);

  // ============================================
  // STAGE 7: TECHNICAL FEASIBILITY
  // ============================================
  console.log('[Stage 7/8] Assessing technical feasibility...');
  await callbacks?.onProgress?.('tech', 7, 8);

  const stage7Template = await loadPrompt('7-tech');
  const stage7Prompt = fillPrompt(stage7Template, {
    IDEA_TITLE: context.title,
    DESCRIPTION: context.description,
    PREVIOUS_CONTEXT: createCondensedContext(summaries),
  });

  const stage7Response = await deepResearch(stage7Prompt, {
    preset: 'all',
    searchRecency: 'month',
  });

  const techSummary = await extractStageSummary('tech', stage7Response.analysis);

  results.tech = {
    stage: 'tech',
    analysis: stage7Response.analysis,
    citations: stage7Response.citations,
    relatedQuestions: stage7Response.relatedQuestions,
    completedAt: new Date(),
    summary: techSummary || undefined,
  };

  if (techSummary) {
    summaries.push(techSummary);
  }

  await saveStageResult(context.ideaId, 'tech', results.tech);
  await callbacks?.onStageComplete?.('tech', 7, results.tech);
  console.log(`[Stage 7/8] ✅ Tech feasibility assessed (${stage7Response.citations.length} sources)`);

  // ============================================
  // STAGE 8: CUSTOMER INSIGHTS
  // ============================================
  console.log('[Stage 8/8] Analyzing customer psychology...');
  await callbacks?.onProgress?.('customers', 8, 8);

  const stage8Template = await loadPrompt('8-customers');
  const stage8Prompt = fillPrompt(stage8Template, {
    IDEA_TITLE: context.title,
    TARGET_AUDIENCE: context.targetAudience || 'US professionals',
    PREVIOUS_CONTEXT: createCondensedContext(summaries),
  });

  const stage8Response = await deepResearch(stage8Prompt, {
    preset: 'idea_discovery',
    searchRecency: 'month',
  });

  const customersSummary = await extractStageSummary('customers', stage8Response.analysis);

  results.customers = {
    stage: 'customers',
    analysis: stage8Response.analysis,
    citations: stage8Response.citations,
    relatedQuestions: stage8Response.relatedQuestions,
    completedAt: new Date(),
    summary: customersSummary || undefined,
  };

  // No need to push stage 8 summary (it's the last stage)

  await saveStageResult(context.ideaId, 'customers', results.customers);
  await callbacks?.onStageComplete?.('customers', 8, results.customers);
  console.log(`[Stage 8/8] ✅ Customer insights complete (${stage8Response.citations.length} sources)`);

  // ============================================
  // UPDATE IDEA STATUS
  // ============================================
  await query(
    'UPDATE ideas SET status = $1, analysis_completed_at = NOW() WHERE id = $2',
    ['analyzed', context.ideaId]
  );

  console.log(`[Pipeline] ✅ Complete analysis finished for idea #${context.ideaId}`);
  console.log(`[Pipeline] Total sources: ${Object.values(results).reduce((sum, r) => sum + r.citations.length, 0)}`);

  return results;
}

/**
 * Save stage result to database
 */
async function saveStageResult(
  ideaId: number,
  stage: string,
  result: StageResult
): Promise<void> {
  await query(
    `INSERT INTO analyses (idea_id, stage, content, citations, related_questions, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (idea_id, stage)
     DO UPDATE SET content = $3, citations = $4, related_questions = $5, updated_at = NOW()`,
    [
      ideaId,
      stage,
      result.analysis,
      JSON.stringify(result.citations),
      JSON.stringify(result.relatedQuestions),
    ]
  );
}

/**
 * Get analysis results for an idea
 */
export async function getAnalysisResults(
  ideaId: number
): Promise<Record<string, StageResult> | null> {
  const dbResults = await query<{
    stage: string;
    content: string;
    citations: string;
    related_questions: string;
    created_at: Date;
  }>(
    'SELECT stage, content, citations, related_questions, created_at FROM analyses WHERE idea_id = $1',
    [ideaId]
  );

  if (dbResults.rows.length === 0) {
    return null;
  }

  const results: Record<string, StageResult> = {};

  for (const row of dbResults.rows) {
    results[row.stage] = {
      stage: row.stage,
      analysis: row.content,
      citations: JSON.parse(row.citations),
      relatedQuestions: JSON.parse(row.related_questions),
      completedAt: row.created_at,
    };
  }

  return results;
}
