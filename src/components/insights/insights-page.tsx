'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '@/store';
import { Card, Button, Badge, EmptyState } from '@/components/ui';
import { cn } from '@/lib/utils';
import { detectAnomalies } from '@/lib/ai';
import { InsightCard, staggerContainer } from './insight-card';
import { WeeklyTips } from './weekly-tips';
import { SpendingAnalysis } from './spending-analysis';

// Main Insights Page
export const InsightsPage: React.FC = () => {
  const insights = useStore((state) => state.insights);
  const refreshInsights = useStore((state) => state.refreshInsights);
  const dismissInsight = useStore((state) => state.dismissInsight);
  const expenses = useStore((state) => state.expenses);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [anomalies, setAnomalies] = useState<string[]>([]);

  useEffect(() => {
    refreshInsights();
    setAnomalies(detectAnomalies(expenses));
  }, [refreshInsights, expenses]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshInsights();
    setAnomalies(detectAnomalies(expenses));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const unreadInsights = insights.filter((i) => !i.isRead);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            AI Insights
          </h1>
          <p className="text-surface-500 mt-1">
            Smart recommendations powered by AI
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleRefresh}
          leftIcon={
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          }
        >
          Refresh
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Insights Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Insights List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                Your Insights
              </h2>
              {unreadInsights.length > 0 && (
                <Badge variant="primary">{unreadInsights.length} new</Badge>
              )}
            </div>

            {insights.length === 0 ? (
              <Card className="py-12">
                <EmptyState
                  icon={<Sparkles className="w-12 h-12" />}
                  title="No insights yet"
                  description="Add some expenses to get personalized AI-powered insights about your spending habits."
                  action={
                    <Button onClick={() => window.location.href = '/expenses'}>
                      Add Expense
                    </Button>
                  }
                />
              </Card>
            ) : (
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence mode="popLayout">
                  {insights.map((insight, index) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onDismiss={() => dismissInsight(insight.id)}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Anomalies */}
          <AnimatePresence>
            {anomalies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-danger-200 dark:border-danger-800/50 bg-danger-50/50 dark:bg-danger-900/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-danger-100 dark:bg-danger-900/40 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-danger-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">
                        Spending Alerts
                      </h3>
                      <p className="text-xs text-surface-500">Unusual patterns detected</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {anomalies.map((anomaly, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          'p-4 rounded-xl text-sm',
                          'bg-white dark:bg-surface-800/50',
                          'border border-danger-200 dark:border-danger-800/50',
                          'text-danger-700 dark:text-danger-300'
                        )}
                      >
                        {anomaly}
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spending Analysis */}
          <SpendingAnalysis />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WeeklyTips />
        </div>
      </div>
    </div>
  );
};
