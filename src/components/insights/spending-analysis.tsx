'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useStore } from '@/store';
import { Card, Badge } from '@/components/ui';
import { cn, formatCurrency, calculateSavingsRate } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

// Spending Analysis Section
export const SpendingAnalysis: React.FC = () => {
  const monthlyStats = useStore((state) => state.monthlyStats);
  const profile = useStore((state) => state.profile);

  if (!monthlyStats) return null;

  const savingsRate = calculateSavingsRate(monthlyStats.totalIncome, monthlyStats.totalExpenses);

  const topCategories = Object.entries(monthlyStats.byCategory)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const maxAmount = topCategories.length > 0 ? topCategories[0][1] : 1;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft-sm">
          <PieChart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white">
            Spending Analysis
          </h3>
          <p className="text-xs text-surface-500">This month overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          className={cn(
            'p-4 rounded-xl transition-all duration-300',
            'bg-surface-50 dark:bg-surface-800/50',
            'border border-surface-100 dark:border-surface-700/50'
          )}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-xs font-medium text-surface-500 mb-2">Savings Rate</p>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-2xl font-bold tracking-tight',
                savingsRate >= 20 ? 'text-success-500' : 
                savingsRate >= 10 ? 'text-accent-500' : 'text-danger-500'
              )}
            >
              {savingsRate}%
            </span>
            <div className={cn(
              'p-1.5 rounded-lg',
              savingsRate >= 20 ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'
            )}>
              {savingsRate >= 20 ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger-500" />
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={cn(
            'p-4 rounded-xl transition-all duration-300',
            'bg-surface-50 dark:bg-surface-800/50',
            'border border-surface-100 dark:border-surface-700/50'
          )}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-xs font-medium text-surface-500 mb-2">Monthly Savings</p>
          <span
            className={cn(
              'text-2xl font-bold tracking-tight',
              monthlyStats.savings >= 0 ? 'text-success-500' : 'text-danger-500'
            )}
          >
            {formatCurrency(Math.abs(monthlyStats.savings), profile?.currency)}
          </span>
        </motion.div>
      </div>

      {topCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-4">
            Top Categories
          </h4>
          <div className="space-y-3">
            {topCategories.map(([categoryId, amount], index) => {
              const category = CATEGORIES.find((c) => c.id === categoryId);
              const percentage = Math.round((amount / monthlyStats.totalExpenses) * 100);
              const barWidth = (amount / maxAmount) * 100;

              return (
                <motion.div
                  key={categoryId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-surface-400 w-4">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-surface-900 dark:text-white">
                        {category?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">
                        {formatCurrency(amount, profile?.currency)}
                      </span>
                      <Badge size="sm" variant="secondary">
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
