'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Health Score Component
export function HealthScore() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="p-5 lg:p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm lg:text-base font-semibold text-surface-900 dark:text-white">Financial Health</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium">Good</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-100 dark:text-surface-700" />
            <motion.circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeDasharray="251.2" initial={{ strokeDashoffset: 251.2 }} animate={{ strokeDashoffset: 70.34 }} transition={{ duration: 1.5, delay: 0.7 }} stroke="url(#healthGradientPreview)" strokeLinecap="round" />
            <defs>
              <linearGradient id="healthGradientPreview" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl lg:text-2xl font-bold text-surface-900 dark:text-white">72</span>
          </div>
        </div>
        <p className="text-xs lg:text-sm text-surface-500 leading-relaxed">Based on savings rate and budget adherence</p>
      </div>
    </motion.div>
  );
}

// Budget Overview Component
interface BudgetOverviewProps {
  budgets: { category: string; spent: number; limit: number; color: string }[];
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.65 }}
      className="p-5 lg:p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm lg:text-base font-semibold text-surface-900 dark:text-white">Budget Overview</span>
        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium cursor-pointer hover:underline">Manage</span>
      </div>
      <div className="space-y-3">
        {budgets.map((budget, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs lg:text-sm font-medium text-surface-700 dark:text-surface-300">{budget.category}</span>
              <span className="text-[10px] lg:text-xs text-surface-400">${budget.spent}/${budget.limit}</span>
            </div>
            <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(budget.spent / budget.limit) * 100}%` }} transition={{ duration: 1, delay: 0.9 + i * 0.1 }} className={cn('h-full rounded-full bg-gradient-to-r', budget.color)} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Recent Transactions Component
interface RecentTransactionsProps {
  transactions: { name: string; amount: number; icon: React.ElementType; time: string }[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="p-5 lg:p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm lg:text-base font-semibold text-surface-900 dark:text-white">Recent Transactions</span>
        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium cursor-pointer hover:underline">View all</span>
      </div>
      <div className="space-y-3">
        {transactions.slice(0, 3).map((tx, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.1 }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer">
            <div className={cn('w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center', tx.amount > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400')}>
              <tx.icon className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs lg:text-sm font-medium text-surface-900 dark:text-white truncate">{tx.name}</div>
              <div className="text-[10px] lg:text-xs text-surface-400">{tx.time}</div>
            </div>
            <div className={cn('text-xs lg:text-sm font-semibold', tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-surface-900 dark:text-white')}>
              {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
