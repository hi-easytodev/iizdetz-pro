# 🚀 AI Idea Analyzer

Полнофункциональная платформа для автоматического анализа и проработки бизнес-идей с использованием цепочки AI-промптов. Система использует **Perplexity Deep Research** для сбора информации из максимального количества источников (YouTube, Telegram, Reddit, forums, social media, news, reviews, etc.), анализирует их через последовательные этапы обработки с использованием нескольких AI-провайдеров и представляет финальную документацию в интерактивном дашборде.

**TARGET MARKET: US market focus** - все исследования и анализ ориентированы на американский рынок.

**КРИТИЧЕСКОЕ ТРЕБОВАНИЕ:** Весь проект работает на **100% бесплатной инфраструктуре** без финансовых вложений.

---

## ✨ Ключевые возможности

### 🧠 AI-Powered Analysis
- **8-этапный анализ** - комплексное исследование от рынка до клиентской психологии
- **Deep Research** - анализ 200+ источников через Perplexity AI
- **Multi-Provider Fallback** - автоматическое переключение между AI-провайдерами
- **Smart Context Optimization** - 95% снижение использования токенов

### 📊 Analytics & Insights
- **Real-time Dashboard** - метрики в реальном времени
- **Trend Analysis** - графики трендов за последние 30 дней
- **Performance Metrics** - отслеживание всех ключевых показателей
- **Top Ideas Ranking** - автоматический рейтинг идей по engagement

### 🔐 User Management
- **OAuth Authentication** - вход через Google и GitHub
- **Personalized Experience** - сохранение анализов и истории
- **User Profiles** - управление настройками и подписками

### 📧 Email Notifications
- **Daily Digest** - топ-5 новых идей каждый день
- **Analysis Complete** - уведомления о завершении анализа
- **Subscription Management** - гибкие настройки частоты

### 📄 Export & Sharing
- **PDF Export** - красиво оформленные PDF-отчеты
- **Markdown Export** - экспорт в формате Markdown
- **Direct Sharing** - прямые ссылки на анализы

### 🤖 Automation
- **Cron Jobs** - автоматический сбор идей из Reddit, Product Hunt, Hacker News
- **Smart Scraping** - дедупликация и scoring идей
- **Automated Notifications** - автоматические email-рассылки

---

## 📋 Технический стек

### Frontend & Hosting
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui компоненты
- **Хостинг:** Vercel Free Tier
- **База данных:** Vercel Postgres или Supabase Free tier

### Визуализация и UI
- **Графики:** Recharts
- **Анимации:** Framer Motion
- **Уведомления:** React Hot Toast
- **Иконки:** Lucide React, React Icons
- **PDF:** @react-pdf/renderer

### Authentication & User Management
- **Auth:** NextAuth.js v5
- **OAuth Providers:** Google, GitHub
- **Session:** JWT-based (no database sessions)
- **Email:** Resend for transactional emails

### AI Integration (Multi-Provider с Fallback)
- **Deep Research:** Perplexity AI (Sonar Huge Online)
- **Analysis & Strategy:** Claude 3.5 Sonnet, Gemini 1.5 Flash
- **Fallback Chain:** Автоматическое переключение между провайдерами
- **Free Tier Providers:** Gemini (1500 req/day), Together AI, Groq, OpenRouter
- **Premium Options:** Claude Opus, GPT-4, Mistral
- **Context Optimization:** Smart summary extraction (95% token reduction)

### Data Collection & Automation
- **Idea Sources:** Reddit, Product Hunt, Hacker News
- **Cron Jobs:** Vercel Cron (daily at 8:00 AM UTC)
- **Scraping:** Parallel execution with deduplication
- **Scoring:** Engagement-based ranking

---

## 🔍 Deep Research - Comprehensive Source Coverage

Система использует Perplexity Deep Research для сбора информации из **максимального количества доступных источников**:

### 🌐 Социальные сети и сообщества
- **Reddit** - обсуждения, проблемы пользователей
- **Twitter/X, LinkedIn** - тренды, мнения экспертов
- **Facebook, Instagram** - сообщества и бизнес-контент

### 🎥 Видеоплатформы
- **YouTube** - каналы, комментарии, обзоры
- **TikTok** - вирусные тренды
- **Podcasts** - экспертные мнения

### 💬 Мессенджеры и форумы
- **Telegram** - каналы, публичные группы
- **Discord, Slack** - комьюнити серверы
- **Hacker News, Stack Overflow, Quora** - технические дискуссии
- **Dev.to, Hashnode** - блоги разработчиков

