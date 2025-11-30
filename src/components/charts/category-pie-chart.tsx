'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useStore } from '@/store';
import { CATEGORIES, CHART_COLORS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

// Category pie chart
export const CategoryPieChart: React.FC = () => {
  const monthlyStats = useStore((state) => state.monthlyStats);
  const profile = useStore((state) => state.profile);

  const data = React.useMemo(() => {
    if (!monthlyStats) return [];

    return CATEGORIES.filter((cat) => (monthlyStats.byCategory[cat.id] || 0) > 0)
      .map((cat, index) => ({
        name: cat.name,
        value: monthlyStats.byCategory[cat.id] || 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [monthlyStats]);

  const totalSpending = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-500">
        No spending data yet
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 min-h-[256px]">
      {/* Pie Chart */}
      <div className="w-full sm:flex-1 h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                const percentage = ((data.value / totalSpending) * 100).toFixed(1);
                return (
                  <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {data.name}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: data.color }}>
                      {formatCurrency(data.value, profile?.currency)} ({percentage}%)
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - horizontal scroll on mobile, vertical on desktop */}
      <div className="w-full sm:w-40 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
        <div className="flex sm:flex-col gap-3 sm:gap-2 min-w-max sm:min-w-0">
          {data.slice(0, 6).map((item) => {
            const percentage = ((item.value / totalSpending) * 100).toFixed(0);
            return (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  {item.name} <span className="text-neutral-400 dark:text-neutral-500">({percentage}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
