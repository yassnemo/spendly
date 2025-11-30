'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { format, subDays, parseISO, isSameDay } from 'date-fns';
import { useStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { CustomTooltip } from './custom-tooltip';

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
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
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
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#spendingGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
