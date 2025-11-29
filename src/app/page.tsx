'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { OnboardingFlow } from '@/components/onboarding';
import { LandingPage } from '@/components/landing';
import { Skeleton } from '@/components/ui';

export default function HomePage() {
  const router = useRouter();
  const isOnboarded = useStore((state) => state.isOnboarded);
  const isLoading = useStore((state) => state.isLoading);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && isOnboarded) {
      router.push('/dashboard');
    }
  }, [isLoading, isOnboarded, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 animate-pulse" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isOnboarded && !showOnboarding) {
    return <LandingPage onGetStarted={() => setShowOnboarding(true)} />;
  }

  if (!isOnboarded && showOnboarding) {
    return <OnboardingFlow />;
  }

  return null;
}
