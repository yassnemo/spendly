'use client';

import { Layout } from '@/components/layout/navigation';
import { BudgetPage } from '@/components/budget';

export default function Budget() {
  return (
    <Layout title="Budget">
      <BudgetPage />
    </Layout>
  );
}
