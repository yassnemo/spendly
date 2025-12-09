import { NextRequest, NextResponse } from 'next/server';
import * as neon from '@/lib/neon';

// POST /api/sync - Push local data to cloud
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, expenses, budgets, goals, profile } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Initialize tables if they don't exist
    await neon.initializeTables();

    const results = {
      expenses: 0,
      budgets: 0,
      goals: 0,
      profile: false,
    };

    // Sync user profile first
    if (profile) {
      await neon.createUser({
        id: userId,
        email: profile.email || '',
        displayName: profile.name || null,
        photoURL: null,
        provider: 'app',
      });
      
      // Save profile settings
      await neon.saveSettings(userId, {
        name: profile.name,
        monthlyIncome: profile.monthlyIncome,
        currency: profile.currency,
        onboardingCompleted: profile.onboardingCompleted,
      });
      results.profile = true;
    }

    // Sync expenses
    if (expenses && Array.isArray(expenses)) {
      for (const expense of expenses) {
        await neon.createExpense({
          id: expense.id,
          userId: userId,
          amount: expense.amount,
          category: expense.category,
          description: expense.description || '',
          date: expense.date,
        });
        results.expenses++;
      }
    }

    // Sync budgets
    if (budgets && Array.isArray(budgets)) {
      for (const budget of budgets) {
        await neon.createBudget({
          id: budget.id,
          userId: userId,
          category: budget.category,
          amount: budget.limit,
          period: budget.month,
        });
        results.budgets++;
      }
    }

    // Sync goals
    if (goals && Array.isArray(goals)) {
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
        results.goals++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data synced to cloud successfully',
      synced: results,
    });
  } catch (error: any) {
    console.error('Sync push error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync data to cloud' },
      { status: 500 }
    );
  }
}

// GET /api/sync - Pull data from cloud
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Initialize tables if they don't exist
    await neon.initializeTables();

    // Fetch all user data from cloud
    const [expenses, budgets, goals, settings] = await Promise.all([
      neon.getExpenses(userId),
      neon.getBudgets(userId),
      neon.getGoals(userId),
      neon.getSettings(userId),
    ]);

    // Transform data to match local format
    const transformedExpenses = expenses.map((e: any) => ({
      id: e.id,
      amount: parseFloat(e.amount),
      category: e.category,
      description: e.description || '',
      date: e.date,
      createdAt: e.created_at,
      updatedAt: e.updated_at || e.created_at,
    }));

    const transformedBudgets = budgets.map((b: any) => ({
      id: b.id,
      category: b.category,
      limit: parseFloat(b.amount),
      spent: 0, // Will be recalculated locally
      month: b.period,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    }));

    const transformedGoals = goals.map((g: any) => ({
      id: g.id,
      name: g.name,
      targetAmount: parseFloat(g.target_amount),
      currentAmount: parseFloat(g.current_amount),
      deadline: g.deadline,
      color: g.color || '#3B82F6',
      icon: g.icon || 'piggy-bank',
      createdAt: g.created_at,
      updatedAt: g.updated_at,
    }));

    // Transform profile from settings
    const profile = settings ? {
      id: 'profile',
      name: settings.name || '',
      email: settings.email || '',
      monthlyIncome: settings.monthlyIncome || 0,
      currency: settings.currency || 'USD',
      onboardingCompleted: settings.onboardingCompleted || false,
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        expenses: transformedExpenses,
        budgets: transformedBudgets,
        goals: transformedGoals,
        profile,
      },
    });
  } catch (error: any) {
    console.error('Sync pull error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data from cloud' },
      { status: 500 }
    );
  }
}
