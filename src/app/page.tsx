'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { OnboardingFlow } from '@/components/onboarding';
import { LandingPage } from '@/components/landing';
import { Skeleton } from '@/components/ui';

export default function HomePage() {
  const router = useRouter();
  const isOnboarded = useStore((state) => state.isOnboarded);
  const isLoading = useStore((state) => state.isLoading);
  const profile = useStore((state) => state.profile);
  const { user, isLoading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Redirect to dashboard if user is onboarded
  useEffect(() => {
    if (!isLoading && !authLoading && isOnboarded) {
      router.push('/dashboard');
    }
  }, [isLoading, authLoading, isOnboarded, router]);

  // If user is authenticated but not onboarded, show onboarding
  useEffect(() => {
    if (!authLoading && !isLoading && user && !isOnboarded) {
      setShowOnboarding(true);
    }
  }, [user, authLoading, isLoading, isOnboarded]);

  // Show loading while auth or store is loading
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 animate-pulse" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!user && !showOnboarding) {
    return <LandingPage onGetStarted={() => setShowOnboarding(true)} />;
  }

  // Show onboarding for authenticated but not onboarded users
  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  return null;
}