### 📰 Новости и аналитика
- **TechCrunch, VentureBeat, The Verge** - технологические новости
- **Medium, Substack** - аналитические статьи
- **Crunchbase, AngelList, PitchBook** - данные о финансировании

### ⭐ Отзывы и оценки
- **G2, Capterra, Trustpilot** - отзывы на продукты
- **App Store, Google Play** - отзывы пользователей приложений
- **Product Hunt** - запуски новых продуктов

### 📊 Preset наборы источников

```typescript
// Для поиска идей (акцент на дискуссиях)
preset: 'idea_discovery'
// → Reddit, Twitter, YouTube, Telegram, forums, reviews

// Для анализа рынка (акцент на аналитике)
preset: 'market_analysis'
// → TechCrunch, Crunchbase, news, startup platforms

// Для анализа конкурентов
preset: 'competitor'
// → G2, Capterra, Product Hunt, app reviews

// Все источники (максимальный охват - US market focus)
preset: 'all'
```

---

## 🚀 Быстрый старт

### Установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/yourusername/iizdetz-pro.git
cd iizdetz-pro
```

2. **Установите зависимости**
```bash
npm install
```

3. **Настройте переменные окружения**
```bash
cp .env.example .env.local
```

Заполните `.env.local`:
```env
# Database (Vercel Postgres)
POSTGRES_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AI Services
PERPLEXITY_API_KEY="pplx-xxxxx"
ANTHROPIC_API_KEY="sk-ant-xxxxx"  # Optional
OPENAI_API_KEY="sk-xxxxx"          # Optional

# Email (Resend)
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="noreply@yourdomain.com"

