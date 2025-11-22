'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DistributionChartProps {
  data: Array<{
    name: string;
    count: number;
  }>;
  title: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function DistributionChart({ data, title, colors = DEFAULT_COLORS }: DistributionChartProps) {
  // Format data for chart
  const chartData = data.map((item) => ({
    name: item.name || 'Unknown',
    count: Number(item.count),
  }));

  return (
    <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="name"
            stroke="var(--text-secondary)"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="var(--text-secondary)" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
