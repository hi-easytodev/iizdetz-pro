# 🚀 AI Idea Analyzer

Полнофункциональная платформа для автоматического анализа и проработки бизнес-идей с использованием цепочки AI-промптов. Система использует **Perplexity Deep Research** для сбора информации из максимального количества источников (YouTube, Telegram, Reddit, форумы, паблики, новости, отзывы и др.), анализирует их через последовательные этапы обработки с использованием нескольких AI-провайдеров и представляет финальную документацию в интерактивном дашборде.

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
- **VK, Facebook, Instagram** - русскоязычные и международные сообщества

### 🎥 Видеоплатформы
- **YouTube** - каналы, комментарии, обзоры
- **TikTok** - вирусные тренды
- **Podcasts** - экспертные мнения

### 💬 Мессенджеры и форумы
- **Telegram** - каналы, публичные группы
- **Discord, Slack** - комьюнити серверы
- **Hacker News, Stack Overflow, Quora** - технические дискуссии
- **Dev.to, Hashnode** - блоги разработчиков

### 🇷🇺 Русскоязычные источники
- **VC.ru** - бизнес и стартапы
- **Habr.com** - технологии и IT
- **Telegram каналы** - экспертные сообщества
- **VK паблики** - тематические группы

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

// Русскоязычные источники
preset: 'russian'
// → VC.ru, Habr, VK, Telegram, YouTube RU

// Все источники (максимальный охват)
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
│   └── api/               # API Routes (в разработке)
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   └── ...               # Кастомные компоненты
├── lib/                   # Утилиты
│   ├── db/               # Database helpers
│   └── utils.ts          # Общие утилиты
└── types/                 # TypeScript типы
```

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

### ✅ Завершено (Этап 1-2)
- [x] Базовая структура проекта
- [x] UI компоненты и дизайн
- [x] Главная страница с сеткой идей
- [x] Страница "Что делать"
- [x] Схема базы данных
- [x] **AI API Wrappers** (Perplexity, Claude, Gemini)
- [x] **Deep Research Integration** с comprehensive source coverage
- [x] **Multi-Provider Fallback System** с автоматическим переключением
- [x] **Comprehensive Prompt Library** для всех этапов pipeline

### 🚧 В разработке (Этап 3)
- [ ] Pipeline Orchestrator (оркестрация 6 этапов)
- [ ] API Routes (`/api/pipeline/trigger`, `/api/ideas/analyze`)
- [ ] Детальная страница с полным анализом
- [ ] Vercel Cron Jobs для автоматического сбора идей
- [ ] Интеграция с базой данных Postgres

---

**Made with ❤️ using Next.js, Tailwind CSS, and AI**
