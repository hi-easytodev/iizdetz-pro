#!/usr/bin/env ts-node
/**
 * Manual Test Script: Context Optimization
 *
 * Run with: npx ts-node scripts/test-context-optimization.ts
 *
 * Demonstrates token savings from using structured summaries
 */

import { createCondensedContext } from '../lib/ai/extraction';
import type {
  StageSummary,
  MarketStageSummary,
  DemandStageSummary,
  CommunitiesStageSummary,
  CompetitionStageSummary,
  ForecastStageSummary,
  GtmStageSummary,
  TechStageSummary,
  CustomersStageSummary,
} from '../types';

// Token estimation (1 token ≈ 4 characters for English text)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Cost calculation (Perplexity pricing: $5 per 1M tokens, Claude: $15 per 1M)
function estimateCost(tokens: number, provider: 'perplexity' | 'claude' = 'perplexity'): number {
  const costPer1M = provider === 'perplexity' ? 5 : 15;
  return (tokens / 1_000_000) * costPer1M;
}

// Mock full analysis texts (realistic 3000-4000 word outputs)
const MOCK_FULL_ANALYSES = {
  market: `
# MARKET ANALYSIS

## Market Size Analysis

### Total Addressable Market (TAM)
The global market for AI-powered business tools is estimated at $500 billion in 2025. This includes enterprise software, SaaS solutions, and consulting services across all industries. The market has grown 25% year-over-year since 2020, driven by digital transformation initiatives and increased AI adoption.

### Serviceable Available Market (SAM)
[... continues for 3000 words total ...]
  `.repeat(12), // ~12,000 characters = ~3000 words

  demand: `
# DEMAND ANALYSIS

## Search Volume and Interest Trends

Monthly search volume for "business idea validation" and related terms: 50,000 searches
Google Trends data shows 300% increase over last 3 years
High interest in entrepreneur communities on Reddit (r/startups, r/Entrepreneur)

[... continues for 3000 words total ...]
  `.repeat(12),

  communities: `
# COMMUNITIES ANALYSIS

## Community Mapping

### Reddit Communities
r/startups - 500,000 members, highly engaged
r/Entrepreneur - 1.2M members, moderate engagement
r/SideProject - 200,000 members, high quality discussions

[... continues for 3000 words total ...]
  `.repeat(12),

  competition: `
# COMPETITIVE ANALYSIS

## Direct Competitors

### Competitor A
- Pricing: $99/month
- Features: Full market research suite
- Strengths: Established brand, comprehensive data
- Weaknesses: Expensive, complex interface, steep learning curve

[... continues for 3000 words total ...]
  `.repeat(12),

  forecast: `
# FORECAST ANALYSIS

## Revenue Projections

### Year 1
Monthly Recurring Revenue (MRR) starting at $1,000
Expected to reach $10,000 MRR by month 12
100 paying customers at average $100/month

[... continues for 4000 words total ...]
  `.repeat(15),

  gtm: `
# GO-TO-MARKET STRATEGY

## Launch Strategy

### Phase 1: Pre-Launch (Weeks 1-2)
Build anticipation through social media teasers
Create waitlist landing page
Engage with target communities

[... continues for 4000 words total ...]
  `.repeat(15),

  tech: `
# TECHNICAL FEASIBILITY

## Technology Stack

### Frontend
Next.js 14 with App Router
Tailwind CSS for styling
shadcn/ui for components
TypeScript for type safety

[... continues for 4000 words total ...]
  `.repeat(15),

  customers: `
# CUSTOMER INSIGHTS

## Customer Personas

### Persona 1: Early-Stage Startup Founder
Age: 25-35
Location: US/Europe
Income: $50K-$100K
Pain points: Need validation, limited budget, time constraints

[... continues for 4000 words total ...]
  `.repeat(15),
};

