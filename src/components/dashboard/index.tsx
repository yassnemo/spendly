'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Plus,
  Wallet,
  PiggyBank,
  Receipt,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store';
import { Card, Badge, Progress, Button, Skeleton, EmptyState } from '@/components/ui';
import { CategoryIcon } from '@/components/category-icon';
import { cn, formatCurrency, getGreeting, formatDate, calculatePercentage } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { SpendingChart, CategoryPieChart } from '@/components/charts';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
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

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  color: 'primary' | 'success' | 'danger' | 'secondary' | 'accent';
}

const colorConfig = {
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

const StatsCard: React.FC<StatsCardProps> = ({
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

// Financial Health Score Component
const HealthScore: React.FC = () => {
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

// Recent Transactions Component
const RecentTransactions: React.FC = () => {
  const expenses = useStore((state) => state.expenses);
  const profile = useStore((state) => state.profile);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h3 className="font-semibold text-surface-900 dark:text-white text-sm sm:text-base">
            Recent Transactions
          </h3>
          <Link
            href="/expenses"
            className={cn(
              'text-xs sm:text-sm font-medium',
              'text-primary-600 dark:text-primary-400',
              'hover:text-primary-700 dark:hover:text-primary-300',
              'transition-colors duration-200'
            )}
          >
            View all
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-12 h-12" />}
            title="No transactions"
            description="Start tracking your expenses"
            action={
              <Button onClick={() => window.location.href = '/expenses'}>
                Add Expense
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  'flex items-center gap-3 p-3 -mx-3 rounded-xl',
                  'transition-colors duration-200',
                  'hover:bg-surface-50 dark:hover:bg-surface-800/50'
                )}
              >
                <CategoryIcon category={expense.category} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-900 dark:text-white truncate text-sm">
                    {expense.description}
                  </p>
                  <p className="text-xs text-surface-500">
                    {formatDate(expense.date, 'MMM d, h:mm a')}
                  </p>
                </div>
                <p className="font-semibold text-surface-900 dark:text-white text-sm">
                  -{formatCurrency(expense.amount, profile?.currency || 'USD')}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// Budget Overview Component
const BudgetOverview: React.FC = () => {
  const budgets = useStore((state) => state.budgets);
  const currentMonth = useStore((state) => state.currentMonth);
  const profile = useStore((state) => state.profile);

  const monthBudgets = budgets
    .filter((b) => b.month === currentMonth)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 4);

  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h3 className="font-semibold text-surface-900 dark:text-white text-sm sm:text-base">
            Budget Overview
          </h3>
          <Link
            href="/budget"
            className={cn(
              'text-xs sm:text-sm font-medium',
              'text-primary-600 dark:text-primary-400',
              'hover:text-primary-700 dark:hover:text-primary-300',
              'transition-colors duration-200'
            )}
          >
            Manage
          </Link>
        </div>

        {monthBudgets.length === 0 ? (
          <EmptyState
            icon={<Wallet className="w-12 h-12" />}
            title="No budgets set"
            description="Create budgets to track spending"
            action={
              <Button onClick={() => window.location.href = '/budget'}>
                Set Up Budget
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {monthBudgets.map((budget, index) => {
              const category = CATEGORIES.find((c) => c.id === budget.category);
              const percentage = calculatePercentage(budget.spent, budget.limit);
              const isOverBudget = budget.spent > budget.limit;

              return (
                <motion.div 
                  key={budget.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={budget.category} size="sm" />
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                        {category?.name}
                      </span>
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      isOverBudget ? 'text-danger-500' : 'text-surface-500'
                    )}>
                      {formatCurrency(budget.spent, profile?.currency)} / {formatCurrency(budget.limit, profile?.currency)}
                    </span>
                  </div>
                  <Progress 
                    value={budget.spent} 
                    max={budget.limit} 
                    size="sm"
                    color={isOverBudget ? 'danger' : percentage > 80 ? 'warning' : 'primary'}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// Main Dashboard Component
export const Dashboard: React.FC = () => {
  const profile = useStore((state) => state.profile);
  const monthlyStats = useStore((state) => state.monthlyStats);
  const isLoading = useStore((state) => state.isLoading);
  const refreshInsights = useStore((state) => state.refreshInsights);

  React.useEffect(() => {
    refreshInsights();
  }, [refreshInsights]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const currency = profile?.currency || 'USD';
  const savingsPercent = monthlyStats?.totalIncome 
    ? Math.round(((monthlyStats.savings || 0) / monthlyStats.totalIncome) * 100)
    : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-24 sm:pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white">
          {getGreeting()}, {profile?.name || 'there'}
        </h1>
        <p className="mt-1 text-sm sm:text-base text-surface-500">
          Your financial overview for this month
        </p>
      </motion.div>

      {/* Stats Cards - 2x2 grid on mobile for better visibility */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="Income"
          value={formatCurrency(monthlyStats?.totalIncome || 0, currency)}
          icon={TrendingUp}
          color="success"
        />
        <StatsCard
          title="Expenses"
          value={formatCurrency(monthlyStats?.totalExpenses || 0, currency)}
          icon={Receipt}
          color="danger"
        />
        <StatsCard
          title="Savings"
          value={formatCurrency(Math.abs(monthlyStats?.savings || 0), currency)}
          change={savingsPercent > 0 ? savingsPercent : undefined}
          trend={(monthlyStats?.savings || 0) >= 0 ? 'up' : 'down'}
          icon={PiggyBank}
          color="primary"
        />
        <StatsCard
          title="Budget Used"
          value={`${calculatePercentage(
            monthlyStats?.totalExpenses || 0,
            monthlyStats?.totalIncome || 1
          )}%`}
          icon={Target}
          color="secondary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4 sm:mb-6 text-sm sm:text-base">
              Spending Trend
            </h3>
            <SpendingChart />
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4 sm:mb-6 text-sm sm:text-base">
              Spending by Category
            </h3>
            <CategoryPieChart />
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row - Stack on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <HealthScore />
        <BudgetOverview />
        <RecentTransactions />
      </div>
    </motion.div>
  );
};
