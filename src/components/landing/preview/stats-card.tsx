'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: 'green' | 'red' | 'primary' | 'indigo';
  delay: number;
  badge?: string;
}

export function StatsCard({ title, value, icon: Icon, color, delay, badge }: StatsCardProps) {
  const colorClasses = {
    green: 'bg-green-500 shadow-green-500/25',
    red: 'bg-red-500 shadow-red-500/25',
    primary: 'bg-primary-500 shadow-primary-500/25',
    indigo: 'bg-indigo-500 shadow-indigo-500/25',
  };

  const glowClasses = {
    green: 'bg-green-500/10',
    red: 'bg-red-500/10',
    primary: 'bg-primary-500/10',
    indigo: 'bg-indigo-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group p-4 lg:p-5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-medium text-surface-500 dark:text-surface-400">
            {title}
          </p>
          <p className="text-xl lg:text-2xl font-bold text-surface-900 dark:text-white mt-1 lg:mt-2 tracking-tight">
            {value}
          </p>
          {badge && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {badge}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform',
            colorClasses[color]
          )}
        >
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
      </div>
      <div className={cn('absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl', glowClasses[color])} />
    </motion.div>
  );
}
