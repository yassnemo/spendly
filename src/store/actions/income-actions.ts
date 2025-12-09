import { Income } from '@/types';
import { incomesDB } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { StoreSet, StoreGet } from '../types';

export const createIncomeActions = (set: StoreSet, get: StoreGet) => ({
  addIncome: async (incomeData: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const income: Income = {
      ...incomeData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      incomes: [...state.incomes, income],
    }));

    try {
      await incomesDB.add(income);
    } catch (error) {
      console.error('Failed to persist income:', error);
    }

    get().recalculateStats();
    return income;
  },

  updateIncome: async (id: string, updates: Partial<Income>) => {
    const income = get().incomes.find((i) => i.id === id);
    if (!income) return;

    const updated = {
      ...income,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      incomes: state.incomes.map((i) => (i.id === id ? updated : i)),
    }));

    try {
      await incomesDB.update(updated);
    } catch (error) {
      console.error('Failed to update income:', error);
    }

    get().recalculateStats();
  },

  deleteIncome: async (id: string) => {
    set((state) => ({
      incomes: state.incomes.filter((i) => i.id !== id),
    }));

    try {
      await incomesDB.delete(id);
    } catch (error) {
      console.error('Failed to delete income:', error);
    }

    get().recalculateStats();
  },
});
