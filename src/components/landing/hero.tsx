'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import GradualBlur from '@/components/ui/gradual-blur';
import { DashboardPreview } from './dashboard-preview';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-[100svh] md:min-h-0 md:pt-44 md:pb-32 flex flex-col">
      {/* Background Ripple Effect */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-auto">
        <BackgroundRippleEffect />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fafaf9] dark:to-[#0c0c0b] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_0%,#fafaf9_100%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_0%,#0c0c0b_100%)] pointer-events-none" />
      </div>

      {/* Background gradient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary-200/20 dark:bg-secondary-900/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 flex-1 flex flex-col pt-28 pb-8 md:pt-0 md:pb-0 md:block">
        <div className="flex-1 md:hidden" />

        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-100 dark:border-primary-900/50 mb-6 md:mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              AI-powered insights
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-6xl lg:text-7xl font-bold text-surface-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Take control of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500">
              your money
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 md:mt-6 text-base md:text-xl text-surface-600 dark:text-surface-400 max-w-xl mx-auto leading-relaxed"
          >
            Track spending, set budgets, and reach your financial goals with intelligent insights
            that adapt to your lifestyle.
          </motion.p>
        </div>

        <div className="flex-1 md:hidden" />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 max-w-3xl mx-auto w-full"
        >
          <button
            onClick={onGetStarted}
            className="group w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-surface-900 dark:bg-white dark:text-surface-900 rounded-2xl hover:bg-surface-800 dark:hover:bg-surface-100 transition-all shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 text-base font-medium text-surface-700 dark:text-surface-300 rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-center"
          >
            See how it works
          </a>
        </motion.div>
      </div>

      {/* App Preview */}
      <div className="hidden md:block relative z-10 mx-auto max-w-[1400px] px-6 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative"
        >
          {/* Blue glow background effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-primary-500/30 to-blue-600/20 rounded-[2rem] blur-3xl opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent rounded-3xl blur-2xl" />

          <div className="relative mx-auto">
            {/* Browser frame */}
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-surface-200/50 dark:border-surface-700/50 bg-white dark:bg-surface-900 backdrop-blur-sm">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-100 dark:border-surface-800 bg-surface-50/80 dark:bg-surface-900/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-md mx-auto h-7 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                    <span className="text-xs text-surface-400">spendly.app/dashboard</span>
                  </div>
                </div>
              </div>

              {/* App preview content */}
              <div
                className="relative p-6 lg:p-8 bg-surface-50 dark:bg-surface-950 overflow-hidden"
                style={{ maxHeight: '600px' }}
              >
                <DashboardPreview />
                <GradualBlur
                  target="parent"
                  position="bottom"
                  height="8rem"
                  strength={3}
                  divCount={6}
                  curve="bezier"
                  exponential={true}
                  opacity={1}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
