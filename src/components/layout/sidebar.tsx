'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon,
  Sun,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Avatar } from '@/components/ui';
import { navItems } from './nav-items';

// Desktop Sidebar
export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useStore((state) => state.profile);
  const resetStore = useStore((state) => state.resetStore);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, signOut: authSignOut, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await authSignOut();
      await resetStore();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const displayName = user?.displayName || profile?.name || 'User';
  const displayEmail = user?.email || profile?.email || 'Set up your profile';
  const avatarUrl = user?.photoURL || undefined;

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col w-64 h-screen',
        'bg-white dark:bg-surface-900',
        'border-r border-surface-100 dark:border-surface-800',
        'fixed left-0 top-0',
        className
      )}
    >
      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <img 
            src="/images/logo.svg" 
            alt="Spendly" 
            className="w-10 h-10 rounded-xl shadow-soft-md transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-xl font-bold text-surface-900 dark:text-white">
            Spendly
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-4 py-3 rounded-xl',
                    'font-medium transition-all duration-200',
                    'group',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                  )}
                >
                  <item.icon className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    'group-hover:scale-110'
                  )} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme toggle */}
      <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-800">
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-xl',
            'text-surface-600 dark:text-surface-400',
            'hover:bg-surface-50 dark:hover:bg-surface-800',
            'transition-all duration-200 group'
          )}
        >
          <div className="relative w-5 h-5 overflow-hidden">
            <motion.div
              animate={{ y: resolvedTheme === 'dark' ? 0 : 24 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Sun className="w-5 h-5" />
            </motion.div>
            <motion.div
              animate={{ y: resolvedTheme === 'dark' ? -24 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          </div>
          <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* User profile */}
      <div className="p-4 border-t border-surface-100 dark:border-surface-800">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              'flex items-center gap-3 w-full p-3 rounded-xl',
              'hover:bg-surface-50 dark:hover:bg-surface-800',
              'transition-all duration-200'
            )}
          >
            <Avatar 
              name={displayName} 
              src={avatarUrl}
              size="md" 
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="font-medium text-surface-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-xs text-surface-500 truncate">
                {displayEmail}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute bottom-full left-0 right-0 mb-2 p-2',
                  'bg-white dark:bg-surface-800 rounded-xl',
                  'border border-surface-100 dark:border-surface-700',
                  'shadow-soft-xl'
                )}
              >
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg',
                    'text-sm text-surface-600 dark:text-surface-400',
                    'hover:bg-surface-50 dark:hover:bg-surface-700',
                    'transition-colors duration-200'
                  )}
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </Link>
                {user && (
                  <button
                    onClick={handleSignOut}
                    className={cn(
                      'flex items-center gap-2 w-full px-3 py-2 rounded-lg',
                      'text-sm text-danger-600 dark:text-danger-400',
                      'hover:bg-danger-50 dark:hover:bg-danger-900/20',
                      'transition-colors duration-200'
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
};
