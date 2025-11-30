'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Color configuration
export const colorConfig = {
  primary: {
    bg: 'bg-primary-500',
    light: 'bg-primary-50 dark:bg-primary-900/20',
    text: 'text-primary-600 dark:text-primary-400',
  },
  success: {
    bg: 'bg-success-500',
    light: 'bg-success-50 dark:bg-success-900/20',
    text: 'text-success-600 dark:text-success-400',
  },
  danger: {
    bg: 'bg-danger-500',
    light: 'bg-danger-50 dark:bg-danger-900/20',
    text: 'text-danger-600 dark:text-danger-400',
  },
  secondary: {
    bg: 'bg-secondary-500',
    light: 'bg-secondary-50 dark:bg-secondary-900/20',
    text: 'text-secondary-600 dark:text-secondary-400',
  },
  accent: {
    bg: 'bg-accent-500',
    light: 'bg-accent-50 dark:bg-accent-900/20',
    text: 'text-accent-600 dark:text-accent-400',
  },
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  color: 'primary' | 'success' | 'danger' | 'secondary' | 'accent';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}) => {
  const colors = colorConfig[color];
  
  return (
    <motion.div variants={itemVariants} className="group">
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-soft-lg !p-3 sm:!p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-surface-500 dark:text-surface-400">
              {title}
            </p>
            <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-surface-900 dark:text-white tracking-tight truncate">
              {value}
            </p>
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className={cn(
                  'flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-medium',
                  trend === 'up' 
                    ? 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400' 
                    : 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'
                )}>
                  {trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(change)}%
                </div>
                <span className="text-xs text-surface-400">vs last month</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-soft-sm',
              'transition-transform duration-300 group-hover:scale-110',
              colors.bg
            )}
          >
            <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
        
        {/* Decorative element */}
        <div
          className={cn(
            'absolute -right-6 -bottom-6 w-20 h-20 rounded-full opacity-10 blur-xl',
            colors.bg
          )}
        />
      </Card>
    </motion.div>
  );
};
