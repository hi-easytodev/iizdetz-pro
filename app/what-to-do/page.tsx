'use client';

import { StepCard } from '@/components/StepCard';
import { FeatureCard } from '@/components/FeatureCard';

export default function WhatToDoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Что делать дальше?
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Простой путь от идеи до работающего бизнеса. Следуй этим шагам и
          получи результат.
        </p>
      </div>

      {/* 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StepCard
          number={1}
          title="Выбери идею для бизнеса"
          description="Изучи нашу подборку проверенных идей с готовым анализом рынка и финансовыми прогнозами."
          color="blue"
        />
        <StepCard
          number={2}
          title="Изучи финансовую модель"
          description="Посмотри, сколько можно заработать, какие расходы и как быстро выйти на прибыль."
          color="gold"
        />
        <StepCard
          number={3}
          title="Получи чёткий арсенал"
          description="Готовые AI-промпты для разработки MVP, контента, маркетинга и автоматизации."
          color="purple"
        />
        <StepCard
          number={4}
          title="Запусти с AI и поддержкой"
          description="Используй наши инструменты и шаблоны для быстрого запуска проекта без программирования."
          color="cyan"
        />
      </div>

      {/* Section: "Каждая идея =" */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Каждая идея =
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="🔭"
            title="Недели работы аналитика"
            features={[
              'Горячие тренды и актуальность',
              'Анализ конкурентов и их слабых мест',
              'Боли клиентов и решения',
              'Знание социальных сетей и площадок',
              'Как стать лидером в нише',
            ]}
            color="blue"
          />

          <FeatureCard
            icon="💵"
            title="План запуска проекта"
            features={[
              'Как создать продукт (MVP)',
              'Какую поставить цену',
              'Как сделать воронку продаж',
              'Как получить первых клиентов',
              'Как развивать и масштабировать',
            ]}
            color="purple"
          />

          <FeatureCard
            icon="🔧"
            title="Техническая часть"
            features={[
              'AI-разработчики (промпты для кода)',
              'Готовые промпты для контента',
              'Шаблоны агентов (n8n, Make)',
              'Видео-инструкции по настройке',
              'Как решать ошибки и проблемы',
            ]}
            color="cyan"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30 rounded-2xl p-12 border border-[var(--border)]">
        <h2 className="text-3xl font-bold text-white mb-4">
          Готов начать?
        </h2>
        <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">
          Выбери идею из нашего каталога и получи полный набор инструментов для
          запуска прямо сейчас.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-[var(--accent-purple)] text-white font-semibold rounded-lg hover:bg-[var(--accent-purple)]/90 transition-colors"
        >
          Посмотреть все идеи
        </a>
      </div>
    </div>
  );
}
