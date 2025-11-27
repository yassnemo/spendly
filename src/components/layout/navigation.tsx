'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  Sparkles,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  ChevronLeft,
  LogOut,
  User,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Avatar, Button } from '@/components/ui';

// Navigation items
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/budget', label: 'Budget', icon: Wallet },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/insights', label: 'Insights', icon: Sparkles },
  { href: '/settings', label: 'Settings', icon: Settings },
];

// Desktop Sidebar
export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useStore((state) => state.profile);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, signOut: authSignOut, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await authSignOut();
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
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            'bg-primary-500 shadow-soft-md',
            'transition-transform duration-300 group-hover:scale-105'
          )}>
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900 dark:text-white">
            SmartBudget
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
  const { user, signOut: authSignOut } = useAuth();
  const router = useRouter();

  const displayName = user?.displayName || profile?.name || 'User';
  const avatarUrl = user?.photoURL || undefined;

  const handleSignOut = async () => {
    try {
      await authSignOut();
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
                <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-soft-sm">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-surface-900 dark:text-white">SmartBudget</span>
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
                  <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft-sm">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-surface-900 dark:text-white">SmartBudget</span>
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