# Cron Security
CRON_SECRET="your-secure-secret"
```

4. **Запустите миграции базы данных**
```bash
psql $POSTGRES_URL -f lib/db/schema.sql
psql $POSTGRES_URL -f lib/db/migrations/001_add_summary_column.sql
psql $POSTGRES_URL -f lib/db/migrations/002_add_users_and_auth.sql
psql $POSTGRES_URL -f lib/db/migrations/003_add_email_subscriptions.sql
```

5. **Запустите dev сервер**
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Настройка OAuth Providers

#### Google OAuth
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте проект и включите Google+ API
3. Создайте OAuth Client ID
4. Добавьте redirect URI: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth
1. Перейдите в [GitHub Developer Settings](https://github.com/settings/developers)
2. Создайте новое OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

Подробнее: [`docs/AUTHENTICATION.md`](./docs/AUTHENTICATION.md)

---

## 📁 Структура проекта

```
iizdetz-pro/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Главная страница
│   ├── analytics/         # Analytics Dashboard ✨
│   ├── auth/signin/       # Sign in page ✨
│   ├── compare/           # Idea comparison
│   ├── what-to-do/        # "Что делать"
│   ├── idea/[id]/         # Детальная страница
│   └── api/
│       ├── analyze/       # 8-stage analysis API
│       ├── analytics/     # Analytics data ✨
│       ├── auth/          # NextAuth.js ✨
│       ├── cron/          # Vercel Cron Jobs
│       └── export/pdf/    # PDF export ✨
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   ├── analytics/        # Analytics charts ✨
│   ├── AuthButton.tsx    # Auth UI ✨
│   ├── ExportPDFButton.tsx # PDF export ✨
│   ├── SessionProvider.tsx # Auth wrapper ✨
│   └── ...               # Другие компоненты
├── lib/                   # Утилиты
│   ├── ai/
│   │   ├── pipeline.ts    # 8-stage analysis orchestrator
│   │   ├── extraction.ts  # Summary extraction ✨
│   │   ├── perplexity.ts  # Deep Research wrapper
│   │   ├── claude.ts      # Claude API wrapper
│   │   └── gemini.ts      # Gemini API wrapper
│   ├── auth.ts           # NextAuth config ✨
│   ├── db/               # Database helpers
│   │   ├── index.ts      # DB functions
│   │   ├── schema.sql    # Database schema
│   │   └── migrations/   # DB migrations ✨
│   ├── email/            # Email service ✨
│   │   └── resend.ts     # Resend integration
│   ├── pdf/              # PDF generation ✨
│   │   └── IdeaAnalysisPDF.tsx
│   ├── scraper/          # Idea scraping ✨
│   └── utils.ts          # Общие утилиты
├── prompts/               # Analysis prompt templates
│   ├── stage-1-market.md  # Market analysis
│   ├── stage-2-demand.md  # Demand & pain points
│   ├── stage-3-communities.md  # Communities
│   ├── stage-4-competition.md  # Competitive analysis
│   ├── stage-5-forecast.md     # Market forecast
│   ├── stage-6-gtm.md     # Go-to-market strategy
│   ├── stage-7-tech.md    # Technical feasibility
│   └── stage-8-customers.md    # Customer psychology
├── docs/                  # Documentation
│   ├── AUTHENTICATION.md  # Auth setup guide ✨
│   ├── PDF_EXPORT.md      # PDF docs ✨
│   ├── PIPELINE_OPTIMIZATION.md # Context optimization
│   └── CRON_SETUP.md      # Cron job setup
└── types/                 # TypeScript типы
```

---

## 🧠 8-Stage Analysis Pipeline

Система автоматического анализа бизнес-идей использует последовательную обработку через 8 этапов, где каждый этап использует результаты предыдущих для создания комплексного исследования.

### 📊 Этапы анализа

#### 1️⃣ **Market Analysis** (Анализ рынка)
- **TAM/SAM/SOM** - размер рынка и сегментация
- **Growth drivers** - драйверы роста индустрии
- **Revenue potential** - потенциал доходов
- **Key trends** - ключевые тренды (US market focus)
- **Preset:** `market_analysis`
- **Output:** 3000+ слов + 30+ источников

#### 2️⃣ **Demand Analysis** (Анализ спроса и болей)
- **Search demand** - объем поиска и SEO метрики
- **Pain points** - матрица болевых точек (JTBD framework)
- **Willingness to pay** - готовность платить
- **Feature requests** - неудовлетворенные потребности
- **Preset:** `idea_discovery`
- **Output:** 2500+ слов + 20+ источников

#### 3️⃣ **Communities** (Сообщества и инфлюенсеры)
- **Reddit, YouTube, Twitter/X** - активные сообщества
- **Discord, Telegram** - закрытые комьюнити
- **Top influencers** - топ-10 инфлюенсеров в нише
- **Content distribution** - каналы распространения
- **Preset:** `idea_discovery`
- **Output:** 2000+ слов + 25+ источников

#### 4️⃣ **Competitive Analysis** (Конкурентный анализ)
- **Top 5 competitors** - SWOT для каждого
- **Feature comparison** - сравнительная таблица
- **Pricing models** - модели ценообразования
- **Market gaps** - незакрытые ниши
- **Preset:** `competitor`
- **Output:** 3500+ слов + 35+ источников

#### 5️⃣ **Forecast** (Прогноз развития рынка)
- **12-24 month predictions** - сценарии развития
- **Technology trends** - технологические изменения
- **Regulatory changes** - законодательные риски
- **Timing recommendations** - когда запускать
- **Preset:** `market_analysis`
- **Output:** 2500+ слов + 25+ источников

#### 6️⃣ **GTM Strategy** (Go-to-Market стратегия)
- **Sales funnel** - дизайн воронки продаж
- **Pricing tiers** - структура цен
- **First 100 customers** - план привлечения
- **Revenue projections** - прогноз выручки на 12 мес
- **Preset:** `idea_discovery`
- **Output:** 3000+ слов + 30+ источников

#### 7️⃣ **Technical Feasibility** (Техническая реализуемость)
- **Tech stack** - рекомендуемый стек (free tier приоритет)
- **MVP timeline** - roadmap на 3-6 месяцев
- **Development costs** - оценка стоимости разработки
- **Team requirements** - необходимые компетенции
- **Preset:** `all`
- **Output:** 2500+ слов + 20+ источников

#### 8️⃣ **Customer Psychology** (Психология клиентов)
- **Jobs-to-be-done** - функциональные и эмоциональные работы
- **Buying journey** - путь покупателя (5 стадий)
- **3 Customer personas** - детальные портреты
- **Objection handling** - топ-10 возражений + ответы
- **Preset:** `idea_discovery`
- **Output:** 4000+ слов + 30+ источников

### 🔄 Как работает Pipeline

```typescript
// 1. Запуск анализа через API
POST /api/analyze
{
  "ideaId": 123
}

// 2. Pipeline загружает идею из БД
const idea = await query('SELECT * FROM ideas WHERE id = $1', [ideaId]);

// 3. Последовательно выполняет 8 этапов
for (const stage of stages) {
  // 3.1 Загружает prompt-шаблон из prompts/stage-X.md
  const template = await loadPrompt(stage);

  // 3.2 Подставляет переменные (idea title, предыдущие результаты)
  const prompt = fillPrompt(template, {
    IDEA_TITLE: idea.title,
    STAGE_1_MARKET: results.market.analysis,
    // ... накопленный контекст
  });

  // 3.3 Отправляет в Perplexity Deep Research
  const response = await deepResearch(prompt, {
    preset: 'market_analysis', // или другой preset
    searchRecency: 'month'
  });

  // 3.4 Сохраняет результат в БД
  await saveStageResult(ideaId, stage, {
    analysis: response.analysis,
    citations: response.citations,
    relatedQuestions: response.relatedQuestions
  });
}

