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

export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
}

export interface AppState {
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
  currentUserId: string | null;
  
  // Sync State
  sync: SyncState;

  // Computed
  monthlyStats: MonthlyStats | null;
  financialHealth: { score: number; status: 'excellent' | 'good' | 'fair' | 'poor' } | null;

  // Actions
  initialize: (userId?: string) => Promise<void>;
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

  // Sync actions
  syncToCloud: () => Promise<{ success: boolean; error?: string }>;
  syncFromCloud: () => Promise<{ success: boolean; error?: string }>;
  clearSyncError: () => void;

  // Utility
  recalculateStats: () => void;
  setCurrentMonth: (month: string) => void;
  resetStore: () => Promise<void>;
}

export type StoreSet = (
  partial: AppState | Partial<AppState> | ((state: AppState) => AppState | Partial<AppState>),
  replace?: boolean
) => void;

export type StoreGet = () => AppState;
