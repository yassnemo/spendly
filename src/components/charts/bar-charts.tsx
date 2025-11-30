'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { CustomTooltip } from './custom-tooltip';

// Monthly comparison bar chart
export const MonthlyComparisonChart: React.FC = () => {
  const expenses = useStore((state) => state.expenses);
  const profile = useStore((state) => state.profile);
  const { resolvedTheme } = useTheme();

  const data = React.useMemo(() => {
    const monthlyTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      const month = format(parseISO(expense.date), 'MMM yyyy');
      monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
    });

    // Get last 6 months
    const sortedMonths = Object.entries(monthlyTotals)
      .sort((a, b) => {
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 6)
      .reverse();

    return sortedMonths.map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [expenses]);

  const gridColor = resolvedTheme === 'dark' ? '#404040' : '#e5e5e5';
  const textColor = resolvedTheme === 'dark' ? '#a3a3a3' : '#737373';

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: textColor }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: textColor }}
            tickFormatter={(value) => formatCurrency(value, profile?.currency, true)}
            width={60}
          />
          <Tooltip content={<CustomTooltip currency={profile?.currency} />} />
          <Bar dataKey="amount" fill="url(#barGradient)" radius={[8, 8, 0, 0]}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Budget progress chart
interface BudgetProgressChartProps {
  data: Array<{
    category: string;
    spent: number;
    limit: number;
    color: string;
  }>;
}

export const BudgetProgressChart: React.FC<BudgetProgressChartProps> = ({ data }) => {
  const profile = useStore((state) => state.profile);
  const { resolvedTheme } = useTheme();

  const gridColor = resolvedTheme === 'dark' ? '#404040' : '#e5e5e5';
  const textColor = resolvedTheme === 'dark' ? '#a3a3a3' : '#737373';

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: 80, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: textColor }}
            tickFormatter={(value) => formatCurrency(value, profile?.currency, true)}
          />
          <YAxis
            type="category"
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: textColor }}
            width={75}
          />
          <Tooltip content={<CustomTooltip currency={profile?.currency} />} />
          <Bar dataKey="spent" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Spent" />
          <Bar dataKey="limit" fill="#e5e5e5" radius={[0, 4, 4, 0]} name="Budget" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Savings goal progress chart
interface GoalProgressChartProps {
  current: number;
  target: number;
  color: string;
}

export const GoalProgressChart: React.FC<GoalProgressChartProps> = ({
  current,
  target,
  color,
}) => {
  const percentage = Math.min(100, (current / target) * 100);

  return (
    <div className="relative w-full h-4 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};
