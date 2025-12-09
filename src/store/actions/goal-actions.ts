import { SavingsGoal } from '@/types';
import { goalsDB } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { StoreSet, StoreGet } from '../types';

export const createGoalActions = (set: StoreSet, get: StoreGet) => ({
  addGoal: async (goalData: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const goal: SavingsGoal = {
      ...goalData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      goals: [...state.goals, goal],
    }));

    try {
      await goalsDB.add(goal);
    } catch (error) {
      console.error('Failed to persist goal:', error);
    }

    return goal;
  },

  updateGoal: async (id: string, updates: Partial<SavingsGoal>) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) return;

    const updated = {
      ...goal,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? updated : g)),
    }));

    try {
      await goalsDB.update(updated);
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  },

  deleteGoal: async (id: string) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }));

    try {
      await goalsDB.delete(id);
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  },

  addToGoal: async (id: string, amount: number) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) return;

    const updated = {
      ...goal,
      currentAmount: goal.currentAmount + amount,
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? updated : g)),
    }));

    try {
      await goalsDB.update(updated);
    } catch (error) {
      console.error('Failed to update goal amount:', error);
    }
  },
});