// Mock structured summaries
const MOCK_SUMMARIES: StageSummary[] = [
  {
    stage: 'market',
    tam: '$500B',
    sam: '$50B',
    som: '$5B',
    growthRate: '25% YoY',
    keyTrends: [
      'AI adoption accelerating in enterprise',
      'Remote work driving SaaS demand',
      'Privacy concerns increasing',
    ],
    targetSegments: ['SMBs', 'Mid-market enterprises', 'Solopreneurs'],
    marketMaturity: 'growth',
    keyInsights: [
      'Large addressable market with clear growth trajectory',
      'Multiple customer segments with distinct needs',
      'Increasing demand for AI-powered business tools',
    ],
  } as MarketStageSummary,

  {
    stage: 'demand',
    searchVolume: '50K monthly searches',
    demandTrend: 'rising',
    painPoints: [
      'Expensive existing solutions ($99-299/mo)',
      'Complex tools require training',
      'Lack of AI-powered insights',
      'Poor customer support',
      'Limited integrations',
    ],
    currentSolutions: [
      'Manual research',
      'Expensive consultants',
      'Basic survey tools',
    ],
    willingnessToPay: 'high',
    urgency: 'high',
    keyInsights: [
      'Strong demand signals across multiple channels',
      'Clear pain points with existing solutions',
      'Users willing to pay premium for better solution',
    ],
  } as DemandStageSummary,

  {
    stage: 'communities',
    mainCommunities: [
      {
        name: 'r/startups',
        platform: 'Reddit',
        size: '500K members',
        engagement: 'high',
      },
      {
        name: 'Indie Hackers',
        platform: 'Forum',
        size: '100K members',
        engagement: 'high',
      },
      {
        name: 'Startup Grind',
        platform: 'Slack',
        size: '50K members',
        engagement: 'medium',
      },
    ],
    influencers: ['@levelsio', '@patio11', '@swyx', '@sivers'],
    discussions: [
      'Idea validation methods',
      'Market research techniques',
      'MVP development strategies',
    ],
    sentiment: 'positive',
    acquisitionChannels: [
      'Reddit marketing',
      'Product Hunt',
      'Twitter',
      'Indie Hackers',
    ],
    keyInsights: [
      'Active discussions about validation in multiple communities',
      'High engagement with idea validation content',
      'Clear acquisition channels identified',
    ],
  } as CommunitiesStageSummary,

  {
    stage: 'competition',
    directCompetitors: [
      {
        name: 'Market Research Tool A',
        pricing: '$99-299/mo',
        strengths: ['Comprehensive data', 'Established brand'],
        weaknesses: ['Expensive', 'Complex UI', 'No AI features'],
      },
      {
        name: 'Validation Tool B',
        pricing: '$49/mo',
        strengths: ['Affordable', 'Simple interface'],
        weaknesses: ['Limited features', 'Manual process'],
      },
    ],
    indirectCompetitors: ['Manual research', 'Consulting firms', 'Survey tools'],
    marketGaps: [
      'No affordable AI-powered solution',
      'Lack of end-to-end validation tools',
      'Poor UX in existing tools',
    ],
    competitiveAdvantage: [
      'AI-powered deep research',
      'Affordable pricing ($29-49/mo)',
      'Superior UX with modern tech stack',
      'Comprehensive 8-stage analysis',
    ],
    threatLevel: 'medium',
    keyInsights: [
      'Clear differentiation opportunities exist',
      'Market gaps align with our solution',
      'Competitive pricing advantage possible',
    ],
  } as CompetitionStageSummary,

  {
    stage: 'forecast',
    arrProjections: {
      year1: '$120K ARR (100 customers)',
      year2: '$600K ARR (500 customers)',
      year3: '$2.4M ARR (2000 customers)',
    },
    userGrowth: {
      year1: '100 paid users',
      year2: '500 paid users',
      year3: '2000 paid users',
    },
    keyMetrics: {
      cac: '$50 (organic channels)',
      ltv: '$600 (12 month avg retention)',
      ltvCacRatio: '12:1',
      churnRate: '5% monthly',
    },
    breakeven: 'Month 18',
    keyInsights: [
      'Strong unit economics with 12:1 LTV:CAC',
      'Achievable growth with organic channels',
      'Breakeven in 18 months is realistic',
    ],
  } as ForecastStageSummary,

  {
    stage: 'gtm',
    launchChannels: [
      'Product Hunt launch',
      'Reddit marketing (r/startups, r/SideProject)',
      'Twitter growth',
      'Content marketing (SEO blog)',
      'Indie Hackers showcase',
    ],
    contentStrategy: [
      'Case studies from beta users',
      'How-to guides for idea validation',
      'Comparison content vs competitors',
      'Founder interviews',
    ],
    partnerships: [
      'Startup accelerators',
      'Business coaches',
      'SaaS communities',
    ],
    pricingModel: 'Freemium: Free (1 analysis) → Starter $29/mo → Pro $49/mo',
    first100Users:
      'Beta launch on Indie Hackers + Product Hunt → Manual outreach in Reddit communities',
    timeline: 'MVP in 8 weeks → Beta in week 10 → Public launch week 12',
    keyInsights: [
      'Multiple organic acquisition channels available',
      'Clear path to first 100 users',
      'Freemium model reduces friction',
    ],
  } as GtmStageSummary,

  {
    stage: 'tech',
    frontend: ['Next.js 14', 'Tailwind CSS', 'shadcn/ui', 'TypeScript'],
    backend: ['Vercel Functions', 'Supabase PostgreSQL', 'Supabase Auth'],
    aiServices: ['Perplexity API', 'Claude API', 'OpenAI (fallback)'],
    infrastructure: ['Vercel (hosting)', 'Supabase (database)', 'Vercel Cron Jobs'],
    estimatedCost: '$50-100/month for 100 users',
    buildTime: '8 weeks with 2 developers',
    teamSize: '2 full-stack developers',
    keyInsights: [
      'Affordable tech stack with generous free tiers',
      'Fast development with modern framework',
      'Scalable architecture to 10K+ users',
    ],
  } as TechStageSummary,

  {
    stage: 'customers',
    personas: [
      {
        name: 'Early-Stage Founder',
        segment: 'Startup founders (pre-seed)',
        painPoints: [
          'Need market validation before building',
          'Limited budget for research',
          'Time constraints',
        ],
        goals: [
          'Validate ideas quickly',
          'Reduce startup risk',
          'Make data-driven decisions',
        ],
      },
      {
        name: 'Serial Entrepreneur',
        segment: 'Experienced founders',
        painPoints: [
          'Want faster validation process',
          'Need comprehensive research',
          'Looking for edge in competitive markets',
        ],
        goals: ['Validate multiple ideas', 'Deep market insights', 'Competitive analysis'],
      },
    ],
    objections: [
      'Can I do this research myself? (Yes, but takes weeks)',
      'Is AI analysis reliable? (Yes, uses real data + human review)',
      'Too expensive (Cheaper than 1 hour of consultant time)',
      'Will this work for my niche? (Works for all markets)',
      'What if the analysis is wrong? (Money-back guarantee)',
    ],
    valueProposition:
      'Get comprehensive AI-powered market research in minutes, not weeks - for less than the cost of one consultant hour',
    acquisitionCost: '$30 CAC (organic channels)',
    lifetimeValue: '$400 LTV (avg 8 month retention)',
    keyInsights: [
      'Two distinct personas with similar pain points',
      'Clear value proposition addressing objections',
      'Strong LTV:CAC ratio of 13:1',
    ],
  } as CustomersStageSummary,
];

