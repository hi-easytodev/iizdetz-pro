import { NextRequest, NextResponse } from 'next/server';
import { deepResearch } from '@/lib/ai/perplexity';

export const runtime = 'edge';
export const maxDuration = 60; // 60 seconds for Deep Research

type ResearchPreset = 'all' | 'idea_discovery' | 'market_analysis' | 'competitor';

interface ResearchRequest {
  niche: string;
  preset?: ResearchPreset;
}

/**
 * POST /api/research/niche
 *
 * Запускает Deep Research для указанной ниши
 *
 * Body:
 * {
 *   "niche": "Pet Tech",
 *   "preset": "idea_discovery" (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: ResearchRequest = await request.json();
    const { niche, preset = 'idea_discovery' } = body;

    if (!niche || typeof niche !== 'string' || niche.trim().length === 0) {
      return NextResponse.json(
        { error: 'Niche name is required' },
        { status: 400 }
      );
    }

    // Validate preset
    const validPresets: ResearchPreset[] = ['all', 'idea_discovery', 'market_analysis', 'competitor'];
    if (preset && !validPresets.includes(preset)) {
      return NextResponse.json(
        { error: 'Invalid preset. Must be one of: all, idea_discovery, market_analysis, competitor' },
        { status: 400 }
      );
    }

    // Формируем промпт для Deep Research
    const researchPrompt = `
Discover and analyze business ideas and startup opportunities in the ${niche} niche.

Focus on:
1. **Emerging Trends** - What's gaining traction in ${niche}?
2. **Pain Points** - What problems are people actively discussing?
3. **Gaps in Solutions** - Where are existing products falling short?
4. **Market Opportunities** - What validated needs exist with weak competition?
5. **US Market Focus** - Prioritize opportunities in the United States market

Analyze discussions from:
- Reddit (r/Entrepreneur, r/startups, r/SaaS, niche-specific subreddits)
- YouTube (comments, channel discussions, pain points mentioned)
- Twitter/X (#buildinpublic, startup discussions, industry experts)
- Product Hunt (trending products, user feedback)
- Forums (Hacker News, Quora, Stack Overflow, industry forums)
- Reviews (G2, Capterra, App Store, Play Store - identify gaps and complaints)

Provide:
1. **Top 3-5 validated business ideas** in ${niche}
2. **Evidence** from real discussions/sources
3. **Market size estimates** (if available)
4. **Competition analysis** (who's solving this, gaps)
5. **Quick validation tips** (how to test these ideas)
`;

    // Запускаем Deep Research
    const results = await deepResearch(researchPrompt, {
      preset: preset as any,
      searchRecency: 'month', // Последний месяц для актуальности
    });

    // Возвращаем результаты
    return NextResponse.json({
      niche,
      preset,
      analysis: results.analysis,
      citations: results.citations,
      relatedQuestions: results.relatedQuestions,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Deep Research error:', error);

    return NextResponse.json(
      {
        error: 'Failed to complete research',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
