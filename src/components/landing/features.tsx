'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Target, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import GradualBlur from '@/components/ui/gradual-blur';

const features = [
  {
    icon: PieChart,
    title: 'Smart Tracking',
    description: 'Automatically categorize and track your spending with intelligent insights.',
    color: 'primary',
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set savings goals and track your progress with visual milestones.',
    color: 'secondary',
  },
  {
    icon: Sparkles,
    title: 'AI Insights',
    description: 'Get personalized recommendations powered by AI to optimize your budget.',
    color: 'accent',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and never shared with third parties.',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Access your budget anywhere with instant sync across all devices.',
    color: 'secondary',
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis',
    description: 'Understand your spending patterns with detailed charts and reports.',
    color: 'accent',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 md:py-32 bg-white dark:bg-surface-950 overflow-hidden">
      <GradualBlur
        target="parent"
        position="top"
        height="6rem"
        strength={2}
        divCount={5}
        curve="ease-out"
        opacity={0.8}
      />
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight font-display"
          >
            Everything you need to manage your finances
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-surface-600 dark:text-surface-400"
          >
            Powerful features designed to help you take control of your money.
          </motion.p>
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden -mx-6 px-6">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[280px] snap-center p-5 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      feature.color === 'primary' && 'bg-primary-100 dark:bg-primary-900/30',
                      feature.color === 'secondary' && 'bg-secondary-100 dark:bg-secondary-900/30',
                      feature.color === 'accent' && 'bg-accent-100 dark:bg-accent-900/30'
                    )}
                  >
                    <feature.icon
                      className={cn(
                        'w-5 h-5',
                        feature.color === 'primary' && 'text-primary-600 dark:text-primary-400',
                        feature.color === 'secondary' && 'text-secondary-600 dark:text-secondary-400',
                        feature.color === 'accent' && 'text-accent-600 dark:text-accent-400'
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Scroll indicator */}
          <div className="flex justify-center gap-1 mt-2">
            {features.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-surface-300 dark:bg-surface-700" />
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 hover:border-surface-200 dark:hover:border-surface-700 transition-colors"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                  feature.color === 'primary' && 'bg-primary-100 dark:bg-primary-900/30',
                  feature.color === 'secondary' && 'bg-secondary-100 dark:bg-secondary-900/30',
                  feature.color === 'accent' && 'bg-accent-100 dark:bg-accent-900/30'
                )}
              >
                <feature.icon
                  className={cn(
                    'w-6 h-6',
                    feature.color === 'primary' && 'text-primary-600 dark:text-primary-400',
                    feature.color === 'secondary' && 'text-secondary-600 dark:text-secondary-400',
                    feature.color === 'accent' && 'text-accent-600 dark:text-accent-400'
                  )}
                />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-surface-600 dark:text-surface-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
