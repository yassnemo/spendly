// Type definitions for the Smart Budget App

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: CategoryType;
  date: string;
  createdAt: string;
  updatedAt: string;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
  notes?: string;
  tags?: string[];
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
}

export interface Budget {
  id: string;
  category: CategoryType;
  limit: number;
  spent: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  photoURL?: string;
  monthlyIncome: number;
  currency: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: AccentColor;
  compactMode: boolean;
  showAnimations: boolean;
  defaultView: 'dashboard' | 'expenses' | 'budget';
  notificationsEnabled: boolean;
  weekStartsOn: 0 | 1 | 6;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  showCents: boolean;
}

export type AccentColor = 'coral' | 'purple' | 'teal' | 'blue' | 'green' | 'amber';

export type CategoryType =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'utilities'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'travel'
  | 'subscriptions'
  | 'other';

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface FinancialHealth {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  tips: string[];
  savingsRate: number;
  spendingTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface AIInsight {
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'pattern';
  title: string;
  description: string;
  category?: CategoryType;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface MonthlyStats {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  byCategory: Record<CategoryType, number>;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category?: CategoryType;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface NotificationSettings {
  budgetAlerts: boolean;
  weeklyReports: boolean;
  goalReminders: boolean;
  unusualSpending: boolean;
}

export interface ExportData {
  version: string;
  exportDate: string;
  profile: UserProfile | null;
  preferences: UserPreferences;
  expenses: Expense[];
  incomes: Income[];
  budgets: Budget[];
  goals: SavingsGoal[];
}
