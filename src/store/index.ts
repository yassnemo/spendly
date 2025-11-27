import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Expense,
  Income,
  Budget,
  SavingsGoal,
  UserProfile,
  AIInsight,
  CategoryType,
  MonthlyStats,
} from '@/types';
import {
  db,
  expensesDB,
  incomesDB,
  budgetsDB,
  goalsDB,
  profileDB,
  insightsDB,
} from '@/lib/db';
import { generateId, getCurrentMonth } from '@/lib/utils';
import { CATEGORIES, BUDGET_DEFAULTS } from '@/lib/constants';
import {
  categorizeExpenseLocal,
  generateLocalInsights,
  calculateFinancialHealth,
} from '@/lib/ai';

interface AppState {
  // Data
  expenses: Expense[];
  incomes: Income[];
  budgets: Budget[];
  goals: SavingsGoal[];
  insights: AIInsight[];
  profile: UserProfile | null;

  // UI State
  isLoading: boolean;
  isOnboarded: boolean;
  currentMonth: string;
  theme: 'light' | 'dark' | 'system';

  // Computed
  monthlyStats: MonthlyStats | null;
  financialHealth: { score: number; status: 'excellent' | 'good' | 'fair' | 'poor' } | null;

  // Actions
  initialize: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Expense>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Income actions
  addIncome: (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Income>;
  updateIncome: (id: string, updates: Partial<Income>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;

  // Budget actions
  setBudget: (category: CategoryType, limit: number) => Promise<void>;
  initializeDefaultBudgets: (monthlyIncome: number) => Promise<void>;

  // Goal actions
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SavingsGoal>;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addToGoal: (id: string, amount: number) => Promise<void>;

  // Profile actions
  setProfile: (profile: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;

  // Insight actions
  refreshInsights: () => void;
  dismissInsight: (id: string) => Promise<void>;

  // Utility
  recalculateStats: () => void;
  setCurrentMonth: (month: string) => void;
}

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
      theme: 'system',
      monthlyStats: null,
      financialHealth: null,

      // Initialize app with data from IndexedDB
      initialize: async () => {
        try {
          await db.init();

          const [expenses, incomes, budgets, goals, insights, profile] =
            await Promise.all([
              expensesDB.getAll(),
              incomesDB.getAll(),
              budgetsDB.getAll(),
              goalsDB.getAll(),
              insightsDB.getAll(),
              profileDB.get(),
            ]);

          set({
            expenses,
            incomes,
            budgets,
            goals,
            insights,
            profile: profile || null,
            isOnboarded: profile?.onboardingCompleted || false,
            isLoading: false,
          });

          // Recalculate stats after loading
          get().recalculateStats();
        } catch (error) {
          console.error('Failed to initialize database:', error);
          set({ isLoading: false });
        }
      },

      setTheme: (theme) => set({ theme }),

      // Expense actions
      addExpense: async (expenseData) => {
        const now = new Date().toISOString();
        const expense: Expense = {
          ...expenseData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };

        await expensesDB.add(expense);

        set((state) => ({
          expenses: [...state.expenses, expense],
        }));

        get().recalculateStats();
        return expense;
      },

      updateExpense: async (id, updates) => {
        const expense = get().expenses.find((e) => e.id === id);
        if (!expense) return;

        const updated = {
          ...expense,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        await expensesDB.update(updated);

        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? updated : e)),
        }));

        get().recalculateStats();
      },

      deleteExpense: async (id) => {
        await expensesDB.delete(id);

        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));

        get().recalculateStats();
      },

      // Income actions
      addIncome: async (incomeData) => {
        const now = new Date().toISOString();
        const income: Income = {
          ...incomeData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };

        await incomesDB.add(income);

        set((state) => ({
          incomes: [...state.incomes, income],
        }));

        get().recalculateStats();
        return income;
      },

      updateIncome: async (id, updates) => {
        const income = get().incomes.find((i) => i.id === id);
        if (!income) return;

        const updated = {
          ...income,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        await incomesDB.update(updated);

        set((state) => ({
          incomes: state.incomes.map((i) => (i.id === id ? updated : i)),
        }));

        get().recalculateStats();
      },

      deleteIncome: async (id) => {
        await incomesDB.delete(id);

        set((state) => ({
          incomes: state.incomes.filter((i) => i.id !== id),
        }));

        get().recalculateStats();
      },

      // Budget actions
      setBudget: async (category, limit) => {
        const month = get().currentMonth;
        const existing = get().budgets.find(
          (b) => b.category === category && b.month === month
        );

        const now = new Date().toISOString();

        if (existing) {
          const updated = { ...existing, limit, updatedAt: now };
          await budgetsDB.update(updated);
          set((state) => ({
            budgets: state.budgets.map((b) =>
              b.id === existing.id ? updated : b
            ),
          }));
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
          await budgetsDB.add(budget);
          set((state) => ({
            budgets: [...state.budgets, budget],
          }));
        }

        get().recalculateStats();
      },

      initializeDefaultBudgets: async (monthlyIncome) => {
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

      // Goal actions
      addGoal: async (goalData) => {
        const now = new Date().toISOString();
        const goal: SavingsGoal = {
          ...goalData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };

        await goalsDB.add(goal);

        set((state) => ({
          goals: [...state.goals, goal],
        }));

        return goal;
      },

      updateGoal: async (id, updates) => {
        const goal = get().goals.find((g) => g.id === id);
        if (!goal) return;

        const updated = {
          ...goal,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        await goalsDB.update(updated);

        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? updated : g)),
        }));
      },

      deleteGoal: async (id) => {
        await goalsDB.delete(id);

        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },

      addToGoal: async (id, amount) => {
        const goal = get().goals.find((g) => g.id === id);
        if (!goal) return;

        const updated = {
          ...goal,
          currentAmount: goal.currentAmount + amount,
          updatedAt: new Date().toISOString(),
        };

        await goalsDB.update(updated);

        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? updated : g)),
        }));
      },

      // Profile actions
      setProfile: async (profileData) => {
        const existing = get().profile;
        const now = new Date().toISOString();

        const profile: UserProfile = {
          id: existing?.id || generateId(),
          name: profileData.name || existing?.name || '',
          email: profileData.email || existing?.email,
          monthlyIncome: profileData.monthlyIncome ?? existing?.monthlyIncome ?? 0,
          currency: profileData.currency || existing?.currency || 'USD',
          onboardingCompleted:
            profileData.onboardingCompleted ?? existing?.onboardingCompleted ?? false,
          createdAt: existing?.createdAt || now,
          updatedAt: now,
        };

        await profileDB.set(profile);
        set({ profile });
      },

      completeOnboarding: async () => {
        const profile = get().profile;
        if (profile) {
          await get().setProfile({ ...profile, onboardingCompleted: true });
        }
        set({ isOnboarded: true });
      },

      // Insight actions
      refreshInsights: () => {
        const { expenses, incomes, profile, currentMonth } = get();

        // Filter expenses for current month
        const monthExpenses = expenses.filter((e) =>
          e.date.startsWith(currentMonth)
        );

        // Calculate monthly income
        const monthIncomes = incomes.filter((i) =>
          i.date.startsWith(currentMonth)
        );
        const totalIncome =
          monthIncomes.reduce((sum, i) => sum + i.amount, 0) ||
          profile?.monthlyIncome ||
          0;

        // Calculate category totals
        const byCategory: Record<CategoryType, number> = {} as Record<
          CategoryType,
          number
        >;
        CATEGORIES.forEach((cat) => {
          byCategory[cat.id] = 0;
        });

        monthExpenses.forEach((expense) => {
          byCategory[expense.category] =
            (byCategory[expense.category] || 0) + expense.amount;
        });

        const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

        const stats: MonthlyStats = {
          month: currentMonth,
          totalIncome,
          totalExpenses,
          savings: totalIncome - totalExpenses,
          byCategory,
        };

        // Generate insights
        const insightTexts = generateLocalInsights(
          stats,
          monthExpenses,
          profile?.currency || 'USD'
        );

        const newInsights: AIInsight[] = insightTexts.map((text, index) => ({
          id: generateId(),
          type: index === 0 ? 'tip' : 'pattern',
          title: text.split('.')[0] || 'Insight',
          description: text,
          createdAt: new Date().toISOString(),
          isRead: false,
          priority: index === 0 ? 'high' : 'medium',
        }));

        set({ insights: newInsights });
      },

      dismissInsight: async (id) => {
        const insight = get().insights.find((i) => i.id === id);
        if (insight) {
          const updated = { ...insight, isRead: true };
          await insightsDB.update(updated);
          set((state) => ({
            insights: state.insights.map((i) => (i.id === id ? updated : i)),
          }));
        }
      },

      // Utility
      recalculateStats: () => {
        const { expenses, incomes, budgets, goals, profile, currentMonth } = get();

        // Filter for current month
        const monthExpenses = expenses.filter((e) =>
          e.date.startsWith(currentMonth)
        );
        const monthIncomes = incomes.filter((i) =>
          i.date.startsWith(currentMonth)
        );

        // Calculate totals
        const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalIncome =
          monthIncomes.reduce((sum, i) => sum + i.amount, 0) ||
          profile?.monthlyIncome ||
          0;

        // Calculate by category
        const byCategory: Record<CategoryType, number> = {} as Record<
          CategoryType,
          number
        >;
        CATEGORIES.forEach((cat) => {
          byCategory[cat.id] = 0;
        });

        monthExpenses.forEach((expense) => {
          byCategory[expense.category] =
            (byCategory[expense.category] || 0) + expense.amount;
        });

        const monthlyStats: MonthlyStats = {
          month: currentMonth,
          totalIncome,
          totalExpenses,
          savings: totalIncome - totalExpenses,
          byCategory,
        };

        // Update budget spent amounts
        const monthBudgets = budgets.filter((b) => b.month === currentMonth);
        const updatedBudgets = monthBudgets.map((budget) => ({
          ...budget,
          spent: byCategory[budget.category] || 0,
        }));

        // Calculate budget adherence
        const budgetAdherence = updatedBudgets.length
          ? updatedBudgets.reduce((sum, b) => {
              const ratio = b.limit > 0 ? Math.min(100, (b.spent / b.limit) * 100) : 100;
              return sum + (100 - Math.max(0, ratio - 100));
            }, 0) / updatedBudgets.length
          : 100;

        // Calculate goal progress
        const goalProgress = goals.length
          ? goals.reduce((sum, g) => {
              return sum + (g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0);
            }, 0) / goals.length
          : 0;

        // Calculate financial health
        const financialHealth = calculateFinancialHealth(
          totalIncome,
          totalExpenses,
          goalProgress,
          budgetAdherence
        );

        set({
          monthlyStats,
          financialHealth,
          budgets: budgets.map((b) => {
            const updated = updatedBudgets.find((ub) => ub.id === b.id);
            return updated || b;
          }),
        });
      },

      setCurrentMonth: (month) => {
        set({ currentMonth: month });
        get().recalculateStats();
      },
    }),
    {
      name: 'smart-budget-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        isOnboarded: state.isOnboarded,
        currentMonth: state.currentMonth,
      }),
    }
  )
);
