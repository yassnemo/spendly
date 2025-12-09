'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui';
import { Sidebar } from './sidebar';
import { MobileNav, MobileHeader } from './mobile-nav';

// Main Layout Component
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showBack,
  rightAction,
}) => {
  const isOnboarded = useStore((state) => state.isOnboarded);
  const isLoading = useStore((state) => state.isLoading);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 animate-pulse" />
          <p className="text-surface-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Require authentication - redirect to home if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Sign In Required
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Please sign in to access your dashboard and manage your finances.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/')}
              className="w-full btn-primary btn-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show onboarding required if authenticated but not onboarded
  if (!isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Complete Your Setup
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Let&apos;s finish setting up your account to start tracking your finances.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/')}
              className="w-full btn-primary btn-lg"
            >
              Continue Setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar />
      <MobileHeader title={title} showBack={showBack} rightAction={rightAction} />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
};

// Re-export components
export { Sidebar } from './sidebar';
export { MobileNav, MobileHeader } from './mobile-nav';
export { navItems } from './nav-items';
