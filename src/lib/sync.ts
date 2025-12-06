/**
 * Cloud Sync Service
 * Handles synchronization between local IndexedDB storage and Neon cloud database
 * 
 * Note: Cloud sync requires server-side API routes as DATABASE_URL is not available on client
 */

import { expensesDB, budgetsDB, goalsDB, incomesDB, profileDB } from './db';
import type { Expense, Budget, SavingsGoal, Income, UserProfile } from '@/types';

export interface SyncResult {
  success: boolean;
  error?: string;
  synced: {
    expenses: number;
    budgets: number;
    goals: number;
    incomes: number;
  };
}

/**
 * Check if we're running on the server side where database is available
 */
function isServerSide(): boolean {
  return typeof window === 'undefined';
}

/**
 * Push local data to cloud database
 * Note: This should be called through an API route, not directly from client
 */
export async function pushToCloud(userId: string): Promise<SyncResult> {
  // Cloud sync is not available on client side
  if (!isServerSide()) {
    return {
      success: false,
      error: 'Cloud sync is only available through API routes. This feature is coming soon.',
      synced: { expenses: 0, budgets: 0, goals: 0, incomes: 0 },
    };
  }

  const result: SyncResult = {
    success: true,
    synced: { expenses: 0, budgets: 0, goals: 0, incomes: 0 },
  };

  try {
    // Dynamic import to avoid loading neon on client side
    const neon = await import('./neon');
    
    // Sync expenses
    const expenses = await expensesDB.getAll();
    for (const expense of expenses) {
      await neon.createExpense({
        id: expense.id,
        userId: userId,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
      });
      result.synced.expenses++;
    }

    // Sync budgets
    const budgets = await budgetsDB.getAll();
    for (const budget of budgets) {
      await neon.createBudget({
        id: budget.id,
        userId: userId,
        category: budget.category,
        amount: budget.limit,
        period: budget.month,
      });
      result.synced.budgets++;
    }

    // Sync goals
    const goals = await goalsDB.getAll();
    for (const goal of goals) {
      await neon.createGoal({
        id: goal.id,
        userId: userId,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline || null,
        color: goal.color || '#3B82F6',
      });
      result.synced.goals++;
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to sync to cloud',
      synced: result.synced,
    };
  }
}

/**
 * Pull data from cloud database to local storage
 * Note: This should be called through an API route, not directly from client
 */
export async function pullFromCloud(userId: string): Promise<SyncResult> {
  // Cloud sync is not available on client side
  if (!isServerSide()) {
    return {
      success: false,
      error: 'Cloud sync is only available through API routes. This feature is coming soon.',
      synced: { expenses: 0, budgets: 0, goals: 0, incomes: 0 },
    };
  }

  const result: SyncResult = {
    success: true,
    synced: { expenses: 0, budgets: 0, goals: 0, incomes: 0 },
  };

  try {
    // Dynamic import to avoid loading neon on client side
    const neon = await import('./neon');
    
    // Clear local data first
    await clearLocalData();

    // Sync expenses from cloud
    const cloudExpenses = await neon.getExpenses(userId);
    for (const expense of cloudExpenses) {
      await expensesDB.add({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description || '',
        date: expense.date,
        createdAt: expense.created_at || new Date().toISOString(),
        updatedAt: expense.updated_at || new Date().toISOString(),
      });
      result.synced.expenses++;
    }

    // Sync budgets from cloud
    const cloudBudgets = await neon.getBudgets(userId);
    for (const budget of cloudBudgets) {
      await budgetsDB.add({
        id: budget.id,
        category: budget.category,
        limit: budget.amount,
        spent: 0, // Will be recalculated
        month: budget.period,
        createdAt: budget.created_at || new Date().toISOString(),
        updatedAt: budget.updated_at || new Date().toISOString(),
      });
      result.synced.budgets++;
    }

    // Sync goals from cloud
    const cloudGoals = await neon.getGoals(userId);
    for (const goal of cloudGoals) {
      await goalsDB.add({
        id: goal.id,
        name: goal.name,
        targetAmount: goal.target_amount,
        currentAmount: goal.current_amount,
        deadline: goal.deadline || undefined,
        color: goal.color || '#3B82F6',
        icon: goal.icon || 'piggy-bank',
        createdAt: goal.created_at || new Date().toISOString(),
        updatedAt: goal.updated_at || new Date().toISOString(),
      });
      result.synced.goals++;
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to sync from cloud',
      synced: result.synced,
    };
  }
}

/**
 * Full two-way sync - merges local and cloud data
 */
export async function syncData(userId: string): Promise<SyncResult> {
  // Cloud sync is not available on client side
  if (!isServerSide()) {
    return {
      success: false,
      error: 'Cloud sync is only available through API routes. This feature is coming soon.',
      synced: { expenses: 0, budgets: 0, goals: 0, incomes: 0 },
    };
  }

  try {
    // First push local to cloud
    const pushResult = await pushToCloud(userId);
    if (!pushResult.success) {
      return pushResult;
    }

    // Then pull any new data from cloud
    const pullResult = await pullFromCloud(userId);
    
    return {
      success: pullResult.success,
      error: pullResult.error,
      synced: {
        expenses: pushResult.synced.expenses + pullResult.synced.expenses,
        budgets: pushResult.synced.budgets + pullResult.synced.budgets,
        goals: pushResult.synced.goals + pullResult.synced.goals,
        incomes: pushResult.synced.incomes + pullResult.synced.incomes,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Sync failed',
      synced: { expenses: 0, budgets: 0, goals: 0, incomes: 0 },
    };
  }
}

/**
 * Clear all local data
 */
async function clearLocalData(): Promise<void> {
  const expenses = await expensesDB.getAll();
  for (const expense of expenses) {
    await expensesDB.delete(expense.id);
  }

  const budgets = await budgetsDB.getAll();
  for (const budget of budgets) {
    await budgetsDB.delete(budget.id);
  }

  const goals = await goalsDB.getAll();
  for (const goal of goals) {
    await goalsDB.delete(goal.id);
  }

  const incomes = await incomesDB.getAll();
  for (const income of incomes) {
    await incomesDB.delete(income.id);
  }
}

/**
 * Check if cloud sync is enabled for user
 */
export function isSyncEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('spendly-cloud-sync') === 'true';
}

/**
 * Enable/disable cloud sync
 */
export function setSyncEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('spendly-cloud-sync', enabled ? 'true' : 'false');
}

/**
 * Get last sync timestamp
 */
export function getLastSyncTime(): Date | null {
  if (typeof window === 'undefined') return null;
  const timestamp = localStorage.getItem('spendly-last-sync');
  return timestamp ? new Date(timestamp) : null;
}

/**
 * Set last sync timestamp
 */
export function setLastSyncTime(date: Date = new Date()): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('spendly-last-sync', date.toISOString());
}