// 4. Возвращает все результаты
return {
  success: true,
  ideaId: 123,
  stages: { market, demand, communities, competition, forecast, gtm, tech, customers },
  totalSources: 215 // сумма всех citations
}
```

### 📡 API Endpoints

#### POST `/api/analyze`
Запускает полный 8-этапный анализ для идеи.

#### GET `/api/cron/collect-ideas`
**Автоматический сбор идей** (Vercel Cron Job)

Собирает новые бизнес-идеи из различных источников:
- **Hacker News** - Show HN posts ✅
- **Reddit** - 8 subreddits (r/SaaS, r/Entrepreneur, r/startups, r/SideProject, etc.) ✅
- **Product Hunt** - Top products via GraphQL API ✅

**Cron Schedule:** Ежедневно в 8:00 AM UTC (`0 8 * * *`)

**Features:**
- Parallel scraping from all sources
- Automatic deduplication
- Engagement-based scoring
- Email notifications to subscribed users (top 5 ideas)

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-11-22T08:00:00Z",
  "stats": {
    "collected": 80,
    "unique": 65,
    "saved": 45,
    "skipped": 20,
    "errors": 0,
    "emailsSent": 12
  }
}
```

См. подробную документацию: [`docs/CRON_SETUP.md`](./docs/CRON_SETUP.md)

#### GET `/api/export/pdf/[ideaId]`
**PDF Export** - Экспорт анализа в PDF

Генерирует красиво оформленный PDF-отчет с полным анализом идеи.

**Response:** Binary PDF file (200-500 KB)

**Features:**
- Professional multi-page layout
- Cover page with metadata
- 8 analysis sections with key insights
- Citations and sources
- Executive summary
- Recommended next steps

См. документацию: [`docs/PDF_EXPORT.md`](./docs/PDF_EXPORT.md)

#### GET `/api/analytics`
**Analytics Dashboard Data** - Метрики и статистика

Возвращает комплексную аналитику платформы:

**Response:**
```json
{
  "totals": {
    "total_ideas": "156",
    "total_analyses": "423",
    "total_users": "42",
    "completed_runs": "138"
  },
  "distribution": {
    "sources": [
      { "source": "reddit", "count": "85" },
      { "source": "hackernews", "count": "45" },
      { "source": "producthunt", "count": "26" }
    ],
    "categories": [...],
    "statuses": [...]
  },
  "trends": {
    "daily": [
      { "date": "2025-11-22", "count": "15" },
      ...
    ]
  },
  "topIdeas": [...],
  "topUsers": [...]
}
```

**Request:**
```json
{
  "ideaId": 123
}
```

**Response:**
```json
{
  "success": true,
  "ideaId": 123,
  "stages": {
    "market": {
      "stage": "market",
      "analysis": "3000+ word analysis...",
      "citations": ["https://...", "https://..."],
      "relatedQuestions": ["...", "..."],
      "completedAt": "2025-01-15T10:30:00Z"
    },
    "demand": { ... },
    "communities": { ... },
    "competition": { ... },
    "forecast": { ... },
    "gtm": { ... },
    "tech": { ... },
    "customers": { ... }
  },
  "totalSources": 215,
  "completedAt": "2025-01-15T10:35:00Z"
}
```

**Timing:** ~5 минут для полного анализа (8 stages × ~30-40 сек каждый)

#### GET `/api/analyze?ideaId=123`
Получает существующие результаты анализа.

**Response:**
```json
{
  "success": true,
  "ideaId": 123,
  "stages": { ... },
  "stageCount": 8,
  "totalSources": 215
}
```

### 🎯 Prompt System

Каждый этап использует детальный prompt-шаблон из директории `prompts/`:

- **stage-1-market.md** - роль: senior аналитик McKinsey
- **stage-2-demand.md** - роль: SEO & UX researcher
- **stage-3-communities.md** - роль: community strategist
- **stage-4-competition.md** - роль: competitive intelligence analyst
- **stage-5-forecast.md** - роль: market forecaster & futurist
- **stage-6-gtm.md** - роль: growth marketing strategist
- **stage-7-tech.md** - роль: CTO & solution architect
- **stage-8-customers.md** - роль: customer psychologist

Каждый prompt включает:
- Четкое определение роли
- Контекст от предыдущих этапов
- Детальную структуру вывода
- Минимальные требования (word count, sources)
- US market focus

