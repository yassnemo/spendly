'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider, useAuth } from '@/components/auth/auth-provider';
import { FloatingChat } from '@/components/chat/floating-chat';

// Inner component that has access to auth context
function AppInitializer({ children }: { children: React.ReactNode }) {
  const [initError, setInitError] = useState<string | null>(null);
  const initialize = useStore((state) => state.initialize);
  const isOnboarded = useStore((state) => state.isOnboarded);
  const isLoading = useStore((state) => state.isLoading);
  const currentUserId = useStore((state) => state.currentUserId);
  const pathname = usePathname();
  const { user, isLoading: authLoading } = useAuth();

  // Initialize store when user changes
  useEffect(() => {
    const initApp = async () => {
      // Wait for auth to finish loading
      if (authLoading) return;
      
      // Get user ID (undefined if not logged in)
      const userId = user?.id;
      
      // Only reinitialize if user changed
      if (userId !== currentUserId) {
        try {
          await initialize(userId);
        } catch (error) {
          console.error('Failed to initialize app:', error);
          setInitError(error instanceof Error ? error.message : 'Unknown error');
        }
      }
    };

    initApp();
  }, [user, authLoading, initialize, currentUserId]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary-500 animate-pulse" />
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Failed to initialize app</h2>
          <p className="text-sm text-surface-500">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show floating chat only on app pages when user is onboarded
  // Hide on landing page, auth pages, and when not logged in
  const showFloatingChat = isOnboarded && pathname !== '/' && !pathname?.startsWith('/auth');

  return (
    <>
      {children}
      {showFloatingChat && <FloatingChat />}
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary-500 animate-pulse" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <AppInitializer>
          {children}
        </AppInitializer>
      </ThemeProvider>
    </AuthProvider>
  );
}
