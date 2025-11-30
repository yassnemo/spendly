'use client';

import React, { useState } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/store';
import { Card, Button, Progress, Badge } from '@/components/ui';
import { MonthlyComparisonChart } from '@/components/charts';
import { formatCurrency, calculatePercentage, getMonthName } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { CategoryType } from '@/types';
import { format, addMonths, subMonths } from 'date-fns';
import { BudgetItem } from './budget-item';
import { BudgetSetupModal } from './budget-setup-modal';

// Main Budget Page
export const BudgetPage: React.FC = () => {
  const budgets = useStore((state) => state.budgets);
  const currentMonth = useStore((state) => state.currentMonth);
  const setCurrentMonth = useStore((state) => state.setCurrentMonth);
  const setBudget = useStore((state) => state.setBudget);
  const profile = useStore((state) => state.profile);

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
