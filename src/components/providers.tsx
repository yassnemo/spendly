'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { FloatingChat } from '@/components/chat/floating-chat';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const initialize = useStore((state) => state.initialize);
  const isOnboarded = useStore((state) => state.isOnboarded);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    initialize();
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-primary-500 animate-pulse" />
      </div>
    );
  }

  // Show floating chat only on app pages when user is onboarded
  // Hide on landing page, auth pages, and when not logged in
  const showFloatingChat = isOnboarded && pathname !== '/' && !pathname?.startsWith('/auth');

  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
        {showFloatingChat && <FloatingChat />}
      </ThemeProvider>
    </AuthProvider>
  );
}
