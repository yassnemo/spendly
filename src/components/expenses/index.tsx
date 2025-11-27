'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Trash2,
  Edit2,
  X,
  Receipt,
  TrendingDown,
} from 'lucide-react';
import { useStore } from '@/store';
import { Card, Button, Input, Badge, EmptyState } from '@/components/ui';
import { Modal, Sheet, ConfirmDialog } from '@/components/ui/modal';
import { CategoryIcon } from '@/components/category-icon';
import { cn, formatCurrency, formatDate, groupByDate } from '@/lib/utils';
import { CATEGORIES, QUICK_AMOUNTS } from '@/lib/constants';
import { categorizeExpenseLocal } from '@/lib/ai';
import { CategoryType, Expense } from '@/types';

// Add/Edit Expense Form
interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onClose }) => {
  const addExpense = useStore((state) => state.addExpense);
  const updateExpense = useStore((state) => state.updateExpense);
  const profile = useStore((state) => state.profile);

  const [amount, setAmount] = useState(expense?.amount.toString() || '');
  const [description, setDescription] = useState(expense?.description || '');
  const [category, setCategory] = useState<CategoryType>(expense?.category || 'other');
  const [date, setDate] = useState(expense?.date?.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-categorize on description change
  React.useEffect(() => {
    if (description && !expense) {
      const suggestedCategory = categorizeExpenseLocal(description);
      setCategory(suggestedCategory);
    }
  }, [description, expense]);

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
              onClick={() => setCategory(cat.id)}
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

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
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

// Filter Component
interface FilterState {
  category: CategoryType | 'all';
  dateRange: 'week' | 'month' | 'year' | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

const FilterDropdown: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
}> = ({ filters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLocalFilters({ ...localFilters, category: 'all' })}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
              localFilters.category === 'all'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setLocalFilters({ ...localFilters, category: cat.id })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                localFilters.category === cat.id
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              )}
            >
              {cat.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
          Date Range
        </label>
        <div className="flex gap-2">
          {(['week', 'month', 'year', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setLocalFilters({ ...localFilters, dateRange: range })}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                localFilters.dateRange === range
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
          Sort By
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setLocalFilters({ ...localFilters, sortBy: 'date' })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              localFilters.sortBy === 'date'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
            )}
          >
            Date
          </button>
          <button
            onClick={() => setLocalFilters({ ...localFilters, sortBy: 'amount' })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              localFilters.sortBy === 'amount'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
            )}
          >
            Amount
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => {
            setLocalFilters({
              category: 'all',
              dateRange: 'month',
              sortBy: 'date',
              sortOrder: 'desc',
            });
          }}
        >
          Reset
        </Button>
        <Button className="flex-1" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

// Main Expenses Component
export const ExpensesPage: React.FC = () => {
  const expenses = useStore((state) => state.expenses);
  const deleteExpense = useStore((state) => state.deleteExpense);
  const profile = useStore((state) => state.profile);

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    dateRange: 'month',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Filter and sort expenses
  const filteredExpenses = React.useMemo(() => {
    let result = [...expenses];

    // Search filter
    if (searchQuery) {
      result = result.filter((e) =>
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((e) => e.category === filters.category);
    }

    // Date range filter
    const now = new Date();
    if (filters.dateRange !== 'all') {
      const ranges = {
        week: 7,
        month: 30,
        year: 365,
      };
      const days = ranges[filters.dateRange];
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      result = result.filter((e) => new Date(e.date) >= cutoff);
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortOrder === 'desc'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return filters.sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    });

    return result;
  }, [expenses, searchQuery, filters]);

  // Group by date
  const groupedExpenses = React.useMemo(() => {
    return groupByDate(filteredExpenses);
  }, [filteredExpenses]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const hasActiveFilters = filters.category !== 'all' || filters.dateRange !== 'month';

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger-500 flex items-center justify-center shadow-soft-sm">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            Expenses
          </h1>
          <p className="text-surface-500 mt-1">
            Total: {formatCurrency(totalFiltered, profile?.currency || 'USD')} from {filteredExpenses.length} transactions
          </p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowForm(true)}>
          Add Expense
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftElement={<Search className="w-5 h-5 text-surface-400" />}
            rightElement={
              searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              )
            }
          />
        </div>
        <Button
          variant="secondary"
          className="relative"
          onClick={() => setShowFilters(true)}
        >
          <Filter className="w-5 h-5" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full" />
          )}
        </Button>
      </div>

      {/* Expenses List */}
      {Object.keys(groupedExpenses).length === 0 ? (
        <Card className="py-12">
          <EmptyState
            icon={<Receipt className="w-12 h-12" />}
            title="No expenses found"
            description={
              searchQuery
                ? 'Try a different search term'
                : 'Start tracking your spending by adding your first expense'
            }
            action={
              !searchQuery
                ? <Button onClick={() => setShowForm(true)}>Add Expense</Button>
                : undefined
            }
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
            <motion.div 
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm font-medium text-surface-500 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(date, 'EEEE, MMMM d')}
              </h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {dayExpenses.map((expense) => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      onEdit={() => handleEdit(expense)}
                      onDelete={() => setDeleteId(expense.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingExpense(undefined);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          expense={editingExpense}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(undefined);
          }}
        />
      </Modal>

      {/* Filter Sheet */}
      <Sheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Expenses"
      >
        <FilterDropdown
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      </Sheet>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Expense?"
        description="This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
