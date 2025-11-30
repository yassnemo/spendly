'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Calendar,
} from 'lucide-react';
import { useStore } from '@/store';
import { Button, Progress, Badge } from '@/components/ui';
import { DynamicIcon } from '@/components/category-icon';
import { cn, formatCurrency, formatDate, calculatePercentage } from '@/lib/utils';
import { SavingsGoal } from '@/types';

// Goal Card Component
interface GoalCardProps {
  goal: SavingsGoal;
  onEdit: () => void;
  onDelete: () => void;
  onAddFunds: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onAddFunds }) => {
  const profile = useStore((state) => state.profile);
  const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'p-6 rounded-3xl border transition-all',
        isCompleted
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
          : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            <DynamicIcon name={goal.icon} size={24} className="text-neutral-700 dark:text-neutral-300" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">{goal.name}</h3>
            {goal.deadline && (
              <p className="text-sm text-neutral-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(goal.deadline, 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>

        {isCompleted ? (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            Completed!
          </Badge>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Edit2 className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatCurrency(goal.currentAmount, profile?.currency)}
          </span>
          <span className="text-neutral-500">
            {formatCurrency(goal.targetAmount, profile?.currency)}
          </span>
        </div>
        <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: goal.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, percentage)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-sm text-neutral-500 mt-2">{percentage}% complete</p>
      </div>

      {!isCompleted && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={onAddFunds}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Funds
        </Button>
      )}
    </motion.div>
  );
};
