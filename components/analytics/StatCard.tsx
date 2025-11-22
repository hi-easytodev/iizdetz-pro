import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
  color?: 'purple' | 'pink' | 'blue' | 'green' | 'orange';
}

export function StatCard({ title, value, change, icon: Icon, color = 'purple' }: StatCardProps) {
  const colorClasses = {
    purple: 'from-purple-600 to-purple-700',
    pink: 'from-pink-600 to-pink-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-600 to-orange-700',
  };

  const iconBgClasses = {
    purple: 'bg-purple-500/20',
    pink: 'bg-pink-500/20',
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    orange: 'bg-orange-500/20',
  };

  return (
    <div className="bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-xl p-6 hover:border-purple-500 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[var(--text-primary)] mb-2">{value}</p>

          {change && (
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  change.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {change.trend === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-[var(--text-secondary)]">vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
          <Icon className={`w-6 h-6 bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`} />
        </div>
      </div>
    </div>
  );
}
