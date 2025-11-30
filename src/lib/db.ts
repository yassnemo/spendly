// IndexedDB storage for offline-first approach
// This provides persistent storage that works in the browser

import { Expense, Income, Budget, SavingsGoal, UserProfile, AIInsight } from '@/types';

const DB_NAME = 'smart_budget_db';
const DB_VERSION = 1;

type StoreName = 'expenses' | 'incomes' | 'budgets' | 'goals' | 'profile' | 'insights';

interface StoreConfig {
  name: StoreName;
  keyPath: string;
  indexes?: { name: string; keyPath: string; unique: boolean }[];
}

const stores: StoreConfig[] = [
  {
    name: 'expenses',
    keyPath: 'id',
    indexes: [
      { name: 'date', keyPath: 'date', unique: false },
      { name: 'category', keyPath: 'category', unique: false },
    ],
  },
  {
    name: 'incomes',
    keyPath: 'id',
    indexes: [{ name: 'date', keyPath: 'date', unique: false }],
  },
  {
    name: 'budgets',
    keyPath: 'id',
    indexes: [
      { name: 'month', keyPath: 'month', unique: false },
      { name: 'category', keyPath: 'category', unique: false },
    ],
  },
  {
    name: 'goals',
    keyPath: 'id',
  },
  {
    name: 'profile',
    keyPath: 'id',
  },
  {
    name: 'insights',
    keyPath: 'id',
    indexes: [
      { name: 'type', keyPath: 'type', unique: false },
      { name: 'createdAt', keyPath: 'createdAt', unique: false },
    ],
  },
];

class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath,
            });

            store.indexes?.forEach((index) => {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique,
              });
            });
          }
        });
      };
    });
  }

  private getStore(storeName: StoreName, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // Generic CRUD operations
  async add<T>(storeName: StoreName, item: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.add(item);
      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: StoreName, item: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.put(item);
      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: StoreName, id: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readonly');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readonly');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: StoreName, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex<T>(
    storeName: StoreName,
    indexName: string,
    value: IDBValidKey
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readonly');
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: StoreName): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore(storeName, 'readwrite');
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new Database();

// Type-safe database helpers
export const expensesDB = {
  getAll: () => db.getAll<Expense>('expenses'),
  get: (id: string) => db.get<Expense>('expenses', id),
  add: (expense: Expense) => db.add<Expense>('expenses', expense),
  update: (expense: Expense) => db.put<Expense>('expenses', expense),
  delete: (id: string) => db.delete('expenses', id),
  getByCategory: (category: string) =>
    db.getByIndex<Expense>('expenses', 'category', category),
  clear: () => db.clear('expenses'),
};

export const incomesDB = {
  getAll: () => db.getAll<Income>('incomes'),
  get: (id: string) => db.get<Income>('incomes', id),
  add: (income: Income) => db.add<Income>('incomes', income),
  update: (income: Income) => db.put<Income>('incomes', income),
  delete: (id: string) => db.delete('incomes', id),
  clear: () => db.clear('incomes'),
};

export const budgetsDB = {
  getAll: () => db.getAll<Budget>('budgets'),
  get: (id: string) => db.get<Budget>('budgets', id),
  add: (budget: Budget) => db.add<Budget>('budgets', budget),
  update: (budget: Budget) => db.put<Budget>('budgets', budget),
  delete: (id: string) => db.delete('budgets', id),
  getByMonth: (month: string) => db.getByIndex<Budget>('budgets', 'month', month),
  clear: () => db.clear('budgets'),
};

export const goalsDB = {
  getAll: () => db.getAll<SavingsGoal>('goals'),
  get: (id: string) => db.get<SavingsGoal>('goals', id),
  add: (goal: SavingsGoal) => db.add<SavingsGoal>('goals', goal),
  update: (goal: SavingsGoal) => db.put<SavingsGoal>('goals', goal),
  delete: (id: string) => db.delete('goals', id),
  clear: () => db.clear('goals'),
};

export const profileDB = {
  get: async (): Promise<UserProfile | undefined> => {
    const profiles = await db.getAll<UserProfile>('profile');
    return profiles[0];
  },
  set: (profile: UserProfile) => db.put<UserProfile>('profile', profile),
  clear: () => db.clear('profile'),
};

export const insightsDB = {
  getAll: () => db.getAll<AIInsight>('insights'),
  add: (insight: AIInsight) => db.add<AIInsight>('insights', insight),
  update: (insight: AIInsight) => db.put<AIInsight>('insights', insight),
  delete: (id: string) => db.delete('insights', id),
  clear: () => db.clear('insights'),
};
