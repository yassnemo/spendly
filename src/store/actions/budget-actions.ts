import { Budget, CategoryType } from '@/types';
import { budgetsDB } from '@/lib/db';
import { generateId, getCurrentMonth } from '@/lib/utils';
import { CATEGORIES, BUDGET_DEFAULTS } from '@/lib/constants';
import { StoreSet, StoreGet } from '../types';

export const createBudgetActions = (set: StoreSet, get: StoreGet) => ({
  setBudget: async (category: CategoryType, limit: number) => {
    const month = get().currentMonth;
    const existing = get().budgets.find(
      (b) => b.category === category && b.month === month
    );

    const now = new Date().toISOString();

    if (existing) {
      const updated = { ...existing, limit, updatedAt: now };
      
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === existing.id ? updated : b
        ),
      }));
      
      try {
        await budgetsDB.update(updated);
      } catch (error) {
        console.error('Failed to update budget:', error);
      }
    } else {
      const budget: Budget = {
        id: generateId(),
        category,
        limit,
        spent: 0,
        month,
        createdAt: now,
        updatedAt: now,
      };
      
      set((state) => ({
        budgets: [...state.budgets, budget],
      }));
      
      try {
        await budgetsDB.add(budget);
      } catch (error) {
        console.error('Failed to add budget:', error);
      }
    }

    get().recalculateStats();
  },

  initializeDefaultBudgets: async (monthlyIncome: number) => {
    const month = getCurrentMonth();
    const now = new Date().toISOString();

    const budgets: Budget[] = CATEGORIES.map((cat) => ({
      id: generateId(),
      category: cat.id,
      limit: Math.round(monthlyIncome * (BUDGET_DEFAULTS[cat.id] / 100)),
      spent: 0,
      month,
      createdAt: now,
      updatedAt: now,
    }));

    for (const budget of budgets) {
      await budgetsDB.add(budget);
    }

    set((state) => ({
      budgets: [...state.budgets, ...budgets],
    }));
  },
});
