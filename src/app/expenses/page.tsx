'use client';

import { Layout } from '@/components/layout/navigation';
import { ExpensesPage } from '@/components/expenses';

export default function Expenses() {
  return (
    <Layout title="Expenses">
      <ExpensesPage />
    </Layout>
  );
}
