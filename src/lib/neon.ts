import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Lazy initialization of the database connection
// This prevents errors when the module is imported in the browser
let _sql: NeonQueryFunction<false, false> | null = null;
let _tablesInitialized = false;

function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set. Cloud sync requires a database connection.');
  }
  
  _sql = neon(databaseUrl);
  return _sql;
}

// Check if database is available (for client-side checks)
export function isDatabaseAvailable(): boolean {
  return typeof window === 'undefined' && !!process.env.DATABASE_URL;
}

// Initialize database tables (auto-migration)
export async function initializeTables(): Promise<void> {
  if (_tablesInitialized) return;
  
  const sql = getSql();
  
  // Create tables if they don't exist
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      display_name TEXT,
      photo_url TEXT,
      provider TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(10, 2) NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)`;

  await sql`
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      period TEXT NOT NULL DEFAULT 'monthly',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      target_amount DECIMAL(10, 2) NOT NULL,
      current_amount DECIMAL(10, 2) DEFAULT 0,
      deadline DATE,
      color TEXT DEFAULT '#3B82F6',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      settings JSONB DEFAULT '{}',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  
  _tablesInitialized = true;
}

// User table operations
export async function createUser(user: {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
}) {
  const sql = getSql();
  await sql`
    INSERT INTO users (id, email, display_name, photo_url, provider, created_at, updated_at)
    VALUES (${user.id}, ${user.email}, ${user.displayName}, ${user.photoURL}, ${user.provider}, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      photo_url = EXCLUDED.photo_url,
      updated_at = NOW()
  `;
}

export async function getUser(id: string) {
  const sql = getSql();
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;
  return result[0] || null;
}

// Expenses operations
export async function createExpense(expense: {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}) {
  const sql = getSql();
  await sql`
    INSERT INTO expenses (id, user_id, amount, category, description, date, created_at)
    VALUES (${expense.id}, ${expense.userId}, ${expense.amount}, ${expense.category}, ${expense.description}, ${expense.date}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      amount = EXCLUDED.amount,
      category = EXCLUDED.category,
      description = EXCLUDED.description,
      date = EXCLUDED.date
  `;
}

export async function getExpenses(userId: string) {
  const sql = getSql();
  return await sql`
    SELECT * FROM expenses 
    WHERE user_id = ${userId} 
    ORDER BY date DESC
  `;
}

export async function deleteExpense(id: string, userId: string) {
  const sql = getSql();
  await sql`DELETE FROM expenses WHERE id = ${id} AND user_id = ${userId}`;
}

// Budgets operations
export async function createBudget(budget: {
  id: string;
  userId: string;
  category: string;
  amount: number;
  period: string;
}) {
  const sql = getSql();
  await sql`
    INSERT INTO budgets (id, user_id, category, amount, period, created_at, updated_at)
    VALUES (${budget.id}, ${budget.userId}, ${budget.category}, ${budget.amount}, ${budget.period}, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      amount = EXCLUDED.amount,
      updated_at = NOW()
  `;
}

export async function getBudgets(userId: string) {
  const sql = getSql();
  return await sql`
    SELECT * FROM budgets 
    WHERE user_id = ${userId}
  `;
}

export async function deleteBudget(id: string, userId: string) {
  const sql = getSql();
  await sql`DELETE FROM budgets WHERE id = ${id} AND user_id = ${userId}`;
}

// Goals operations
export async function createGoal(goal: {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  color: string;
}) {
  const sql = getSql();
  await sql`
    INSERT INTO goals (id, user_id, name, target_amount, current_amount, deadline, color, created_at, updated_at)
    VALUES (${goal.id}, ${goal.userId}, ${goal.name}, ${goal.targetAmount}, ${goal.currentAmount}, ${goal.deadline}, ${goal.color}, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      target_amount = EXCLUDED.target_amount,
      current_amount = EXCLUDED.current_amount,
      deadline = EXCLUDED.deadline,
      color = EXCLUDED.color,
      updated_at = NOW()
  `;
}

export async function getGoals(userId: string) {
  const sql = getSql();
  return await sql`
    SELECT * FROM goals 
    WHERE user_id = ${userId}
  `;
}

export async function updateGoalAmount(id: string, userId: string, amount: number) {
  const sql = getSql();
  await sql`
    UPDATE goals 
    SET current_amount = ${amount}, updated_at = NOW()
    WHERE id = ${id} AND user_id = ${userId}
  `;
}

export async function deleteGoal(id: string, userId: string) {
  const sql = getSql();
  await sql`DELETE FROM goals WHERE id = ${id} AND user_id = ${userId}`;
}

// Settings operations
export async function saveSettings(userId: string, settings: Record<string, unknown>) {
  const sql = getSql();
  await sql`
    INSERT INTO user_settings (user_id, settings, updated_at)
    VALUES (${userId}, ${JSON.stringify(settings)}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      settings = EXCLUDED.settings,
      updated_at = NOW()
  `;
}

export async function getSettings(userId: string) {
  const sql = getSql();
  const result = await sql`
    SELECT settings FROM user_settings WHERE user_id = ${userId}
  `;
  return result[0]?.settings || null;
}
