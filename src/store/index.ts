import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  db,
  expensesDB,
  incomesDB,
  budgetsDB,
  goalsDB,
  profileDB,
  insightsDB,
} from '@/lib/db';
import { getCurrentMonth } from '@/lib/utils';
import { AppState } from './types';
import {
  createExpenseActions,
  createIncomeActions,
  createBudgetActions,
  createGoalActions,
  createProfileActions,
  createSyncActions,
  createStatsActions,
} from './actions';

export type { AppState, SyncState } from './types';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      expenses: [],
      incomes: [],
      budgets: [],
      goals: [],
      insights: [],
      profile: null,
      isLoading: true,
      isOnboarded: false,
      currentMonth: getCurrentMonth(),
      theme: 'dark',
      monthlyStats: null,
      financialHealth: null,
      currentUserId: null,
      sync: {
        isSyncing: false,
        lastSyncTime: null,
        syncError: null,
      },

      // Initialize app with data from IndexedDB (user-specific)
      initialize: async (userId?: string) => {
        set({ isLoading: true });
        
        try {
          await db.init(userId);

          const [expenses, incomes, budgets, goals, insights, profile] =
            await Promise.all([
              expensesDB.getAll(),
              incomesDB.getAll(),
              budgetsDB.getAll(),
              goalsDB.getAll(),
              insightsDB.getAll(),
              profileDB.get(),
            ]);

          const isOnboarded = profile?.onboardingCompleted || false;

          set({
            expenses,
            incomes,
            budgets,
            goals,
            insights,
            profile: profile || null,
            isOnboarded,
            isLoading: false,
            currentUserId: userId || null,
          });

          get().recalculateStats();
        } catch (error) {
          console.error('Failed to initialize database:', error);
          set({ isLoading: false });
        }
      },

      setTheme: (theme) => set({ theme }),

      // Spread in modular actions
      ...createExpenseActions(set, get),
      ...createIncomeActions(set, get),
      ...createBudgetActions(set, get),
      ...createGoalActions(set, get),
      ...createProfileActions(set, get),
      ...createSyncActions(set, get),
      ...createStatsActions(set, get),

      // Reset store
      resetStore: async () => {
        try {
          await Promise.all([
            expensesDB.clear(),
            incomesDB.clear(),
            budgetsDB.clear(),
            goalsDB.clear(),
            insightsDB.clear(),
            profileDB.clear(),
          ]);
        } catch (error) {
          console.error('Failed to clear IndexedDB:', error);
        }

        set({
          expenses: [],
          incomes: [],
          budgets: [],
          goals: [],
          insights: [],
          profile: null,
          isOnboarded: false,
          monthlyStats: null,
          financialHealth: null,
        });
      },
    }),
    {
      name: 'spendly-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        currentMonth: state.currentMonth,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('[Store] Hydrated from localStorage');
        }
      },
    }
  )
);
