'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  User,
  DollarSign,
  Target,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

export const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to SmartBudget',
    description: 'Your personal finance companion. Track expenses, set budgets, and get AI-powered insights.',
    icon: Wallet,
  },
  {
    id: 2,
    title: 'Create your account',
    description: 'Sign in to sync your data across devices.',
    icon: User,
  },
  {
    id: 3,
    title: 'Set your monthly income',
    description: 'This helps us create a smart budget for you.',
    icon: DollarSign,
  },
  {
    id: 4,
    title: 'Choose your currency',
    description: 'Select the currency you want to use.',
    icon: Target,
  },
  {
    id: 5,
    title: 'You are all set',
    description: 'Start tracking your expenses and reach your financial goals.',
    icon: Sparkles,
  },
];

// Step indicator component
export const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <motion.div
        key={index}
        className={cn(
          'h-1.5 rounded-full transition-all duration-300',
          index + 1 === currentStep
            ? 'w-8 bg-primary-500'
            : index + 1 < currentStep
            ? 'w-2 bg-primary-500'
            : 'w-2 bg-surface-200 dark:bg-surface-700'
        )}
        initial={false}
        animate={{
          width: index + 1 === currentStep ? 32 : 8,
        }}
      />
    ))}
  </div>
);

// Step content wrapper
export const StepContent: React.FC<{
  step: OnboardingStep;
  children?: React.ReactNode;
}> = ({ step, children }) => {
  const Icon = step.icon;

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="w-20 h-20 rounded-2xl bg-primary-500 flex items-center justify-center mb-6 shadow-soft-lg"
      >
        <Icon className="w-10 h-10 text-white" />
      </motion.div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
        {step.title}
      </h1>
      <p className="text-surface-500 max-w-md mb-8">{step.description}</p>
      {children}
    </motion.div>
  );
};

// Feature card for welcome screen
export const FeatureCard: React.FC<{ icon: React.ReactNode; label: string; delay: number }> = ({ 
  icon, 
  label, 
  delay 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={cn(
      'p-4 rounded-xl transition-all duration-200',
      'bg-surface-50 dark:bg-surface-800',
      'border border-surface-100 dark:border-surface-700',
      'hover:border-primary-200 dark:hover:border-primary-800',
      'hover:shadow-soft-md'
    )}
  >
    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2">
      {icon}
    </div>
    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
      {label}
    </span>
  </motion.div>
);