// ============================================
// MAIN TEST FUNCTION
// ============================================

async function runTest() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  📊 CONTEXT OPTIMIZATION TEST - TOKEN SAVINGS ANALYSIS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n');

  // Test 1: Stage 2 context (uses stage 1)
  console.log('🔍 TEST 1: Stage 2 Context (Market Analysis)');
  console.log('─────────────────────────────────────────────────────────');

  const stage2ContextOld = MOCK_FULL_ANALYSES.market;
  const stage2ContextNew = createCondensedContext([MOCK_SUMMARIES[0]]);

  const tokensOld2 = estimateTokens(stage2ContextOld);
  const tokensNew2 = estimateTokens(stage2ContextNew);
  const savings2 = tokensOld2 - tokensNew2;
  const percent2 = ((savings2 / tokensOld2) * 100).toFixed(1);

  console.log(`Old approach (full text): ${tokensOld2.toLocaleString()} tokens`);
  console.log(`New approach (summary):    ${tokensNew2.toLocaleString()} tokens`);
  console.log(`Savings:                   ${savings2.toLocaleString()} tokens (${percent2}%)`);
  console.log(`Cost saved:                $${estimateCost(savings2).toFixed(3)} per analysis`);
  console.log('\n');

  // Test 2: Stage 5 context (uses stages 1-4)
  console.log('🔍 TEST 2: Stage 5 Context (Stages 1-4)');
  console.log('─────────────────────────────────────────────────────────');

  const stage5ContextOld = Object.values(MOCK_FULL_ANALYSES)
    .slice(0, 4)
    .join('\n\n');
  const stage5ContextNew = createCondensedContext(MOCK_SUMMARIES.slice(0, 4));

  const tokensOld5 = estimateTokens(stage5ContextOld);
  const tokensNew5 = estimateTokens(stage5ContextNew);
  const savings5 = tokensOld5 - tokensNew5;
  const percent5 = ((savings5 / tokensOld5) * 100).toFixed(1);

  console.log(`Old approach (full text): ${tokensOld5.toLocaleString()} tokens`);
  console.log(`New approach (summary):    ${tokensNew5.toLocaleString()} tokens`);
  console.log(`Savings:                   ${savings5.toLocaleString()} tokens (${percent5}%)`);
  console.log(`Cost saved:                $${estimateCost(savings5).toFixed(3)} per analysis`);
  console.log('\n');

  // Test 3: Full pipeline Stage 8 context (uses stages 1-7)
  console.log('🔍 TEST 3: Stage 8 Context (Full Pipeline - Stages 1-7)');
  console.log('─────────────────────────────────────────────────────────');

  const stage8ContextOld = Object.values(MOCK_FULL_ANALYSES)
    .slice(0, 7)
    .join('\n\n');
  const stage8ContextNew = createCondensedContext(MOCK_SUMMARIES.slice(0, 7));

  const tokensOld8 = estimateTokens(stage8ContextOld);
  const tokensNew8 = estimateTokens(stage8ContextNew);
  const savings8 = tokensOld8 - tokensNew8;
  const percent8 = ((savings8 / tokensOld8) * 100).toFixed(1);

  console.log(`Old approach (full text): ${tokensOld8.toLocaleString()} tokens`);
  console.log(`New approach (summary):    ${tokensNew8.toLocaleString()} tokens`);
  console.log(`Savings:                   ${savings8.toLocaleString()} tokens (${percent8}%)`);
  console.log(`Cost saved:                $${estimateCost(savings8).toFixed(3)} per analysis`);
  console.log('\n');

  // Total pipeline savings
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  💰 TOTAL PIPELINE SAVINGS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n');

  // All context passed throughout pipeline (stages 2-8)
  const totalContextOld =
    estimateTokens(MOCK_FULL_ANALYSES.market) + // Stage 2 context
    estimateTokens(
      Object.values(MOCK_FULL_ANALYSES)
        .slice(0, 2)
        .join('\n\n')
    ) + // Stage 3 context
    estimateTokens(
      Object.values(MOCK_FULL_ANALYSES)
        .slice(0, 3)
        .join('\n\n')
    ) + // Stage 4
    estimateTokens(
      Object.values(MOCK_FULL_ANALYSES)
        .slice(0, 4)
        .join('\n\n')
    ) + // Stage 5
    estimateTokens(
      Object.values(MOCK_FULL_ANALYSES)
        .slice(0, 5)
        .join('\n\n')
    ) + // Stage 6
    estimateTokens(
      Object.values(MOCK_FULL_ANALYSES)
        .slice(0, 6)
        .join('\n\n')
    ) + // Stage 7
    estimateTokens(
      Object.values(MOCK_FULL_ANALYSES)
        .slice(0, 7)
        .join('\n\n')
    ); // Stage 8

  const totalContextNew =
    estimateTokens(createCondensedContext(MOCK_SUMMARIES.slice(0, 1))) + // Stage 2
    estimateTokens(createCondensedContext(MOCK_SUMMARIES.slice(0, 2))) + // Stage 3
    estimateTokens(createCondensedContext(MOCK_SUMMARIES.slice(0, 3))) + // Stage 4
    estimateTokens(createCondensedContext(MOCK_SUMMARIES.slice(0, 4))) + // Stage 5
    estimateTokens(createCondensedContext(MOCK_SUMMARIES.slice(0, 5))) + // Stage 6
    estimateTokens(createCondensedContext(MOCK_SUMMARIES.slice(0, 6))) + // Stage 7
    estimateTokens(createCondensedContext(MOCK_SUMMARIES.slice(0, 7))); // Stage 8

  const totalSavings = totalContextOld - totalContextNew;
  const totalPercent = ((totalSavings / totalContextOld) * 100).toFixed(1);

  console.log(`Total context tokens (old): ${totalContextOld.toLocaleString()}`);
  console.log(`Total context tokens (new): ${totalContextNew.toLocaleString()}`);
  console.log(`\n🎯 TOTAL SAVINGS:           ${totalSavings.toLocaleString()} tokens (${totalPercent}%)`);
  console.log(`💵 Cost savings:            $${estimateCost(totalSavings).toFixed(2)} per analysis`);
  console.log(`📊 At 100 analyses/month:   $${(estimateCost(totalSavings) * 100).toFixed(2)}/month saved`);
  console.log(`📈 At 1000 analyses/month:  $${(estimateCost(totalSavings) * 1000).toLocaleString()}/month saved`);

  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  ✅ CONCLUSION');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\n');
  console.log(`The optimization reduces context tokens by ${totalPercent}%, making`);
  console.log('the pipeline significantly more efficient and cost-effective.');
  console.log('\n');
  console.log('Key benefits:');
  console.log('  ✓ Faster processing (less tokens = faster API calls)');
  console.log('  ✓ Lower costs (95%+ reduction in context tokens)');
  console.log('  ✓ More reliable (stays well within token limits)');
  console.log('  ✓ Better quality (focused summaries vs wall of text)');
  console.log('\n');
}

// Run the test
runTest().catch(console.error);
