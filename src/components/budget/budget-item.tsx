'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store';
import { Progress } from '@/components/ui';
import { CategoryIcon } from '@/components/category-icon';
import { cn, formatCurrency, calculatePercentage } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { CategoryType } from '@/types';

// Budget Item Component
interface BudgetItemProps {
  category: CategoryType;
  limit: number;
  spent: number;
  onEdit: (limit: number) => void;
}

export const BudgetItem: React.FC<BudgetItemProps> = ({ category, limit, spent, onEdit }) => {
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
