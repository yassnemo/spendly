'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  onGetStarted: () => void;
}

export function Navbar({ onGetStarted }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between rounded-2xl bg-white/70 dark:bg-surface-900/70 backdrop-blur-xl px-6 py-3 shadow-soft border border-surface-200/50 dark:border-surface-800/50">
          <div className="flex items-center gap-2">
            <img 
              src="/images/logo.svg" 
              alt="Spendly" 
              className="w-8 h-8 rounded-xl"
            />
            <span className="font-semibold text-surface-900 dark:text-white tracking-tight">
              Spendly
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">
              How it works
            </a>
          </div>

          <button
            onClick={onGetStarted}
            className="px-4 py-2 text-sm font-medium text-white bg-surface-900 dark:bg-white dark:text-surface-900 rounded-xl hover:bg-surface-800 dark:hover:bg-surface-100 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
