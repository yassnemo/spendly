'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { itemVariants } from './stats-card';

// Financial Health Score Component
export const HealthScore: React.FC = () => {
  const financialHealth = useStore((state) => state.financialHealth);

  if (!financialHealth) return null;

  const { score, status } = financialHealth;

  const statusConfig = {
    excellent: {
      label: 'Excellent',
      color: 'text-success-600 dark:text-success-400',
      bg: 'bg-success-50 dark:bg-success-900/20',
    },
    good: {
      label: 'Good',
      color: 'text-secondary-600 dark:text-secondary-400',
      bg: 'bg-secondary-50 dark:bg-secondary-900/20',
    },
    fair: {
      label: 'Fair',
      color: 'text-accent-600 dark:text-accent-400',
      bg: 'bg-accent-50 dark:bg-accent-900/20',
    },
    poor: {
      label: 'Needs Work',
      color: 'text-danger-600 dark:text-danger-400',
      bg: 'bg-danger-50 dark:bg-danger-900/20',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h3 className="font-semibold text-surface-900 dark:text-white text-sm sm:text-base">
            Financial Health
          </h3>
          <Badge className={cn(config.color, config.bg, 'text-xs')}>
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Circular progress */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-surface-100 dark:text-surface-800"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#healthGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-primary-500)" />
                  <stop offset="100%" stopColor="var(--color-secondary-500)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">{score}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-surface-500 mb-3 sm:mb-4 leading-relaxed">
              Based on your savings rate, budget adherence, and goal progress.
            </p>
            <Link
              href="/insights"
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium',
                'text-primary-600 dark:text-primary-400',
                'hover:text-primary-700 dark:hover:text-primary-300',
                'transition-colors duration-200'
              )}
            >
              <Sparkles className="w-4 h-4" />
              Get AI Insights
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
