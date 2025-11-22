// ============================================
// БИБЛИОТЕКА ПРОМПТОВ ДЛЯ AI IDEA ANALYZER
// ============================================

/**
 * НОВЫЙ ПОДХОД: Используем Perplexity Deep Research вместо прямого скраппинга
 *
 * Преимущества:
 * - Не нужны API ключи для Reddit/Twitter
 * - Автоматический сбор информации из множества источников
 * - Актуальные данные с citations
 * - Глубокий анализ трендов
 */

export const PROMPTS = {
  // ============================================
  // STAGE 1: Deep Research для сбора идей
  // ============================================
  STAGE1_DISCOVER_IDEAS: `
You are a professional trend researcher and startup analyst.

TASK: Discover and analyze emerging business ideas and startup trends.

RESEARCH FOCUS:
1. **Current Trends (2024-2025)**
   - AI/ML applications in business
   - SaaS innovations
   - EdTech disruptions
   - HealthTech opportunities
   - B2B automation
   - Creator economy tools
   - Climate tech solutions
   - Web3 practical applications

2. **Sources to analyze**:
   - Y Combinator recent batches
   - Product Hunt trending products
   - Hacker News discussions
   - Tech blogs and publications
   - Startup funding news
   - Reddit communities (r/Entrepreneur, r/SaaS, r/startups)
   - Twitter/X startup discussions

3. **What to look for**:
   - Problems people are actively discussing
   - Gaps in existing solutions
   - Emerging technologies creating opportunities
   - Changing consumer/business behaviors
   - Regulatory changes creating markets

OUTPUT FORMAT:
Provide a comprehensive analysis with:

## Top 10 Business Opportunities

For each opportunity:

### [Number]. [Idea Title]
**Category**: [EdTech/SaaS/B2B/etc]
**Why Now**: [2-3 sentences on timing/trends]
**Target Market**: [Who needs this]
**Problem**: [What pain point it solves]
**Potential ARR**: [Estimated range]
**Competition Level**: [Low/Medium/High]
**Entry Barrier**: [Low/Medium/High]
**Engagement Signals**: [Evidence of demand]

**Sources**: [List key sources]

---

Be thorough, data-driven, and focus on ACTIONABLE opportunities with real market validation.
`,

  // ============================================
  // STAGE 2: Глубокий анализ конкретной идеи
  // ============================================
  STAGE2_DEEP_ANALYSIS: (ideaTitle: string, ideaDescription: string) => `
You are a McKinsey-level business analyst conducting a comprehensive market research.

IDEA TO ANALYZE:
**Title**: ${ideaTitle}
**Description**: ${ideaDescription}

TASK: Conduct an exhaustive analysis of this business opportunity.

ANALYSIS STRUCTURE:

## 1. 🚀 WHY NOW (Market Timing)

**Current Trends Supporting This Idea**:
- Technological advancements (with specific examples and data)
- Consumer/business behavior changes (with statistics)
- Regulatory/policy changes
- Economic factors
- Social movements

**Market Timing Score**: [1-10] and justification

## 2. 🎯 TARGET MARKET (Market Sizing)

**Market Size**:
- **TAM** (Total Addressable Market): $[X]B globally
  - Calculation methodology
  - Data sources
- **SAM** (Serviceable Available Market): $[X]B
  - Geographic/segment focus
- **SOM** (Serviceable Obtainable Market - Year 3): $[X]M
  - Realistic capture rate

**Target Customer Profile**:
- Demographics (age, income, location, company size for B2B)
- Psychographics (values, behaviors, preferences)
- Job titles/roles (for B2B)
- Pain points (prioritized list with severity)
- Current solutions they use
- Willingness to pay indicators

**Geographic Priorities**:
1. [Country/Region] - [Reason]
2. [Country/Region] - [Reason]

## 3. 🥊 COMPETITIVE LANDSCAPE

**Direct Competitors** (Minimum 5):

| Company | Product | Pricing | Key Features | Weaknesses | Market Share |
|---------|---------|---------|--------------|------------|--------------|
| [Name]  | [Desc]  | $[X]/mo | [List]       | [List]     | [%]          |

**Indirect Competitors**: [List with brief descriptions]

**Competitive Advantages We Can Build**:
1. [Advantage] - [How to achieve it]
2. [Advantage] - [How to achieve it]

**Market Gaps** (Unmet needs):
- [Gap 1]: [Explanation]
- [Gap 2]: [Explanation]

## 4. 💰 FINANCIAL PROJECTIONS

**Revenue Models** (Prioritized):
1. **[Primary Model]** (e.g., Subscription)
   - Structure: [Details]
   - Unit economics: [LTV, CAC, margins]
   - Rationale: [Why this model]

2. **[Secondary Model]** (if applicable)

**Realistic Revenue Projections**:

### Year 1
- MRR: $[X]K → $[Y]K
- Customers: [X] → [Y]
- ARR: $[Total]

### Year 2
- MRR: $[X]K → $[Y]K
- Customers: [X] → [Y]
- ARR: $[Total]

### Year 3
- MRR: $[X]K → $[Y]K
- Customers: [X] → [Y]
- ARR: $[Total]

**Key Assumptions**:
- CAC: $[X] (based on [channels])
- LTV: $[X] (based on [retention] retention)
- LTV:CAC ratio: [X]:[Y]
- Gross margin: [X]%
- Churn rate: [X]% monthly

## 5. 📊 MARKET VALIDATION

**Evidence of Demand**:
- Search volume trends
- Social media discussions
- Existing solution usage stats
- Funding news in the space
- Job postings in the industry

**Risk Factors**:
1. [Risk]: [Probability] probability, [Impact] impact
   - Mitigation: [Strategy]

## 6. 📚 SOURCES & CITATIONS

[List all sources with links]

---

**REQUIREMENTS**:
- Use ONLY recent data (2023-2025)
- Cite all statistics and claims
- Be realistic with projections (no hockey sticks without justification)
- Minimum 3000 words
- Include specific companies, products, and numbers
`,

  // ============================================
  // STAGE 3: Стратегия запуска (Go-to-Market)
  // ============================================
  STAGE3_GTM_STRATEGY: (marketAnalysis: string) => `
PREVIOUS MARKET ANALYSIS:
${marketAnalysis}

---

You are a startup GTM (Go-To-Market) strategist who has launched dozens of successful products.

TASK: Based on the market analysis above, create a detailed launch strategy for this business.

OUTPUT FORMAT (JSON):

\`\`\`json
{
  "mvp": {
    "description": "Clear description of the minimum viable product",
    "timeline_weeks": 8,
    "core_features": [
      {
        "feature": "Feature name",
        "priority": "must-have",
        "complexity": "low",
        "description": "What it does and why it's critical",
        "user_story": "As a [user], I want [goal] so that [benefit]"
      }
    ],
    "tech_stack": {
      "frontend": ["Next.js", "Tailwind CSS", "Vercel"],
      "backend": ["Supabase", "PostgreSQL"],
      "ai": ["OpenAI API", "Vercel AI SDK"],
      "payments": ["Stripe"],
      "justification": "Why this stack: cost, speed, scalability"
    },
    "development_phases": [
      {
        "phase": "Design & Planning",
        "weeks": 1,
        "deliverables": ["User flows", "Wireframes", "Database schema"]
      },
      {
        "phase": "Core Development",
        "weeks": 4,
        "deliverables": ["Auth", "Core features", "Basic UI"]
      },
      {
        "phase": "Polish & Testing",
        "weeks": 2,
        "deliverables": ["Bug fixes", "UX improvements", "Beta testing"]
      },
      {
        "phase": "Launch Prep",
        "weeks": 1,
        "deliverables": ["Analytics", "SEO", "Landing page"]
      }
    ]
  },

  "pricing_strategy": {
    "model": "freemium",
    "tiers": [
      {
        "name": "Free",
        "price_monthly": 0,
        "features": ["Feature 1", "Feature 2"],
        "limitations": "X requests/month, No priority support",
        "target": "Individual users, hobbyists",
        "conversion_goal": "15% to paid within 30 days"
      },
      {
        "name": "Pro",
        "price_monthly": 29,
        "price_annual": 290,
        "features": ["All Free features", "Feature 3", "Feature 4"],
        "target": "Freelancers, small businesses",
        "positioning": "Best for professionals"
      },
      {
        "name": "Business",
        "price_monthly": 99,
        "price_annual": 990,
        "features": ["All Pro features", "Team features", "Priority support"],
        "target": "Teams, agencies",
        "positioning": "Scale with your team"
      }
    ],
    "competitor_comparison": {
      "competitor_a": "$49/mo for similar features",
      "competitor_b": "$79/mo but limited functionality",
      "our_positioning": "Better value at $29 with more features"
    },
    "pricing_psychology": "Anchor at $99, make $29 look like a steal"
  },

  "go_to_market": {
    "launch_strategy": "Staggered rollout: Private beta → Public beta → Official launch",

    "channels": [
      {
        "channel": "Product Hunt",
        "priority": 1,
        "timeline": "Week 1 of launch",
        "tactics": [
          "Build waitlist 2 weeks before",
          "Engage with community daily for 1 month",
          "Prepare hunter relationship",
          "Create compelling thumbnail and first comment"
        ],
        "expected_outcome": "500-1000 signups, #1-3 product of the day",
        "cost": "$0",
        "effort": "High"
      },
      {
        "channel": "Content Marketing + SEO",
        "priority": 1,
        "timeline": "Start immediately, ongoing",
        "tactics": [
          "Create 20 high-value blog posts targeting buyer keywords",
          "Build backlinks through guest posting",
          "Optimize for featured snippets",
          "Create comparison pages vs competitors"
        ],
        "expected_outcome": "1000+ organic visitors/month by month 3",
        "cost": "$0 (own content) or $500/mo (freelancer)",
        "effort": "High initially, medium ongoing"
      },
      {
        "channel": "Reddit Marketing",
        "priority": 2,
        "timeline": "Ongoing",
        "tactics": [
          "Identify 10 relevant subreddits",
          "Build karma by being helpful (no spam)",
          "Share case studies and learnings",
          "Offer free accounts to power users",
          "AMA in r/Entrepreneur when traction is solid"
        ],
        "expected_outcome": "200-500 targeted signups/month",
        "cost": "$0",
        "effort": "Medium"
      },
      {
        "channel": "LinkedIn Outreach",
        "priority": 2,
        "timeline": "Start week 2",
        "tactics": [
          "Optimize founder LinkedIn profile",
          "Post daily insights and learnings",
          "Engage with target audience posts",
          "Personalized connection requests (50/day)",
          "Share customer success stories"
        ],
        "expected_outcome": "100-300 signups/month",
        "cost": "$0 (organic) or $29/mo (Sales Navigator)",
        "effort": "Medium"
      },
      {
        "channel": "Twitter/X",
        "priority": 3,
        "timeline": "Ongoing",
        "tactics": [
          "Tweet daily about building in public",
          "Share metrics and milestones",
          "Engage with indie hacker community",
          "Use relevant hashtags",
          "Reply to target audience tweets"
        ],
        "expected_outcome": "Grow to 1000 followers, 50 signups/month",
        "cost": "$0",
        "effort": "Low-medium"
      }
    ],

    "first_100_customers": {
      "strategy": "Hyper-targeted outreach to early adopters",
      "steps": [
        "Week 1: Friends, family, network (target: 10 users)",
        "Week 2: Reddit and online communities (target: 20 users)",
        "Week 3: Product Hunt launch (target: 40 users)",
        "Week 4: LinkedIn outreach to ICP (target: 30 users)"
      ],
      "activation_tactics": [
        "Personal onboarding calls for first 50 users",
        "Gather feedback aggressively",
        "Offer lifetime deals for early supporters"
      ]
    },

    "content_calendar": {
      "blog_posts": [
        "How to [solve problem] in 2025 (SEO play)",
        "We analyzed 1000 [niche] and found...",
        "[Our Product] vs [Competitor]: Honest comparison",
        "Case study: How [Customer] achieved [result]",
        "The ultimate guide to [topic]"
      ],
      "social_posts_weekly": {
        "monday": "Industry insight / trend",
        "wednesday": "Customer story / testimonial",
        "friday": "Behind the scenes / metric update"
      }
    }
  },

  "kpis_and_metrics": {
    "north_star_metric": "Weekly Active Users (WAU)",

    "month_1_targets": {
      "signups": 100,
      "activated_users": 30,
      "paying_customers": 3,
      "mrr": "$87"
    },

    "month_3_targets": {
      "signups": 500,
      "activated_users": 200,
      "paying_customers": 30,
      "mrr": "$870"
    },

    "month_6_targets": {
      "signups": 2000,
      "activated_users": 800,
      "paying_customers": 150,
      "mrr": "$4350"
    },

    "pivot_triggers": [
      "If activation rate < 20% after first 100 users → UX problem",
      "If CAC > LTV after 3 months → pricing or targeting problem",
      "If monthly churn > 10% → product-market fit problem",
      "If no organic signups after 2 months → distribution problem"
    ]
  },

  "risks_and_mitigation": [
    {
      "risk": "Low activation rate",
      "probability": "medium",
      "impact": "high",
      "mitigation": "Implement onboarding flow, add product tours, offer concierge onboarding"
    },
    {
      "risk": "High CAC from paid channels",
      "probability": "high",
      "impact": "medium",
      "mitigation": "Focus on organic/content, build community, leverage PLG"
    },
    {
      "risk": "Competitor launches similar feature",
      "probability": "medium",
      "impact": "medium",
      "mitigation": "Move fast, build moat through UX and integrations, focus on niche"
    }
  ]
}
\`\`\`

REQUIREMENTS:
- Be specific and actionable
- Include realistic numbers
- Prioritize $0 or low-cost tactics
- Focus on organic growth and PLG
- Consider the target market from the analysis
`,

  // ============================================
  // STAGE 4: Техническая реализация
  // ============================================
  STAGE4_TECHNICAL_IMPLEMENTATION: (strategy: string) => `
GTM STRATEGY:
${strategy}

---

You are a senior full-stack developer and AI engineer.

TASK: Create ready-to-use technical artifacts for implementing this business idea.

OUTPUT FORMAT (Markdown):

# 🛠 Technical Implementation Guide

## 1. MVP DEVELOPMENT PROMPT

Copy-paste this into Claude/ChatGPT to generate the MVP:

\`\`\`
I want to build [PRODUCT NAME] - [ONE SENTENCE DESCRIPTION].

TECH STACK:
- Frontend: [from strategy]
- Backend: [from strategy]
- Database: [from strategy]
- Payments: [from strategy]

KEY FEATURES (Priority order):
1. [Feature 1] - [User story]
2. [Feature 2] - [User story]
3. [Feature 3] - [User story]

PROJECT STRUCTURE:
\`\`\`
my-app/
├── app/                 # Next.js App Router
├── components/          # React components
├── lib/                 # Utilities and integrations
└── supabase/           # Database schema
\`\`\`

Please generate:
1. Complete database schema (Supabase SQL)
2. API routes for all features
3. Reusable components
4. Authentication setup
5. Payment integration (Stripe)
6. Deployment instructions (Vercel)

Make it production-ready with:
- Error handling
- Loading states
- Responsive design
- SEO optimization
- Analytics integration (Plausible or Simple Analytics)
\`\`\`

## 2. DATABASE SCHEMA

\`\`\`sql
-- Copy this into Supabase SQL editor

-- [Provide complete schema based on features]

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- [Other tables based on features]
\`\`\`

## 3. LANDING PAGE PROMPT

\`\`\`
Create a high-converting landing page for [PRODUCT NAME].

STRUCTURE:
1. Hero Section
   - Headline: [Compelling benefit]
   - Subheadline: [Explain what it does]
   - CTA: [Action]
   - Visual: [Screenshot/demo]

2. Problem Section
   - Paint the pain points

3. Solution Section
   - How we solve it
   - Key features with icons

4. Social Proof
   - [If available: testimonials, logos, numbers]

5. Pricing
   - [3 tiers from strategy]

6. FAQ
   - [Common questions]

7. Final CTA

DESIGN:
- Clean, modern, minimal
- Colors: [Brand colors]
- Font: Inter or similar
- Dark mode optional

TECH:
- Next.js + Tailwind CSS
- shadcn/ui components
- Framer Motion animations
- Fast loading (<1s)

Please generate the complete code.
\`\`\`

## 4. CONTENT GENERATION PROMPTS

### Blog Post Generator
\`\`\`
Write a comprehensive blog post:

Topic: [FROM CONTENT CALENDAR]
Target keyword: [SEO keyword]
Audience: [Target customer]
Word count: 1500-2000

Structure:
- Engaging introduction (hook + promise)
- H2 sections with actionable insights
- Examples and data
- Internal links to product
- Strong CTA at the end

Tone: [Professional but friendly / Technical / Casual]
\`\`\`

### Social Media Content
\`\`\`
Create 30 days of social media content for [PLATFORM].

Format for each post:
- Hook (first line)
- Value/insight
- CTA or question
- Relevant hashtags

Topics to cover:
- Product updates
- Industry insights
- Customer wins
- Behind-the-scenes
- Tips and tricks
\`\`\`

## 5. CUSTOMER SUPPORT AI AGENT

\`\`\`
You are the support agent for [PRODUCT NAME].

KNOWLEDGE BASE:
- Product: [Description]
- Key features: [List]
- Pricing: [Tiers]
- Common issues: [List]

TONE: Friendly, helpful, concise

INSTRUCTIONS:
1. Greet the user
2. Understand their question
3. Provide clear answer with steps if needed
4. Offer to escalate to human if complex
5. Ask if they need anything else

EXAMPLES:
Q: How do I [common question]?
A: [Step-by-step answer]

Q: What's the difference between Free and Pro?
A: [Clear comparison]
\`\`\`

## 6. AUTOMATION WORKFLOWS

### Email Sequence (Welcome)
\`\`\`
Day 0 (Immediate): Welcome Email
Subject: Welcome to [Product]! 🎉
Content:
- Thank you for signing up
- What to expect
- Quick start guide
- CTA: Complete your profile

Day 2: Feature Highlight #1
Subject: Did you know [Product] can [benefit]?
Content:
- Highlight killer feature
- How-to with screenshots
- Customer example
- CTA: Try this feature

Day 5: Success Story
Subject: How [Customer Name] achieved [Result] with [Product]
Content:
- Case study
- Metrics
- How they did it
- CTA: Get similar results

Day 7: Upgrade Prompt
Subject: You're getting the most out of the Free plan 🚀
Content:
- Usage stats
- What you're missing on Pro
- Limited-time offer (20% off first month)
- CTA: Upgrade now
\`\`\`

### Analytics Events to Track
\`\`\`javascript
// Copy into your analytics setup

// Key events
track('user_signup', { source });
track('user_activated', { time_to_activation });
track('feature_used', { feature_name });
track('upgrade_clicked', { from_plan, to_plan });
track('payment_success', { plan, amount });
track('user_churned', { reason, days_active });
\`\`\`

## 7. DEPLOYMENT CHECKLIST

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate (automatic on Vercel)
- [ ] Custom domain connected
- [ ] Analytics installed
- [ ] Error monitoring (Sentry or similar)
- [ ] Backup strategy
- [ ] Rate limiting configured
- [ ] SEO meta tags
- [ ] robots.txt and sitemap.xml
- [ ] Terms of Service and Privacy Policy pages

---

**All prompts are ready to copy-paste and use. Just replace [PLACEHOLDERS] with your specifics.**
`,
};

// ============================================
// ФУНКЦИИ ДЛЯ УДОБСТВА
// ============================================

export function getPrompt(stage: string, ...args: any[]): string {
  switch (stage) {
    case 'discover':
      return PROMPTS.STAGE1_DISCOVER_IDEAS;

    case 'analyze':
      return PROMPTS.STAGE2_DEEP_ANALYSIS(args[0], args[1]);

    case 'strategy':
      return PROMPTS.STAGE3_GTM_STRATEGY(args[0]);

    case 'technical':
      return PROMPTS.STAGE4_TECHNICAL_IMPLEMENTATION(args[0]);

    default:
      throw new Error(`Unknown stage: ${stage}`);
  }
}
