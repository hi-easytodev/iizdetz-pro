// ============================================
// ТИПЫ ДЛЯ БАЗЫ ДАННЫХ
// ============================================

export interface Idea {
  id: number;
  title: string;
  description: string;
  source: 'reddit' | 'twitter';
  source_url: string;
  score: number;
  category: string[];
  status: 'collected' | 'analyzing' | 'published' | 'failed';
  created_at: Date;
  updated_at: Date;
}

export interface Analysis {
  id: number;
  idea_id: number;
  stage: 'market' | 'strategy' | 'technical';
  content: any; // JSONB
  markdown_content: string;
  created_at: Date;
}

// ============================================
// ТИПЫ ДЛЯ 8-ЭТАПНОГО АНАЛИЗА
// ============================================

export interface StageResult {
  stage: string;
  analysis: string;
  citations: string[];
  relatedQuestions: string[];
  completedAt: Date;
  summary?: StageSummary; // Structured extraction для следующих этапов
}

// ============================================
// STRUCTURED SUMMARIES ДЛЯ PIPELINE OPTIMIZATION
// ============================================

export type StageSummary =
  | MarketStageSummary
  | DemandStageSummary
  | CommunitiesStageSummary
  | CompetitionStageSummary
  | ForecastStageSummary
  | GtmStageSummary
  | TechStageSummary
  | CustomersStageSummary;

// Stage 1: Market Analysis Summary
export interface MarketStageSummary {
  stage: 'market';
  tam: string; // e.g., "$50B"
  sam: string; // e.g., "$5B"
  som: string; // e.g., "$500M"
  growthRate: string; // e.g., "15% CAGR"
  keyTrends: string[]; // Top 3-5 trends
  targetSegments: string[]; // Key customer segments
  marketMaturity: 'emerging' | 'growth' | 'mature' | 'declining';
  keyInsights: string[]; // 3-5 critical insights
}

// Stage 2: Demand Analysis Summary
export interface DemandStageSummary {
  stage: 'demand';
  searchVolume: string; // e.g., "50K monthly"
  demandTrend: 'rising' | 'stable' | 'declining';
  painPoints: string[]; // Top 5 pain points
  currentSolutions: string[]; // Existing workarounds
  willingnessToPay: 'high' | 'medium' | 'low';
  urgency: 'high' | 'medium' | 'low';
  keyInsights: string[]; // 3-5 critical insights
}

// Stage 3: Communities Summary
export interface CommunitiesStageSummary {
  stage: 'communities';
  mainCommunities: Array<{
    name: string;
    platform: string;
    size: string;
    engagement: 'high' | 'medium' | 'low';
  }>;
  influencers: string[]; // Top 3-5 influencers
  discussions: string[]; // Key discussion topics
  sentiment: 'positive' | 'neutral' | 'negative';
  acquisitionChannels: string[]; // Where to find customers
  keyInsights: string[]; // 3-5 critical insights
}

