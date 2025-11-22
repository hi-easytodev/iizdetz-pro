/**
 * AI Extraction Utilities
 *
 * Extracts structured summaries from full analysis text
 * to optimize context window usage in pipeline stages
 */

import { callClaude } from './claude';
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
} from '@/types';

/**
 * Extract structured summary from stage analysis
 *
 * @param stage - Stage name ('market', 'demand', etc.)
 * @param fullAnalysis - Full analysis text (2000-4000 words)
 * @returns Structured summary with key facts only
 */
export async function extractStageSummary(
  stage: string,
  fullAnalysis: string
): Promise<StageSummary | null> {
  try {
    const extractionPrompt = getExtractionPrompt(stage, fullAnalysis);

    const response = await callClaude(extractionPrompt, {
      maxTokens: 1000, // Summaries should be concise
      temperature: 0.1, // Low temperature for factual extraction
    });

    // Parse JSON response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      console.error(`[Extraction] Failed to extract JSON from ${stage} stage`);
      return null;
    }

    const summary = JSON.parse(jsonMatch[1]);
    return summary as StageSummary;
  } catch (error) {
    console.error(`[Extraction] Error extracting ${stage} summary:`, error);
    return null;
  }
}

/**
 * Generate extraction prompt for each stage
 */
function getExtractionPrompt(stage: string, fullAnalysis: string): string {
  const basePrompt = `You are a precise data extraction assistant. Extract ONLY the key facts from the following analysis into a structured JSON format.

**CRITICAL RULES:**
1. Be concise - extract only the most important facts
2. Use exact numbers/quotes from the source when available
3. Return ONLY valid JSON wrapped in \`\`\`json\`\`\` tags
4. No commentary, no explanations, just the JSON

**Full Analysis:**
${fullAnalysis.slice(0, 10000)} // Limit to ~10K chars to stay within context

**Extract the following structure:`;

  switch (stage) {
    case 'market':
      return `${basePrompt}

\`\`\`json
{
  "stage": "market",
  "tam": "Total Addressable Market in dollars",
  "sam": "Serviceable Available Market in dollars",
  "som": "Serviceable Obtainable Market in dollars",
  "growthRate": "Market growth rate (e.g., 15% CAGR)",
  "keyTrends": ["Top 3-5 market trends"],
  "targetSegments": ["Key customer segments"],
  "marketMaturity": "emerging | growth | mature | declining",
  "keyInsights": ["3-5 critical insights"]
}
\`\`\`

Now extract:`;

    case 'demand':
      return `${basePrompt}

\`\`\`json
{
  "stage": "demand",
  "searchVolume": "Monthly search volume",
  "demandTrend": "rising | stable | declining",
  "painPoints": ["Top 5 customer pain points"],
  "currentSolutions": ["Existing solutions/workarounds"],
  "willingnessToPay": "high | medium | low",
  "urgency": "high | medium | low",
  "keyInsights": ["3-5 critical insights"]
}
\`\`\`

Now extract:`;

    case 'communities':
      return `${basePrompt}

\`\`\`json
{
  "stage": "communities",
  "mainCommunities": [
    {
      "name": "Community name",
      "platform": "Platform (Reddit, Discord, etc.)",
      "size": "Member count",
      "engagement": "high | medium | low"
    }
  ],
  "influencers": ["Top 3-5 influencers in the space"],
  "discussions": ["Key discussion topics"],
  "sentiment": "positive | neutral | negative",
  "acquisitionChannels": ["Best channels to find customers"],
  "keyInsights": ["3-5 critical insights"]
}
\`\`\`

Now extract:`;

    case 'competition':
      return `${basePrompt}

\`\`\`json
{
  "stage": "competition",
  "directCompetitors": [
    {
      "name": "Competitor name",
      "pricing": "Pricing model",
      "strengths": ["Key strengths"],
      "weaknesses": ["Key weaknesses"]
    }
  ],
  "indirectCompetitors": ["Indirect competitors"],
  "marketGaps": ["Opportunities/gaps in market"],
  "competitiveAdvantage": ["Our differentiators"],
  "threatLevel": "high | medium | low",
  "keyInsights": ["3-5 critical insights"]
}
\`\`\`

Now extract:`;

    case 'forecast':
      return `${basePrompt}

\`\`\`json
{
  "stage": "forecast",
  "arrProjections": {
    "year1": "Year 1 ARR projection",
    "year2": "Year 2 ARR projection",
    "year3": "Year 3 ARR projection"
  },
  "userGrowth": {
    "year1": "Year 1 user count",
    "year2": "Year 2 user count",
    "year3": "Year 3 user count"
  },
  "keyMetrics": {
    "cac": "Customer Acquisition Cost",
    "ltv": "Lifetime Value",
    "ltvCacRatio": "LTV:CAC Ratio",
    "churnRate": "Monthly churn rate"
  },
  "breakeven": "Time to breakeven (e.g., Month 18)",
  "keyInsights": ["3-5 critical insights"]
}
\`\`\`

Now extract:`;

    case 'gtm':
      return `${basePrompt}

\`\`\`json
{
  "stage": "gtm",
  "launchChannels": ["Top 3-5 go-to-market channels"],
  "contentStrategy": ["Key content types/tactics"],
  "partnerships": ["Potential partnership opportunities"],
  "pricingModel": "Pricing model description",
  "first100Users": "Strategy to get first 100 users",
  "timeline": "Launch timeline",
  "keyInsights": ["3-5 critical insights"]
}
\`\`\`

Now extract:`;

    case 'tech':
      return `${basePrompt}

\`\`\`json
{
  "stage": "tech",
  "frontend": ["Frontend technologies"],
  "backend": ["Backend technologies"],
  "aiServices": ["AI/ML services"],
  "infrastructure": ["Hosting, database, etc."],
  "estimatedCost": "Monthly infrastructure cost",
  "buildTime": "Estimated build time",
  "teamSize": "Required team size",
  "keyInsights": ["3-5 critical insights"]
}
\`\`\`

Now extract:`;

    case 'customers':
      return `${basePrompt}

\`\`\`json
{
  "stage": "customers",
  "personas": [
    {
      "name": "Persona name",
      "segment": "Market segment",
      "painPoints": ["Top pain points"],
      "goals": ["Key goals/objectives"]
    }
  ],
  "objections": ["Top 5 objections/concerns"],
  "valueProposition": "Core value proposition",
  "acquisitionCost": "Estimated CAC per persona",
  "lifetimeValue": "Estimated LTV per persona",
  "keyInsights": ["3-5 critical insights"]
}
\`\`\`

Now extract:`;

    default:
      throw new Error(`Unknown stage: ${stage}`);
  }
}

