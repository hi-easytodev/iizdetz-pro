# 🚀 AI Idea Analyzer

Полнофункциональная платформа для автоматического анализа и проработки бизнес-идей с использованием цепочки AI-промптов. Система использует **Perplexity Deep Research** для сбора информации из максимального количества источников (YouTube, Telegram, Reddit, forums, social media, news, reviews, etc.), анализирует их через последовательные этапы обработки с использованием нескольких AI-провайдеров и представляет финальную документацию в интерактивном дашборде.

**TARGET MARKET: US market focus** - все исследования и анализ ориентированы на американский рынок.

**КРИТИЧЕСКОЕ ТРЕБОВАНИЕ:** Весь проект работает на **100% бесплатной инфраструктуре** без финансовых вложений.

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
- **Иконки:** Lucide React

### AI Integration (Multi-Provider с Fallback)
- **Deep Research:** Perplexity AI (Sonar Huge Online)
- **Analysis & Strategy:** Claude 3.5 Sonnet, Gemini 1.5 Flash
- **Fallback Chain:** Автоматическое переключение между провайдерами
- **Free Tier Providers:** Gemini (1500 req/day), Together AI, Groq, OpenRouter
- **Premium Options:** Claude Opus, GPT-4, Mistral

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

1. Клонируйте репозиторий
2. Установите зависимости: `npm install`
3. Скопируйте `.env.local.example` → `.env.local`
4. Заполните переменные окружения
5. Запустите dev сервер: `npm run dev`

Откройте [http://localhost:3000](http://localhost:3000)

---

## 📁 Структура проекта

```
iizdetz-pro/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Главная страница
│   ├── what-to-do/        # "Что делать"
│   ├── idea/[id]/         # Детальная страница
│   └── api/
│       └── analyze/       # 8-stage analysis API
│           └── route.ts   # POST/GET endpoints
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   └── ...               # Кастомные компоненты
├── lib/                   # Утилиты
│   ├── ai/
│   │   ├── pipeline.ts    # 8-stage analysis orchestrator
│   │   ├── perplexity.ts  # Deep Research wrapper
│   │   ├── claude.ts      # Claude API wrapper
│   │   └── gemini.ts      # Gemini API wrapper
│   ├── db/               # Database helpers
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

### ✅ Завершено (Этапы 1-4)
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

### 🚧 В разработке (Этап 5)
- [ ] Export результатов анализа (Markdown, PDF)
- [ ] Vercel Cron Jobs для автоматического сбора идей
- [ ] Сравнение нескольких идей side-by-side
- [ ] Фильтрация и поиск по идеям
- [ ] User authentication и saved analyses

---

**Made with ❤️ using Next.js, Tailwind CSS, and AI**
