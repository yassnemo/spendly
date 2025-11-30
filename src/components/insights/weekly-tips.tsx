'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Zap } from 'lucide-react';
import { Card, Button, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';
import { generateWeeklyTips } from '@/lib/ai';
import { fadeInUp, staggerContainer } from './insight-card';

// Weekly Tips Section
export const WeeklyTips: React.FC = () => {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTips = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTips(generateWeeklyTips());
      setIsLoading(false);
      setIsRefreshing(false);
    }, 400);
  }, []);

  useEffect(() => {
    loadTips();
  }, [loadTips]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 mb-5">
          <Skeleton className="w-11 h-11 rounded-xl" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-secondary-500 flex items-center justify-center shadow-soft-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-white">
              Weekly Tips
            </h3>
            <p className="text-xs text-surface-500">Personalized advice</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={loadTips}
          className="!p-2"
        >
          <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
        </Button>
      </div>

      <motion.div 
        className="space-y-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {tips.map((tip, index) => (
          <motion.div
            key={`${tip}-${index}`}
            variants={fadeInUp}
            className={cn(
              'p-4 rounded-xl transition-all duration-300',
              'bg-surface-50 dark:bg-surface-800/50',
              'border border-surface-100 dark:border-surface-700/50',
              'hover:border-secondary-200 dark:hover:border-secondary-800/50',
              'hover:bg-secondary-50/50 dark:hover:bg-secondary-900/20'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                {tip}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};