/**
 * Create condensed context string from previous stage summaries
 *
 * Instead of passing 20,000+ words of full analysis to later stages,
 * we pass only the structured summaries (~500 words total)
 *
 * @param summaries - Array of stage summaries
 * @returns Condensed context string for prompt
 */
export function createCondensedContext(summaries: StageSummary[]): string {
  const sections: string[] = [];

  for (const summary of summaries) {
    switch (summary.stage) {
      case 'market':
        sections.push(`
**MARKET ANALYSIS:**
- TAM/SAM/SOM: ${summary.tam} / ${summary.sam} / ${summary.som}
- Growth Rate: ${summary.growthRate}
- Market Maturity: ${summary.marketMaturity}
- Key Trends: ${summary.keyTrends.join(', ')}
- Target Segments: ${summary.targetSegments.join(', ')}
- Insights: ${summary.keyInsights.join('; ')}
`);
        break;

      case 'demand':
        sections.push(`
**DEMAND ANALYSIS:**
- Search Volume: ${summary.searchVolume}
- Trend: ${summary.demandTrend}
- Willingness to Pay: ${summary.willingnessToPay}
- Urgency: ${summary.urgency}
- Pain Points: ${summary.painPoints.join('; ')}
- Insights: ${summary.keyInsights.join('; ')}
`);
        break;

      case 'communities':
        sections.push(`
**COMMUNITIES:**
- Main Communities: ${summary.mainCommunities
          .map((c) => `${c.name} (${c.platform}, ${c.size})`)
          .join(', ')}
- Sentiment: ${summary.sentiment}
- Acquisition Channels: ${summary.acquisitionChannels.join(', ')}
- Insights: ${summary.keyInsights.join('; ')}
`);
        break;

      case 'competition':
        sections.push(`
**COMPETITION:**
- Threat Level: ${summary.threatLevel}
- Main Competitors: ${summary.directCompetitors
          .map((c) => c.name)
          .join(', ')}
- Market Gaps: ${summary.marketGaps.join('; ')}
- Our Advantages: ${summary.competitiveAdvantage.join('; ')}
- Insights: ${summary.keyInsights.join('; ')}
`);
        break;

      case 'forecast':
        sections.push(`
**FORECAST:**
- ARR Projections: Y1: ${summary.arrProjections.year1}, Y2: ${summary.arrProjections.year2}, Y3: ${summary.arrProjections.year3}
- CAC: ${summary.keyMetrics.cac}, LTV: ${summary.keyMetrics.ltv}, Ratio: ${summary.keyMetrics.ltvCacRatio}
- Breakeven: ${summary.breakeven}
- Insights: ${summary.keyInsights.join('; ')}
`);
        break;

      case 'gtm':
        sections.push(`
**GO-TO-MARKET:**
- Launch Channels: ${summary.launchChannels.join(', ')}
- Pricing Model: ${summary.pricingModel}
- First 100 Users: ${summary.first100Users}
- Timeline: ${summary.timeline}
- Insights: ${summary.keyInsights.join('; ')}
`);
        break;

      case 'tech':
        sections.push(`
**TECH STACK:**
- Frontend: ${summary.frontend.join(', ')}
- Backend: ${summary.backend.join(', ')}
- AI Services: ${summary.aiServices.join(', ')}
- Cost: ${summary.estimatedCost}/month
- Build Time: ${summary.buildTime}
- Insights: ${summary.keyInsights.join('; ')}
`);
        break;

      case 'customers':
        sections.push(`
**CUSTOMER PERSONAS:**
- Personas: ${summary.personas.map((p) => p.name).join(', ')}
- Top Objections: ${summary.objections.slice(0, 3).join('; ')}
- Value Proposition: ${summary.valueProposition}
- Insights: ${summary.keyInsights.join('; ')}
`);
        break;
    }
  }

  return `# CONTEXT FROM PREVIOUS STAGES

${sections.join('\n')}

Use this condensed context to inform your analysis. Focus on building upon these insights.`;
}
