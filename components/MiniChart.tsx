'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { SparklineData } from '@/types';

interface MiniChartProps {
  data: SparklineData[];
}

export function MiniChart({ data }: MiniChartProps) {
  if (!data || data.length === 0) {
    // Генерируем случайные данные для демонстрации
    data = Array.from({ length: 6 }, (_, i) => ({
      x: i,
      y: Math.floor(Math.random() * 50) + 10 + i * 10,
    }));
  }

  return (
    <div className="w-full h-20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="y"
            stroke="url(#lineGradient)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
