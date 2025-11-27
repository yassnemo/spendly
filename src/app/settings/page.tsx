'use client';

import { Layout } from '@/components/layout/navigation';
import { SettingsPage } from '@/components/settings';

export default function Settings() {
  return (
    <Layout title="Settings" showBack>
      <SettingsPage />
    </Layout>
  );
}
