'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, X, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/store';
import { Card, Button, Input, Progress, Badge } from '@/components/ui';
import { Modal } from '@/components/ui/modal';
import { CategoryIcon } from '@/components/category-icon';
import { MonthlyComparisonChart } from '@/components/charts';
import { cn, formatCurrency, calculatePercentage, getMonthName } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { CategoryType } from '@/types';
import { format, addMonths, subMonths } from 'date-fns';

// Budget Item Component
interface BudgetItemProps {
  category: CategoryType;
  limit: number;
  spent: number;
  onEdit: (limit: number) => void;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ category, limit, spent, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(limit.toString());
  const profile = useStore((state) => state.profile);

  const categoryInfo = CATEGORIES.find((c) => c.id === category);
  const percentage = calculatePercentage(spent, limit);
  const remaining = limit - spent;
  const isOverBudget = spent > limit;

  const handleSave = () => {
    onEdit(parseFloat(newLimit) || 0);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-5 rounded-2xl border transition-all',
        isOverBudget
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <CategoryIcon category={category} size="md" />
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-white">
              {categoryInfo?.name}
            </h3>
            {isOverBudget && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-0.5">
                <AlertTriangle className="w-3 h-3" />
                <span>Over budget!</span>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={handleSave}
              className="p-2 rounded-xl bg-primary-500 hover:bg-primary-600"
            >
              <Check className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Edit2 className="w-4 h-4 text-neutral-400" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <Progress
        value={spent}
        max={limit}
        size="md"
        color={isOverBudget ? 'danger' : 'auto'}
      />

      {/* Stats */}
      <div className="flex items-center justify-between mt-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">Budget:</span>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm font-medium"
              autoFocus
            />
          </div>
        ) : (
          <div className="text-sm">
            <span className="font-semibold text-neutral-900 dark:text-white">
              {formatCurrency(spent, profile?.currency)}
            </span>
            <span className="text-neutral-500"> / {formatCurrency(limit, profile?.currency)}</span>
          </div>
        )}

        <div className="text-right">
          <span className="text-sm font-medium text-neutral-500">{percentage}%</span>
          <p
            className={cn(
              'text-xs',
              isOverBudget ? 'text-red-500' : 'text-green-500'
            )}
          >
            {isOverBudget
              ? `${formatCurrency(Math.abs(remaining), profile?.currency)} over`
              : `${formatCurrency(remaining, profile?.currency)} left`}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Budget Setup Modal
interface BudgetSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BudgetSetupModal: React.FC<BudgetSetupProps> = ({ isOpen, onClose }) => {
  const profile = useStore((state) => state.profile);
  const initializeDefaultBudgets = useStore((state) => state.initializeDefaultBudgets);
  const [income, setIncome] = useState(profile?.monthlyIncome?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetup = async () => {
    if (!income) return;
    setIsSubmitting(true);
    try {
      await initializeDefaultBudgets(parseFloat(income));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Up Your Budget" size="md">
      <div className="space-y-6">
        <p className="text-neutral-500">
          We'll create a smart budget based on your monthly income using the 50/30/20 rule.
        </p>

        <Input
          type="number"
          label="Monthly Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="Enter your monthly income"
          leftElement={<span className="text-lg">$</span>}
        />

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4">
          <h4 className="font-medium text-neutral-900 dark:text-white mb-3">
            Budget Breakdown
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Needs (50%)</span>
              <span className="font-medium">
                {formatCurrency(parseFloat(income || '0') * 0.5)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Wants (30%)</span>
              <span className="font-medium">
                {formatCurrency(parseFloat(income || '0') * 0.3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Savings (20%)</span>
              <span className="font-medium">
                {formatCurrency(parseFloat(income || '0') * 0.2)}
              </span>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSetup}
          isLoading={isSubmitting}
          disabled={!income}
        >
          Create Budget
        </Button>
      </div>
    </Modal>
  );
};

// Main Budget Page
export const BudgetPage: React.FC = () => {
  const budgets = useStore((state) => state.budgets);
  const currentMonth = useStore((state) => state.currentMonth);
  const setCurrentMonth = useStore((state) => state.setCurrentMonth);
  const setBudget = useStore((state) => state.setBudget);
  const profile = useStore((state) => state.profile);
  const monthlyStats = useStore((state) => state.monthlyStats);

  const [showSetup, setShowSetup] = useState(false);

  const monthBudgets = budgets.filter((b) => b.month === currentMonth);
  const hasNoBudgets = monthBudgets.length === 0;

  const totalBudget = monthBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = monthBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = calculatePercentage(totalSpent, totalBudget);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-').map(Number);
    const currentDate = new Date(year, month - 1);
    const newDate = direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    setCurrentMonth(format(newDate, 'yyyy-MM'));
  };

  const handleBudgetEdit = async (category: CategoryType, limit: number) => {
    await setBudget(category, limit);
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Budget</h1>
          <p className="text-neutral-500">Manage your monthly spending limits</p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMonthChange('prev')}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="min-w-[140px] text-center font-medium">
            {getMonthName(currentMonth)}
          </span>
          <button
            onClick={() => handleMonthChange('next')}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {hasNoBudgets ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            No Budget Set
          </h2>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Set up your monthly budget to start tracking your spending and reach your financial goals.
          </p>
          <Button onClick={() => setShowSetup(true)}>Set Up Budget</Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overview Card */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Monthly Overview
                </h3>
                <p className="text-neutral-500">
                  You've spent {formatCurrency(totalSpent, profile?.currency)} of{' '}
                  {formatCurrency(totalBudget, profile?.currency)}
                </p>
              </div>
              <Badge
                variant={
                  totalPercentage >= 100
                    ? 'danger'
                    : totalPercentage >= 80
                    ? 'warning'
                    : 'success'
                }
              >
                {totalPercentage}% used
              </Badge>
            </div>
            <Progress value={totalSpent} max={totalBudget} size="lg" />
          </Card>

          {/* Budget Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map((category) => {
              const budget = monthBudgets.find((b) => b.category === category.id);
              return (
                <BudgetItem
                  key={category.id}
                  category={category.id}
                  limit={budget?.limit || 0}
                  spent={budget?.spent || 0}
                  onEdit={(limit) => handleBudgetEdit(category.id, limit)}
                />
              );
            })}
          </div>

          {/* Monthly Comparison Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
              Spending History
            </h3>
            <MonthlyComparisonChart />
          </Card>
        </div>
      )}

      <BudgetSetupModal isOpen={showSetup} onClose={() => setShowSetup(false)} />
    </div>
  );
};
