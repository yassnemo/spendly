'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  DollarSign,
  Target,
  Sparkles,
  Mail,
  Lock,
  Chrome,
  Github,
  Zap,
} from 'lucide-react';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Button, Input, Card } from '@/components/ui';
import { CURRENCIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

const steps: OnboardingStep[] = [
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

// Step indicator
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
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
const StepContent: React.FC<{
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
const FeatureCard: React.FC<{ icon: React.ReactNode; label: string; delay: number }> = ({ 
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

// Auth Step Component
const AuthStep: React.FC<{
  onSuccess: (name: string) => void;
  onSkip: () => void;
}> = ({ onSuccess, onSkip }) => {
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await auth.signInWithEmail(email, password);
        onSuccess(email.split('@')[0]);
      } else {
        if (!name) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        await auth.signUpWithEmail(email, password, name);
        onSuccess(name);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      await auth.signInWithGoogle();
      onSuccess('User');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      await auth.signInWithGithub();
      onSuccess('User');
    } catch (err: any) {
      setError(err.message || 'GitHub sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      await auth.signInAsDemo();
      onSuccess('Demo User');
    } catch (err: any) {
      setError(err.message || 'Demo sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Demo Button for quick start */}
      <Button
        variant="primary"
        className="w-full"
        onClick={handleDemoAuth}
        disabled={isLoading}
        leftIcon={<Zap className="w-5 h-5" />}
      >
        Quick Start (Demo)
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
        <span className="text-xs text-surface-400">or sign in</span>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          leftIcon={<Chrome className="w-5 h-5" />}
        >
          Continue with Google
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGithubAuth}
          disabled={isLoading}
          leftIcon={<Github className="w-5 h-5" />}
        >
          Continue with GitHub
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
        <span className="text-xs text-surface-400">or</span>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
      </div>

      {/* Email/Password Form */}
      <div className="space-y-3">
        {!isLogin && (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            leftElement={<User className="w-4 h-4 text-surface-400" />}
            disabled={isLoading}
          />
        )}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          leftElement={<Mail className="w-4 h-4 text-surface-400" />}
          disabled={isLoading}
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          leftElement={<Lock className="w-4 h-4 text-surface-400" />}
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className="text-sm text-danger-500 text-center">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handleEmailAuth}
        isLoading={isLoading}
      >
        {isLogin ? 'Sign In' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-surface-500">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary-500 font-medium hover:underline"
          disabled={isLoading}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>

      <button
        onClick={onSkip}
        className="w-full text-center text-sm text-surface-400 hover:text-surface-600 transition-colors"
        disabled={isLoading}
      >
        Skip for now
      </button>
    </div>
  );
};

// Main Onboarding Component
export const OnboardingFlow: React.FC = () => {
  const setProfile = useStore((state) => state.setProfile);
  const initializeDefaultBudgets = useStore((state) => state.initializeDefaultBudgets);
  const completeOnboarding = useStore((state) => state.completeOnboarding);
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, skip auth step
  useEffect(() => {
    if (user && currentStep === 2) {
      setName(user.displayName || '');
      setCurrentStep(3);
    }
  }, [user, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAuthSuccess = (userName: string) => {
    setName(userName);
    setCurrentStep(3);
  };

  const handleAuthSkip = () => {
    setCurrentStep(3);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await setProfile({
        name: name || 'User',
        email: user?.email || '',
        monthlyIncome: parseFloat(income) || 0,
        currency,
        onboardingCompleted: true,
      });

      if (income) {
        await initializeDefaultBudgets(parseFloat(income));
      }

      await completeOnboarding();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 3:
        return income.trim().length > 0 && parseFloat(income) > 0;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep - 1];

    switch (currentStep) {
      case 1:
        return (
          <StepContent step={step}>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <FeatureCard
                icon={<Wallet className="w-5 h-5 text-primary-500" />}
                label="Track Expenses"
                delay={0.2}
              />
              <FeatureCard
                icon={<Target className="w-5 h-5 text-primary-500" />}
                label="Smart Budgets"
                delay={0.3}
              />
              <FeatureCard
                icon={<Sparkles className="w-5 h-5 text-primary-500" />}
                label="AI Insights"
                delay={0.4}
              />
            </div>
          </StepContent>
        );

      case 2:
        return (
          <StepContent step={step}>
            <AuthStep onSuccess={handleAuthSuccess} onSkip={handleAuthSkip} />
          </StepContent>
        );

      case 3:
        return (
          <StepContent step={step}>
            <div className="w-full max-w-sm space-y-4">
              {!name && (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  leftElement={<User className="w-4 h-4 text-surface-400" />}
                />
              )}
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="0.00"
                leftElement={<DollarSign className="w-4 h-4 text-surface-400" />}
                autoFocus
              />
              <p className="text-xs text-surface-500 text-center">
                This is used to suggest budget allocations
              </p>
            </div>
          </StepContent>
        );

      case 4:
        return (
          <StepContent step={step}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setCurrency(curr.code)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all duration-200',
                    currency === curr.code
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 hover:border-primary-200 dark:hover:border-primary-800'
                  )}
                >
                  <span className="text-2xl block mb-1">{curr.symbol}</span>
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{curr.code}</span>
                </button>
              ))}
            </div>
          </StepContent>
        );

      case 5:
        return (
          <StepContent step={step}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mb-6"
            >
              <Check className="w-8 h-8 text-success-500" />
            </motion.div>
            <div className={cn(
              'rounded-xl p-5 max-w-sm w-full',
              'bg-surface-50 dark:bg-surface-800',
              'border border-surface-100 dark:border-surface-700'
            )}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-500">Name</span>
                  <span className="font-medium text-surface-900 dark:text-white">{name || 'User'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-500">Monthly Income</span>
                  <span className="font-medium text-surface-900 dark:text-white">
                    {CURRENCIES.find((c) => c.code === currency)?.symbol}
                    {parseFloat(income || '0').toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-500">Currency</span>
                  <span className="font-medium text-surface-900 dark:text-white">{currency}</span>
                </div>
                {user && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-500">Account</span>
                    <span className="font-medium text-success-500">Connected</span>
                  </div>
                )}
              </div>
            </div>
          </StepContent>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="p-8">
          <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          {/* Navigation */}
          {currentStep !== 2 && (
            <div className="flex items-center justify-between mt-8">
              {currentStep > 1 ? (
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  isLoading={isSubmitting}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Get Started
                </Button>
              )}
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-surface-400 mt-6">
          Your data stays on your device. We respect your privacy.
        </p>
      </div>
    </div>
  );
};
