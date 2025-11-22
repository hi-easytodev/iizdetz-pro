# ЭТАП 7: ТЕХНОЛОГИЧЕСКАЯ ВЫПОЛНИМОСТЬ

РОЛЬ: Ты — CTO с опытом запуска 15+ MVP за < 3 месяца каждый.

КОНТЕКСТ:
{STAGES_1_TO_6}

ИДЕЯ: {IDEA_TITLE}
CORE VALUE PROPOSITION: {DESCRIPTION}
ОГРАНИЧЕНИЯ: $0 budget, 1-2 developers, 8-12 weeks

---

## ЧАСТЬ 1: АНАЛИЗ МИНИМАЛЬНОГО ФУНКЦИОНАЛА

### 1.1 Core Features (Must-have для MVP)

| Feature | Description | Complexity | Time estimate | Dependencies |
|---------|------------|-----------|--------------|--------------|
| | | Low/Med/High | X days | |

**Минимум:** 5-8 core features

### 1.2 Nice-to-have (V2)
Features для post-MVP

### 1.3 Feature prioritization matrix
Impact/Effort matrix

---

## ЧАСТЬ 2: TECH STACK SELECTION

### 2.1 Frontend
**Option 1: Next.js + Tailwind CSS**
- Pros: Fast dev, SEO-friendly, free hosting (Vercel)
- Cons: Learning curve
- Cost: $0
- Deployment: Vercel free tier

**RECOMMENDATION:** [Выбор с обоснованием]

### 2.2 Backend
**Option 1: Serverless (Vercel Functions / Supabase)**
- Pros: No server management, pay-per-use
- Cons: Cold starts, vendor lock-in
- Cost: $0-$25/mo

**Option 2: Traditional (Node.js + Railway)**
- Cost: $5-$10/mo

**RECOMMENDATION:** [Выбор]

### 2.3 Database
**Option 1: PostgreSQL (Supabase free tier)**
- Limits: 500MB storage, 2GB bandwidth
- Features: Built-in auth, real-time, REST API
- Cost: $0

**Schema design:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE ideas (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR,
  description TEXT,
  status VARCHAR,
  created_at TIMESTAMP
);

CREATE TABLE analyses (
  id UUID PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id),
  stage VARCHAR,
  content TEXT,
  created_at TIMESTAMP
);
```

### 2.4 Authentication
Supabase Auth / Clerk / NextAuth

### 2.5 AI/ML Components

| Component | Provider | Free tier | Cost beyond free |
|-----------|----------|-----------|-----------------|
| LLM API | OpenAI GPT-4o | $5 credit | $0.01/1K tokens |
| LLM API | Claude | $5 credit | $0.015/1K tokens |

**Optimization:** Prompt caching, streaming, rate limiting
**Monthly cost:** $X-$Y at Z users

### 2.6 Auxiliary Services

| Service | Provider | Free tier | Paid |
|---------|----------|-----------|------|
| Email | Resend | 3K/mo | $20/mo |
| Analytics | Plausible | Self-host | $9/mo |
| Monitoring | Sentry | 5K events/mo | $26/mo |
| Storage | Supabase | 1GB | $0.021/GB |

**Total monthly cost:** $0-$50

---

## ЧАСТЬ 3: ARCHITECTURE DESIGN

### 3.1 System diagram
```
[User Browser]
  ↓
[Next.js Frontend (Vercel)]
  ↓
[API Routes / Serverless Functions]
  ↓ ↙ ↘
[PostgreSQL] [Perplexity API] [External API]
```

### 3.2 Data flow
User flow с latency estimates

---

## ЧАСТЬ 4: MVP DEVELOPMENT ROADMAP

### 4.1 Timeline (8 weeks, 2 developers)

| Week | Tasks | Deliverables | Hours |
|------|-------|-------------|-------|
| 1 | Setup + Design | Figma, repo | 40h |
| 2-3 | Core backend | Auth, DB, APIs | 80h |
| 4-5 | Core frontend | Main pages | 80h |
| 6 | Integration | FE + BE + AI | 40h |
| 7 | Testing | Bug fixes | 40h |
| 8 | Launch prep | Docs, analytics | 40h |

**Total:** 320 developer hours

**Milestones:**
- Week 3: Backend MVP
- Week 5: Frontend alpha
- Week 7: Closed beta
- Week 8: Public launch

---

## ЧАСТЬ 5: ТЕХНИЧЕСКИЕ РИСКИ

| Risk | Probability | Impact | Mitigation |
|------|-----------|--------|------------|
| AI API cost overrun | Medium | High | Caching, rate limits |
| Scaling issues | Low | Medium | Serverless, CDN |
| Data privacy | Medium | High | GDPR compliance |

---

## ЧАСТЬ 6: SCALABILITY PLAN

**Stage 1: 0-100 users** - Current stack sufficient, $0-$10/mo
**Stage 2: 100-1K users** - Add Redis, upgrade Supabase, $35-$50/mo
**Stage 3: 1K-10K users** - Upgrade DB, add CDN, $135-$150/mo
**Stage 4: 10K+ users** - Microservices, $500+/mo

---

## ЧАСТЬ 7: TIME TO MARKET

**Critical Path:** Design (1w) → Backend (2w) → Frontend (2w) → Integration (1w) → Testing (1w) → Launch (1w)
**Total:** 8 weeks
**Minimum:** 6 weeks (with templates, skip nice-to-haves)

---

## ЧАСТЬ 8: POST-MVP ROADMAP

Version 2 features (Month 3-6), technical debt to address

---

## ФОРМАТ ВЫВОДА

1. **Tech Stack Summary** (1-page)
2. **Детальный tech spec** (4000+ слов)
3. **Database schema** (SQL)
4. **API documentation** (OpenAPI)
5. **Roadmap Gantt chart** (JSON/CSV)
6. **Cost calculator** (spreadsheet)
7. **Starter templates** для ключевых компонентов
