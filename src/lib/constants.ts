import { CategoryInfo, CategoryType } from '@/types';

// Category configurations with icons, colors, and gradients
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'UtensilsCrossed',
    color: '#f97316',
    gradient: 'from-orange-400 to-orange-600',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'Car',
    color: '#3b82f6',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#ec4899',
    gradient: 'from-pink-400 to-pink-600',
  },
  {
    id: 'utilities',
    name: 'Utilities & Bills',
    icon: 'Zap',
    color: '#eab308',
    gradient: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Gamepad2',
    color: '#a855f7',
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: 'Heart',
    color: '#ef4444',
    gradient: 'from-red-400 to-red-600',
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
    color: '#14b8a6',
    gradient: 'from-teal-400 to-teal-600',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'Plane',
    color: '#06b6d4',
    gradient: 'from-cyan-400 to-cyan-600',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: 'CreditCard',
    color: '#8b5cf6',
    gradient: 'from-violet-400 to-violet-600',
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'MoreHorizontal',
    color: '#6b7280',
    gradient: 'from-gray-400 to-gray-600',
  },
];

export const getCategoryById = (id: CategoryType): CategoryInfo => {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
};

// Currency configurations
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

// Financial health thresholds
export const HEALTH_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40,
  poor: 0,
};

// Default budget percentages (based on 50/30/20 rule)
export const BUDGET_DEFAULTS: Record<CategoryType, number> = {
  food: 15,
  transport: 10,
  shopping: 10,
  utilities: 10,
  entertainment: 5,
  health: 5,
  education: 5,
  travel: 5,
  subscriptions: 5,
  other: 10,
};

// Quick add amounts
export const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 200];

// Chart colors - coordinated with site design
export const CHART_COLORS = [
  '#3b82f6', // primary blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#06b6d4', // cyan
  '#14b8a6', // teal
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f97316', // orange
  '#64748b', // slate
];

// Savings goal icons
export const GOAL_ICONS = [
  'Wallet',
  'Home',
  'Car',
  'Plane',
  'GraduationCap',
  'Gift',
  'Smartphone',
  'Laptop',
  'Heart',
  'Star',
];

// Goal colors - coordinated with primary palette
export const GOAL_COLORS = [
  '#3b82f6', // primary blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f97316', // orange
  '#14b8a6', // teal
];
