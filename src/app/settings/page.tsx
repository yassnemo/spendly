'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from '@/components/layout/navigation';

// Dynamically import SettingsPage to avoid SSR issues
const SettingsPage = dynamic(
  () => import('@/components/settings').then((mod) => mod.SettingsPage),
  {
    ssr: false,
    loading: () => <SettingsLoading />,
  }
);

function SettingsLoading() {
  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto pb-24 lg:pb-8">
      <div className="mb-8">
        <div className="h-8 w-32 bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-4 w-48 bg-surface-200 dark:bg-surface-800 rounded mt-2 animate-pulse" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-surface-200 dark:bg-surface-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <Layout title="Settings" showBack>
      <SettingsPage />
    </Layout>
  );
}
