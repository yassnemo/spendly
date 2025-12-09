import { expensesDB, budgetsDB, goalsDB, profileDB } from '@/lib/db';
import { StoreSet, StoreGet } from '../types';

export const createSyncActions = (set: StoreSet, get: StoreGet) => ({
  syncToCloud: async () => {
    const { currentUserId, expenses, budgets, goals, profile } = get();
    
    if (!currentUserId) {
      return { success: false, error: 'Not logged in. Please sign in to sync.' };
    }

    set((state) => ({
      sync: { ...state.sync, isSyncing: true, syncError: null },
    }));

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          expenses,
          budgets,
          goals,
          profile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync to cloud');
      }

      set((state) => ({
        sync: {
          ...state.sync,
          isSyncing: false,
          lastSyncTime: new Date().toISOString(),
          syncError: null,
        },
      }));

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sync to cloud';
      set((state) => ({
        sync: { ...state.sync, isSyncing: false, syncError: errorMessage },
      }));
      return { success: false, error: errorMessage };
    }
  },

  syncFromCloud: async () => {
    const { currentUserId } = get();
    
    if (!currentUserId) {
      return { success: false, error: 'Not logged in. Please sign in to sync.' };
    }

    set((state) => ({
      sync: { ...state.sync, isSyncing: true, syncError: null },
    }));

    try {
      const response = await fetch(`/api/sync?userId=${currentUserId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync from cloud');
      }

      const { expenses, budgets, goals, profile } = data.data;

      // Clear local IndexedDB and save cloud data
      await Promise.all([
        expensesDB.clear(),
        budgetsDB.clear(),
        goalsDB.clear(),
      ]);

      // Save expenses to IndexedDB
      for (const expense of expenses) {
        await expensesDB.add(expense);
      }

      // Save budgets to IndexedDB
      for (const budget of budgets) {
        await budgetsDB.add(budget);
      }

      // Save goals to IndexedDB
      for (const goal of goals) {
        await goalsDB.add(goal);
      }

      // Update profile if exists
      if (profile) {
        await profileDB.set({ ...profile, id: 'profile' });
      }

      // Update state with cloud data
      set((state) => ({
        expenses,
        budgets,
        goals,
        profile: profile || state.profile,
        isOnboarded: profile?.onboardingCompleted || state.isOnboarded,
        sync: {
          ...state.sync,
          isSyncing: false,
          lastSyncTime: new Date().toISOString(),
          syncError: null,
        },
      }));

      // Recalculate stats
      get().recalculateStats();

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sync from cloud';
      set((state) => ({
        sync: { ...state.sync, isSyncing: false, syncError: errorMessage },
      }));
      return { success: false, error: errorMessage };
    }
  },

  clearSyncError: () => {
    set((state) => ({
      sync: { ...state.sync, syncError: null },
    }));
  },
});
