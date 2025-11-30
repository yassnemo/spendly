'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Moon,
  Sun,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Avatar } from '@/components/ui';
import { navItems } from './nav-items';

// Mobile Bottom Navigation
export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const mobileNavItems = navItems.slice(0, 5);

  return (
    <nav
      className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0 z-40',
        'bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl',
        'border-t border-surface-100 dark:border-surface-800',
        'safe-bottom'
      )}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl',
                'transition-all duration-200',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-surface-500 dark:text-surface-400'
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <item.icon className="w-6 h-6" />
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveNav"
                    className="absolute -inset-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// Mobile Header
interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  rightAction,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const profile = useStore((state) => state.profile);
  const resetStore = useStore((state) => state.resetStore);
  const { user, signOut: authSignOut } = useAuth();
  const router = useRouter();

  const displayName = user?.displayName || profile?.name || 'User';
  const avatarUrl = user?.photoURL || undefined;

  const handleSignOut = async () => {
    try {
      await authSignOut();
      await resetStore();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <header
        className={cn(
          'lg:hidden sticky top-0 z-30',
          'bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl',
          'border-b border-surface-100 dark:border-surface-800',
          'safe-top'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {showBack ? (
              <Link
                href="/dashboard"
                className="p-2 -ml-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </Link>
            ) : (
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 -ml-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            {title ? (
              <h1 className="text-xl font-bold text-surface-900 dark:text-white">{title}</h1>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-2">
                <img 
                  src="/images/logo.svg" 
                  alt="Spendly" 
                  className="w-8 h-8 rounded-lg shadow-soft-sm"
                />
                <span className="font-bold text-surface-900 dark:text-white">Spendly</span>
              </Link>
            )}
          </div>
          {rightAction || (
            <Avatar name={displayName} src={avatarUrl} size="sm" />
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'absolute left-0 top-0 bottom-0 w-80',
                'bg-white dark:bg-surface-900',
                'flex flex-col'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-surface-100 dark:border-surface-800">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <img 
                    src="/images/logo.svg" 
                    alt="Spendly" 
                    className="w-10 h-10 rounded-xl shadow-soft-sm"
                  />
                  <span className="text-xl font-bold text-surface-900 dark:text-white">Spendly</span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl',
                            'transition-all duration-200',
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="p-4 border-t border-surface-100 dark:border-surface-800 space-y-2">
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className={cn(
                    'flex items-center gap-3 w-full px-4 py-3 rounded-xl',
                    'text-surface-600 dark:text-surface-400',
                    'hover:bg-surface-50 dark:hover:bg-surface-800',
                    'transition-colors duration-200'
                  )}
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {user && (
                  <button
                    onClick={handleSignOut}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-3 rounded-xl',
                      'text-danger-600 dark:text-danger-400',
                      'hover:bg-danger-50 dark:hover:bg-danger-900/20',
                      'transition-colors duration-200'
                    )}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
