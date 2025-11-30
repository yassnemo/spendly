'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { useStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { CategoryIcon } from '@/components/category-icon';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORIES, QUICK_AMOUNTS } from '@/lib/constants';
import { categorizeExpenseLocal } from '@/lib/ai';
import { CategoryType, Expense } from '@/types';

// Add/Edit Expense Form
interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onClose }) => {
  const addExpense = useStore((state) => state.addExpense);
  const updateExpense = useStore((state) => state.updateExpense);
  const profile = useStore((state) => state.profile);

  const [amount, setAmount] = useState(expense?.amount.toString() || '');
  const [description, setDescription] = useState(expense?.description || '');
  const [category, setCategory] = useState<CategoryType>(expense?.category || 'other');
  const [date, setDate] = useState(expense?.date?.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSelectedCategory, setUserSelectedCategory] = useState(!!expense);

  // Auto-categorize on description change
  React.useEffect(() => {
    if (description && !expense && !userSelectedCategory) {
      const suggestedCategory = categorizeExpenseLocal(description);
      setCategory(suggestedCategory);
    }
  }, [description, expense, userSelectedCategory]);

  const handleCategorySelect = (cat: CategoryType) => {
    setCategory(cat);
    setUserSelectedCategory(true);
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    setIsSubmitting(true);
    try {
      if (expense) {
        await updateExpense(expense.id, {
          amount: parseFloat(amount),
          description,
          category,
          date: new Date(date).toISOString(),
        });
      } else {
        await addExpense({
          amount: parseFloat(amount),
          description,
          category,
          date: new Date(date).toISOString(),
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencySymbol = profile?.currency === 'EUR' ? '€' : profile?.currency === 'GBP' ? '£' : '$';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-surface-400">
            {currencySymbol}
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={cn(
              'w-full pl-10 pr-4 py-4 rounded-xl text-2xl font-semibold',
              'bg-surface-50 dark:bg-surface-800',
              'border border-surface-200 dark:border-surface-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'transition-all duration-200'
            )}
            required
          />
        </div>

        {/* Quick amounts */}
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleQuickAmount(value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                amount === value.toString()
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700'
              )}
            >
              {currencySymbol}{value}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What did you spend on?"
        required
      />

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          Category
        </label>
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200',
                category === cat.id
                  ? 'bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-500'
                  : 'bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
              )}
            >
              <CategoryIcon category={cat.id} size="sm" showBackground={category === cat.id} />
              <span className="text-[10px] font-medium text-surface-600 dark:text-surface-400 text-center line-clamp-1">
                {cat.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <Input
        type="date"
        label="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          {expense ? 'Update' : 'Add'} Expense
        </Button>
      </div>
    </form>
  );
};

// Expense Item Component
interface ExpenseItemProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  const profile = useStore((state) => state.profile);
  const category = CATEGORIES.find((c) => c.id === expense.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        'group flex items-center gap-4 p-4 rounded-xl',
        'bg-white dark:bg-surface-900',
        'border border-surface-100 dark:border-surface-800',
        'transition-all duration-200',
        'hover:shadow-soft-md hover:border-surface-200 dark:hover:border-surface-700'
      )}
    >
      <CategoryIcon category={expense.category} size="md" />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-surface-900 dark:text-white truncate">
          {expense.description}
        </p>
        <p className="text-sm text-surface-500">{category?.name}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-surface-900 dark:text-white">
          -{formatCurrency(expense.amount, profile?.currency || 'USD')}
        </p>
        <p className="text-xs text-surface-400">
          {formatDate(expense.date, 'h:mm a')}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onEdit}
          className={cn(
            'p-2 rounded-lg transition-colors duration-200',
            'hover:bg-surface-100 dark:hover:bg-surface-800'
          )}
        >
          <Edit2 className="w-4 h-4 text-surface-400" />
        </button>
        <button
          onClick={onDelete}
          className={cn(
            'p-2 rounded-lg transition-colors duration-200',
            'hover:bg-danger-50 dark:hover:bg-danger-900/30'
          )}
        >
          <Trash2 className="w-4 h-4 text-danger-400" />
        </button>
      </div>
    </motion.div>
  );
};
