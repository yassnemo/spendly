'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { AIInsight } from '@/types';

// Animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Insight Card Component
interface InsightCardProps {
  insight: AIInsight;
  onDismiss: () => void;
  index: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onDismiss, index }) => {
  const typeConfig = {
    tip: {
      icon: Lightbulb,
      color: 'text-accent-500',
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      border: 'border-accent-200 dark:border-accent-800/50',
      iconBg: 'bg-accent-100 dark:bg-accent-900/40',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-warning-500',
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800/50',
      iconBg: 'bg-warning-100 dark:bg-warning-900/40',
    },
    achievement: {
      icon: CheckCircle,
      color: 'text-success-500',
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800/50',
      iconBg: 'bg-success-100 dark:bg-success-900/40',
    },
    pattern: {
      icon: TrendingUp,
      color: 'text-secondary-500',
      bg: 'bg-secondary-50 dark:bg-secondary-900/20',
      border: 'border-secondary-200 dark:border-secondary-800/50',
      iconBg: 'bg-secondary-100 dark:bg-secondary-900/40',
    },
  };

  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay: index * 0.05 }}
      className={cn(
        'group p-5 rounded-2xl border transition-all duration-300',
        config.bg,
        config.border,
        insight.isRead ? 'opacity-60' : 'hover:shadow-soft-md',
        'hover:scale-[1.01]'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
            'transition-transform duration-300 group-hover:scale-110',
            config.iconBg
          )}
        >
          <Icon className={cn('w-5 h-5', config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-surface-900 dark:text-white leading-relaxed">
            {insight.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Badge
              size="sm"
              variant={
                insight.priority === 'high'
                  ? 'danger'
                  : insight.priority === 'medium'
                  ? 'warning'
                  : 'default'
              }
            >
              {insight.priority} priority
            </Badge>
            {insight.category && (
              <Badge size="sm" variant="secondary">
                {insight.category}
              </Badge>
            )}
          </div>
        </div>

        {!insight.isRead && (
          <button
            onClick={onDismiss}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300',
              'hover:bg-surface-100 dark:hover:bg-surface-800',
              'opacity-0 group-hover:opacity-100'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