// Stage 4: Competition Summary
export interface CompetitionStageSummary {
  stage: 'competition';
  directCompetitors: Array<{
    name: string;
    pricing: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  indirectCompetitors: string[];
  marketGaps: string[]; // Opportunities
  competitiveAdvantage: string[]; // Our differentiators
  threatLevel: 'high' | 'medium' | 'low';
  keyInsights: string[]; // 3-5 critical insights
}

// Stage 5: Forecast Summary
export interface ForecastStageSummary {
  stage: 'forecast';
  arrProjections: {
    year1: string;
    year2: string;
    year3: string;
  };
  userGrowth: {
    year1: string;
    year2: string;
    year3: string;
  };
  keyMetrics: {
    cac: string;
    ltv: string;
    ltvCacRatio: string;
    churnRate: string;
  };
  breakeven: string; // e.g., "Month 18"
  keyInsights: string[]; // 3-5 critical insights
}

// Stage 6: GTM Strategy Summary
export interface GtmStageSummary {
  stage: 'gtm';
  launchChannels: string[]; // Top 3-5 channels
  contentStrategy: string[]; // Key content types
  partnerships: string[]; // Potential partnerships
  pricingModel: string; // e.g., "Freemium + Premium tiers"
  first100Users: string; // Strategy to get first 100
  timeline: string; // e.g., "6 months to launch"
  keyInsights: string[]; // 3-5 critical insights
}

// Stage 7: Tech Stack Summary
export interface TechStageSummary {
  stage: 'tech';
  frontend: string[]; // Key technologies
  backend: string[]; // Key technologies
  aiServices: string[]; // AI/ML services
  infrastructure: string[]; // Hosting, DB, etc.
  estimatedCost: string; // Monthly infrastructure cost
  buildTime: string; // e.g., "3-4 months"
  teamSize: string; // e.g., "2 developers"
  keyInsights: string[]; // 3-5 critical insights
}

// Stage 8: Customer Personas Summary
export interface CustomersStageSummary {
  stage: 'customers';
  personas: Array<{
    name: string;
    segment: string;
    painPoints: string[];
    goals: string[];
  }>;
  objections: string[]; // Top 5 objections
  valueProposition: string; // Core value prop for each persona
  acquisitionCost: string; // Estimated CAC per persona
  lifetime Value: string; // Estimated LTV per persona
  keyInsights: string[]; // 3-5 critical insights
}

export interface AnalysisResults {
  market?: StageResult;
  demand?: StageResult;
  communities?: StageResult;
  competition?: StageResult;
  forecast?: StageResult;
  gtm?: StageResult;
  tech?: StageResult;
  customers?: StageResult;
}

export interface AnalysisResponse {
  success: boolean;
  ideaId: number;
  stages: AnalysisResults;
  totalSources: number;
  completedAt?: string;
  stageCount?: number;
}

export interface PipelineRun {
  id: number;
  idea_id: number;
  current_stage: string;
  status: 'running' | 'completed' | 'failed';
  error_message?: string;
  started_at: Date;
  completed_at?: Date;
}

export interface ChartData {
  id: number;
  idea_id: number;
  chart_type: 'arr_growth' | 'market_pie' | 'competitive_matrix' | 'sparkline';
  data: any; // JSONB
  created_at: Date;
}

// ============================================
// ТИПЫ ДЛЯ КОМПОНЕНТОВ
// ============================================

export interface IdeaCardProps {
  id: number;
  title: string;
  description: string;
  arrRange: string;
  categories: string[];
  reactions: Reaction[];
  chartData: SparklineData[];
  isFavorite: boolean;
}

export interface Reaction {
  emoji: string;
  count: number;
}

export interface SparklineData {
  x: number;
  y: number;
}

export interface ARRGrowthData {
  month: string;
  revenue: number;
  users: number;
}

export interface MarketDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface CompetitiveMatrixData {
  name: string;
  price: number;
  features: number;
  highlight?: boolean;
}

// ============================================
// ТИПЫ ДЛЯ AI ПРОМПТОВ
// ============================================

export interface Stage2FilterResult {
  ideas: {
    id: string;
    title: string;
    description: string;
    source: 'reddit' | 'twitter';
    source_url: string;
    score: number;
    categories: string[];
    reasoning: string;
  }[];
}

export interface Stage3MarketAnalysis {
  why_now: {
    trends: string[];
    consumer_changes: string;
    tech_prerequisites: string;
    regulatory_changes?: string;
  };
  target_market: {
    tam: number;
    sam: number;
    som: number;
    audience: {
      demographics: string;
      psychographics: string;
      pain_points: string[];
    };
    geographic_markets: string[];
  };
  competitive_analysis: {
    competitors: Competitor[];
    gaps: string[];
  };
  financial_projections: {
    arr_range: {
      pessimistic: { min: number; max: number };
      realistic: { min: number; max: number };
      optimistic: { min: number; max: number };
    };
    monetization_models: string[];
    unit_economics: {
      average_price: number;
      ltv: number;
      cac: number;
      ltv_cac_ratio: number;
    };
  };
}

export interface Competitor {
  name: string;
  product: string;
  price: string;
  strengths: string;
  weaknesses: string;
}

export interface Stage4Strategy {
  mvp: {
    description: string;
    core_features: Feature[];
    tech_stack: {
      frontend: string[];
      backend: string[];
      ai: string[];
      justification: string;
    };
    timeline: {
      total_weeks: number;
      phases: Phase[];
    };
  };
  monetization: {
    primary_model: string;
    pricing_strategy: {
      tiers: PricingTier[];
      justification: string;
    };
    revenue_projections: {
      [key: string]: {
        users: number;
        mrr: number;
      };
    };
  };
  go_to_market: {
    channels: MarketingChannel[];
    content_strategy: {
      blog_posts: string[];
      social_media: string;
      email: string;
    };
    first_100_users: string;
  };
  kpis: {
    metrics: {
      [key: string]: {
        signups?: number;
        activation_rate?: string;
        paying_users?: number;
        mrr?: string;
      };
    };
    pivot_triggers: string[];
  };
  risks: Risk[];
}

export interface Feature {
  feature: string;
  priority: 'must-have' | 'nice-to-have';
  complexity: 'low' | 'medium' | 'high';
  description: string;
}

export interface Phase {
  phase: string;
  weeks: number;
}

export interface PricingTier {
  name: string;
  price: number;
  features: string[];
  limitations?: string;
  target?: string;
}

export interface MarketingChannel {
  channel: string;
  priority: number;
  cost: string;
  tactics: string[];
  expected_cac: string;
  timeline: string;
}

export interface Risk {
  risk: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'critical' | 'major' | 'minor';
  mitigation: string;
}

// ============================================
// ТИПЫ ДЛЯ SCRAPING
// ============================================

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  subreddit: string;
}

export interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
  url: string;
}

// ============================================
// ТИПЫ ДЛЯ API ОТВЕТОВ
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PipelineStatus {
  idea_id: number;
  status: 'running' | 'completed' | 'failed';
  current_stage: string;
  progress: number; // 0-100
  error_message?: string;
}

// ============================================
// ТИПЫ ДЛЯ ВИЗУАЛИЗАЦИЙ
// ============================================

export interface ChartDataResponse {
  arrGrowthChart: {
    type: 'line';
    data: ARRGrowthData[];
    config: {
      xAxisKey: string;
      yAxisKey: string;
      lineColor: string;
      gradient: boolean;
    };
  };
  marketDistributionChart: {
    type: 'pie';
    data: MarketDistributionData[];
  };
  competitiveMatrix: {
    type: 'scatter';
    data: CompetitiveMatrixData[];
    config: {
      xAxis: string;
      yAxis: string;
    };
  };
  miniCardChart: {
    type: 'sparkline';
    data: SparklineData[];
  };
}

// ============================================
// ТИПЫ ДЛЯ ENVIRONMENT VARIABLES
// ============================================

export interface EnvConfig {
  // Database
  POSTGRES_URL: string;
  POSTGRES_PRISMA_URL?: string;
  POSTGRES_URL_NON_POOLING?: string;

  // Redis
  UPSTASH_REDIS_URL?: string;
  UPSTASH_REDIS_TOKEN?: string;

  // AI APIs
  PERPLEXITY_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;

  // Scraping
  REDDIT_CLIENT_ID?: string;
  REDDIT_CLIENT_SECRET?: string;
  REDDIT_USER_AGENT?: string;
  TWITTER_BEARER_TOKEN?: string;

  // Security
  CRON_SECRET?: string;
  NEXTAUTH_SECRET?: string;
  NEXTAUTH_URL?: string;

  // QStash
  QSTASH_URL?: string;
  QSTASH_TOKEN?: string;
}