---

## 🎨 Дизайн

Темная тема с акцентами:
- Фиолетовый (#8b5cf6)
- Золотистый (#d4a574)
- Темно-синий фон (#1a1a2e)

---

## 🔧 Разработка

```bash
npm run dev      # Разработка
npm run build    # Сборка
npm start        # Production
npm run lint     # Линтинг
```

---

## 📦 Деплой на Vercel

1. Подключите GitHub репозиторий к Vercel
2. Добавьте переменные окружения
3. Deploy автоматически при push

---

## 🎯 Статус проекта

### ✅ Завершено (Этапы 1-6)

#### Этап 1-5: Базовый функционал
- [x] Базовая структура проекта
- [x] UI компоненты и дизайн
- [x] Главная страница с сеткой идей
- [x] Страница "Что делать"
- [x] Схема базы данных
- [x] **AI API Wrappers** (Perplexity, Claude, Gemini)
- [x] **Deep Research Integration** с comprehensive source coverage
- [x] **Multi-Provider Fallback System** с автоматическим переключением
- [x] **8-Stage Analysis Pipeline** (`lib/ai/pipeline.ts`)
- [x] **Prompt Template System** (8 шаблонов в `prompts/`)
- [x] **Analysis API Endpoints** (`/api/analyze`, `/api/analyze/stream`)
- [x] **Custom Niche Research** компонент
- [x] **Детальная страница идеи** с полным UI для 8 этапов анализа
- [x] **Real-time Progress Indicator** с Server-Sent Events (SSE)
- [x] **Export результатов анализа** (Markdown)
- [x] **Фильтрация и поиск по идеям** (текст, категории)
- [x] **Сравнение идей side-by-side** (/compare page)

#### Этап 6: Advanced Features ✨ **ЗАВЕРШЕНО**
- [x] **PDF Export** - красивые PDF-отчеты с @react-pdf/renderer
  - Multi-page layout с обложкой и 8 секциями
  - API: `GET /api/export/pdf/[ideaId]`
  - Компонент: `<ExportPDFButton />`
  - Документация: `docs/PDF_EXPORT.md`

- [x] **Reddit API Integration** - автоматический сбор из 8 subreddits
  - r/SaaS, r/Entrepreneur, r/startups, r/SideProject, и др.
  - Параллельное выполнение
  - Фильтрация по score (≥5, без NSFW)

- [x] **Product Hunt API Integration** - GraphQL API для топ-постов
  - Извлечение названий, описаний, категорий
  - Graceful fallback при ошибках

- [x] **User Authentication** - NextAuth.js v5 с OAuth
  - Провайдеры: Google, GitHub
  - JWT-based sessions
  - Автосоздание пользователей
  - Protected routes
  - UI: `/auth/signin`, `<AuthButton />`
  - Документация: `docs/AUTHENTICATION.md`

- [x] **Advanced Analytics** - реал-тайм дашборд
  - Dashboard: `/analytics`
  - 4 интерактивных графика (Recharts)
  - Метрики: идеи, анализы, пользователи, runs
  - Топ идеи и активные пользователи
  - API: `GET /api/analytics`

- [x] **Email Notifications** - Resend integration
  - Ежедневный digest (топ-5 идей)
  - Уведомления о завершении анализа
  - HTML templates с градиентами
  - Subscription management
  - Email tracking в БД

- [x] **Pipeline Optimization** - 95% снижение токенов
  - Smart summary extraction
  - Context optimization (28,700 → 1,400 tokens)
  - Database caching для summaries
  - Retry + fallback механизмы
  - Документация: `docs/PIPELINE_OPTIMIZATION.md`

- [x] **Vercel Cron Jobs** - расширенная автоматизация
  - Источники: Reddit, Product Hunt, Hacker News
  - Deduplication и scoring
  - Email notifications для подписчиков
  - Schedule: Daily at 8:00 AM UTC

### 📊 Статистика реализации
- **Всего функций:** 30+
- **API Endpoints:** 6
- **Компонентов:** 40+
- **Строк кода:** ~15,000
- **Документации:** 5 файлов
- **Database Tables:** 7
- **Миграций:** 3

### 🎉 Результаты Этапа 6
- ✅ **100% бесплатная инфраструктура** сохранена
- ✅ **95% снижение токенов** в pipeline
- ✅ **Полная автоматизация** сбора и уведомлений
- ✅ **Production-ready** authentication и analytics
- ✅ **Professional PDF export** для sharing

---

**Made with ❤️ using Next.js, Tailwind CSS, and AI**
