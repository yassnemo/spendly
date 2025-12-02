'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function AuthActionHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const continueUrl = searchParams.get('continueUrl');
  const lang = searchParams.get('lang') || 'en';

  useEffect(() => {
    // Redirect based on the mode
    switch (mode) {
      case 'resetPassword':
        // Redirect to password reset page with the code
        router.replace(`/reset-password?mode=${mode}&oobCode=${oobCode}`);
        break;
      case 'verifyEmail':
        // Redirect to email verification page
        router.replace(`/verify-email?mode=${mode}&oobCode=${oobCode}`);
        break;
      case 'recoverEmail':
        // Redirect to email recovery page
        router.replace(`/recover-email?mode=${mode}&oobCode=${oobCode}`);
        break;
      default:
        // Unknown mode, redirect to home
        router.replace('/');
    }
  }, [mode, oobCode, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-accent-50/30 to-secondary-50/30 dark:from-surface-950 dark:via-accent-950/20 dark:to-secondary-950/20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-surface-600 dark:text-surface-400">
          Redirecting...
        </p>
      </div>
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-accent-50/30 to-secondary-50/30 dark:from-surface-950 dark:via-accent-950/20 dark:to-secondary-950/20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthActionHandler />
    </Suspense>
  );
}
