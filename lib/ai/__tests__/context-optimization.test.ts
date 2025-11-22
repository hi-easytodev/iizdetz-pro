/**
 * Test: Context Optimization Token Savings
 *
 * Demonstrates the token reduction achieved by using structured summaries
 * instead of full analysis text in pipeline context
 */

import { createCondensedContext } from '../extraction';
import type {
  StageSummary,
  MarketStageSummary,
  DemandStageSummary,
  CommunitiesStageSummary,
  CompetitionStageSummary,
} from '@/types';

// Helper function to estimate token count (rough approximation: 1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

describe('Context Optimization', () => {
  // Mock full analysis texts (realistic sizes based on actual output)
  const mockFullAnalyses = {
    market: 'A'.repeat(12000), // ~3000 words = ~12,000 chars
    demand: 'A'.repeat(12000),
    communities: 'A'.repeat(12000),
    competition: 'A'.repeat(12000),
    forecast: 'A'.repeat(12000),
    gtm: 'A'.repeat(15000), // ~3750 words
    tech: 'A'.repeat(15000),
    customers: 'A'.repeat(15000),
  };

  // Mock structured summaries
  const mockSummaries: StageSummary[] = [
    {
      stage: 'market',
      tam: '$500B',
      sam: '$50B',
      som: '$5B',
      growthRate: '15% CAGR',
      keyTrends: [
        'AI adoption accelerating in enterprise',
        'Remote work driving demand',
        'Privacy concerns rising',
      ],
      targetSegments: ['SMBs', 'Enterprises', 'Freelancers'],
      marketMaturity: 'growth',
      keyInsights: [
        'Market growing rapidly',
        'High competition',
        'Clear demand signals',
      ],
    } as MarketStageSummary,
    {
      stage: 'demand',
      searchVolume: '50K/month',
      demandTrend: 'rising',
      painPoints: [
        'Current solutions too expensive',
        'Complex onboarding',
        'Lack of integrations',
        'Poor customer support',
        'Limited features',
      ],
      currentSolutions: ['Competitor A', 'Competitor B', 'Manual process'],
      willingnessToPay: 'high',
      urgency: 'high',
      keyInsights: [
        'Strong pain points exist',
        'Users willing to pay premium',
        'Urgent need for better solution',
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
      ],
      influencers: ['@founder1', '@startup_guru', '@tech_lead'],
      discussions: ['Product ideas', 'Market validation', 'Growth tactics'],
      sentiment: 'positive',
      acquisitionChannels: ['Reddit', 'Twitter', 'Product Hunt'],
      keyInsights: [
        'Active community discussions',
        'High engagement levels',
        'Clear acquisition channels',
      ],
    } as CommunitiesStageSummary,
    {
      stage: 'competition',
      directCompetitors: [
        {
          name: 'Competitor A',
          pricing: '$99/mo',
          strengths: ['Established brand', 'Rich features'],
          weaknesses: ['Expensive', 'Complex UI'],
        },
      ],
      indirectCompetitors: ['Manual process', 'Spreadsheets'],
      marketGaps: [
        'No affordable option',
        'Poor UX in existing tools',
        'Lack of AI features',
      ],
      competitiveAdvantage: [
        'AI-powered analysis',
        'Better pricing',
        'Superior UX',
      ],
      threatLevel: 'medium',
      keyInsights: [
        'Clear differentiation possible',
        'Market gaps identified',
        'Competitive pricing advantage',
      ],
    } as CompetitionStageSummary,
  ];

  test('Should demonstrate significant token savings', () => {
    // Calculate OLD approach: passing full analysis text
    const fullContextOld = Object.values(mockFullAnalyses)
      .slice(0, 4)
      .join('\n\n');
    const tokensOld = estimateTokens(fullContextOld);

    // Calculate NEW approach: using condensed summaries
    const condensedContext = createCondensedContext(mockSummaries);
    const tokensNew = estimateTokens(condensedContext);

    // Calculate savings
    const tokenSavings = tokensOld - tokensNew;
    const percentSavings = ((tokenSavings / tokensOld) * 100).toFixed(1);

    // Log results
    console.log('\n📊 CONTEXT OPTIMIZATION RESULTS:');
    console.log('═══════════════════════════════════════');
    console.log(`Old Approach (Full Text):`);
    console.log(`  - Characters: ${fullContextOld.length.toLocaleString()}`);
    console.log(`  - Estimated Tokens: ${tokensOld.toLocaleString()}`);
    console.log('');
    console.log(`New Approach (Structured Summaries):`);
    console.log(`  - Characters: ${condensedContext.length.toLocaleString()}`);
    console.log(`  - Estimated Tokens: ${tokensNew.toLocaleString()}`);
    console.log('');
    console.log(`💰 SAVINGS:`);
    console.log(`  - Token Reduction: ${tokenSavings.toLocaleString()} tokens`);
    console.log(`  - Percentage Saved: ${percentSavings}%`);
    console.log(`  - Cost Savings: ~$${((tokenSavings / 1000) * 0.005).toFixed(2)} per analysis`);
    console.log('═══════════════════════════════════════\n');

    // Assertions
    expect(tokensNew).toBeLessThan(tokensOld);
    expect(percentSavings).toBeGreaterThan('80'); // Should save at least 80%
  });

  test('Should create valid condensed context', () => {
    const condensedContext = createCondensedContext(mockSummaries);

    // Should contain section headers
    expect(condensedContext).toContain('MARKET ANALYSIS');
    expect(condensedContext).toContain('DEMAND ANALYSIS');
    expect(condensedContext).toContain('COMMUNITIES');
    expect(condensedContext).toContain('COMPETITION');

    // Should contain key data points
    expect(condensedContext).toContain('$500B');
    expect(condensedContext).toContain('50K/month');
    expect(condensedContext).toContain('r/startups');

    // Should be significantly shorter than full text
    expect(condensedContext.length).toBeLessThan(5000); // < 5K chars
  });

  test('Should maintain context quality', () => {
    const condensedContext = createCondensedContext(mockSummaries);

    // Should include all critical insights
    mockSummaries.forEach((summary) => {
      summary.keyInsights.forEach((insight) => {
        expect(condensedContext).toContain(insight);
      });
    });
  });

  test('Full pipeline token comparison', () => {
    // Simulate full 8-stage pipeline
    const allStages = Object.values(mockFullAnalyses).join('\n\n');
    const tokensFullPipeline = estimateTokens(allStages);

    // With 8 summaries (add 4 more mock summaries)
    const allSummaries = [
      ...mockSummaries,
      {
        stage: 'forecast',
        arrProjections: { year1: '$100K', year2: '$500K', year3: '$2M' },
        userGrowth: { year1: '100', year2: '500', year3: '2000' },
        keyMetrics: {
          cac: '$50',
          ltv: '$600',
          ltvCacRatio: '12:1',
          churnRate: '3%',
        },
        breakeven: 'Month 18',
        keyInsights: ['Profitable by year 2', 'Strong unit economics'],
      },
      {
        stage: 'gtm',
        launchChannels: ['Product Hunt', 'Reddit', 'Twitter'],
        contentStrategy: ['Blog posts', 'Case studies'],
        partnerships: ['Integration partners'],
        pricingModel: 'Freemium with $49/mo Pro tier',
        first100Users: 'Manual outreach + Product Hunt',
        timeline: '8 weeks to MVP',
        keyInsights: ['Clear launch strategy', 'Multiple channels'],
      },
      {
        stage: 'tech',
        frontend: ['Next.js', 'Tailwind CSS'],
        backend: ['Vercel Functions', 'Supabase'],
        aiServices: ['OpenAI GPT-4', 'Claude'],
        infrastructure: ['Vercel', 'Supabase'],
        estimatedCost: '$50/month',
        buildTime: '8 weeks',
        teamSize: '2 developers',
        keyInsights: ['Affordable stack', 'Fast time to market'],
      },
      {
        stage: 'customers',
        personas: [
          {
            name: 'Startup Founder',
            segment: 'Early-stage founders',
            painPoints: ['Need market validation', 'Limited budget'],
            goals: ['Find viable ideas', 'Reduce risk'],
          },
        ],
        objections: ['Too expensive', 'Not sure it works'],
        valueProposition: 'AI-powered idea validation in minutes',
        acquisitionCost: '$30',
        lifetimeValue: '$400',
        keyInsights: ['Clear target persona', 'Strong LTV:CAC ratio'],
      },
    ] as StageSummary[];

    const condensedFullPipeline = createCondensedContext(allSummaries);
    const tokensCondensed = estimateTokens(condensedFullPipeline);

    const savingsTotal = tokensFullPipeline - tokensCondensed;
    const percentTotal = ((savingsTotal / tokensFullPipeline) * 100).toFixed(1);

    console.log('\n🚀 FULL 8-STAGE PIPELINE COMPARISON:');
    console.log('═══════════════════════════════════════');
    console.log(`Old: ${tokensFullPipeline.toLocaleString()} tokens`);
    console.log(`New: ${tokensCondensed.toLocaleString()} tokens`);
    console.log(`Savings: ${savingsTotal.toLocaleString()} tokens (${percentTotal}%)`);
    console.log(`Cost Savings: ~$${((savingsTotal / 1000) * 0.005).toFixed(2)}/analysis`);
    console.log('═══════════════════════════════════════\n');

    expect(percentTotal).toBeGreaterThan('90'); // Should save >90% for full pipeline
  });
});
