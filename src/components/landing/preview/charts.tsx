'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Spending Chart Component
interface SpendingChartProps {
  data: { day: string; amount: number }[];
  maxSpend: number;
}

export function SpendingChart({ data, maxSpend }: SpendingChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="p-5 lg:p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 shadow-sm"
    >
      <h3 className="text-sm lg:text-base font-semibold text-surface-900 dark:text-white mb-5">
        Spending Trend
      </h3>
      <div className="h-40 flex items-end gap-3">
        {data.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(day.amount / maxSpend) * 100}%` }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.08 }}
              className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md min-h-[8px]"
            />
            <span className="text-xs text-surface-500 font-medium">{day.day}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Category Chart Component
export function CategoryChart() {
  const categories = [
    { name: 'Food & Dining', percent: 45, color: 'bg-blue-500' },
    { name: 'Shopping', percent: 30, color: 'bg-blue-400' },
    { name: 'Transport', percent: 15, color: 'bg-blue-300' },
    { name: 'Other', percent: 10, color: 'bg-surface-300 dark:bg-surface-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="p-5 lg:p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 shadow-sm"
    >
      <h3 className="text-sm lg:text-base font-semibold text-surface-900 dark:text-white mb-5">
        Spending by Category
      </h3>
      <div className="flex items-center gap-6">
        <DonutChart />
        <div className="flex-1 space-y-3">
          {categories.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className={cn('w-3 h-3 rounded-full', item.color)} />
              <span className="text-xs lg:text-sm text-surface-700 dark:text-surface-300 flex-1">
                {item.name}
              </span>
              <span className="text-xs text-surface-400 font-medium">{item.percent}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DonutChart() {
  return (
    <div className="relative w-28 h-28 lg:w-32 lg:h-32 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="12" className="text-surface-100 dark:text-surface-700" />
        <motion.circle cx="50" cy="50" r="35" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="220" initial={{ strokeDashoffset: 220 }} animate={{ strokeDashoffset: 110 }} transition={{ duration: 1.2, delay: 0.6 }} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-lg lg:text-xl font-bold text-surface-900 dark:text-white">$2.2k</span>
          <span className="block text-[10px] text-surface-400">Total</span>
        </div>
      </div>
    </div>
  );
}
