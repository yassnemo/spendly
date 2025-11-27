'use client';

import { Layout } from '@/components/layout/navigation';
import { InsightsPage } from '@/components/insights';

export default function Insights() {
  return (
    <Layout title="AI Insights">
      <InsightsPage />
    </Layout>
  );
}
