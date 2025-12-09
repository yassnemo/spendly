import { Expense } from '@/types';
import { expensesDB } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { StoreSet, StoreGet } from '../types';

export const createExpenseActions = (set: StoreSet, get: StoreGet) => ({
  addExpense: async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const expense: Expense = {
      ...expenseData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      expenses: [...state.expenses, expense],
    }));

    try {
      await expensesDB.add(expense);
    } catch (error) {
      console.error('Failed to persist expense:', error);
    }

    get().recalculateStats();
    return expense;
  },

  updateExpense: async (id: string, updates: Partial<Expense>) => {
    const expense = get().expenses.find((e) => e.id === id);
    if (!expense) return;

    const updated = {
      ...expense,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? updated : e)),
    }));

    try {
      await expensesDB.update(updated);
    } catch (error) {
      console.error('Failed to update expense:', error);
    }

    get().recalculateStats();
  },

  deleteExpense: async (id: string) => {
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));

    try {
      await expensesDB.delete(id);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }

    get().recalculateStats();
  },
});
