'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, X, Receipt, TrendingDown } from 'lucide-react';
import { useStore } from '@/store';
import { Card, Button, Input, EmptyState } from '@/components/ui';
import { Modal, Sheet, ConfirmDialog } from '@/components/ui/modal';
import { formatCurrency, formatDate, groupByDate } from '@/lib/utils';
import { Expense } from '@/types';
import { ExpenseForm, ExpenseItem } from './expense-form';
import { FilterDropdown, FilterState } from './expense-filter';

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
