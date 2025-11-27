'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { format, subDays, parseISO, startOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { useStore } from '@/store';
import { CATEGORIES, CHART_COLORS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

// Custom tooltip component
const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  currency?: string;
}> = ({ active, payload, label, currency = 'USD' }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700">
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
        {label}
      </p>
      {payload.map((item, index) => (
        <p key={index} className="text-sm font-semibold" style={{ color: item.color }}>
          {formatCurrency(item.value, currency)}
        </p>
      ))}
    </div>
  );
};

// Spending trend chart (Area chart)
export const SpendingChart: React.FC = () => {
  const expenses = useStore((state) => state.expenses);
  const profile = useStore((state) => state.profile);
  const { resolvedTheme } = useTheme();

  // Get last 30 days of data
  const last30Days = React.useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dayExpenses = expenses.filter((e) => {
        const expenseDate = parseISO(e.date);
        return isSameDay(expenseDate, date);
      });
      const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      days.push({
        date: format(date, 'MMM d'),
        amount: total,
      });
    }
    
    return days;
  }, [expenses]);

  const gridColor = resolvedTheme === 'dark' ? '#404040' : '#e5e5e5';
  const textColor = resolvedTheme === 'dark' ? '#a3a3a3' : '#737373';

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={last30Days} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e86f5c" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#e86f5c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: textColor }}
            tickMargin={10}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: textColor }}
            tickFormatter={(value) => formatCurrency(value, profile?.currency, true)}
            width={60}
          />
          <Tooltip content={<CustomTooltip currency={profile?.currency} />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#e86f5c"
            strokeWidth={2}
            fill="url(#spendingGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

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

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-500">
        No spending data yet
      </div>
    );
  }

  return (
    <div className="h-64 flex items-center gap-4">
      <div className="flex-1 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
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
                return (
                  <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {data.name}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: data.color }}>
                      {formatCurrency(data.value, profile?.currency)}
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="w-36 space-y-2">
        {data.slice(0, 5).map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#e86f5c" />
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
          <Bar dataKey="spent" fill="#e86f5c" radius={[0, 4, 4, 0]} name="Spent" />
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
