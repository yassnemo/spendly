'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Wallet,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  DollarSign,
  Target,
  Sparkles,
  X,
} from 'lucide-react';
import { useStore } from '@/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Button, Input, Card } from '@/components/ui';
import { CURRENCIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { steps, StepIndicator, StepContent, FeatureCard } from './onboarding-steps';
import { AuthStep } from './auth-step';

interface OnboardingFlowProps {
  onBack?: () => void;
}

// Main Onboarding Component
export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onBack }) => {
  const setProfile = useStore((state) => state.setProfile);
  const initializeDefaultBudgets = useStore((state) => state.initializeDefaultBudgets);
  const completeOnboarding = useStore((state) => state.completeOnboarding);
  const profile = useStore((state) => state.profile);
  const isOnboarded = useStore((state) => state.isOnboarded);
  const isLoading = useStore((state) => state.isLoading);
  const { user, isLoading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle user authentication and returning user detection
  useEffect(() => {
    // Wait for both auth and store to finish loading
    if (authLoading || isLoading) return;
    
    if (user) {
      // Set name from user profile
      setName(user.displayName || '');
      
      // Check if returning user with completed onboarding
      if (isOnboarded || (profile?.onboardingCompleted && profile?.monthlyIncome > 0)) {
        // Returning user - complete onboarding immediately
        completeOnboarding();
        return;
      }
      
      // User is authenticated but needs to complete onboarding
      // Skip to income step (step 3) unless already past the auth step
      if (currentStep <= 2) {
        // Pre-fill from existing profile if available
        if (profile?.monthlyIncome) {
          setIncome(profile.monthlyIncome.toString());
        }
        if (profile?.currency) {
          setCurrency(profile.currency);
        }
        setCurrentStep(3);
      }
    }
  }, [user, authLoading, isLoading, profile, isOnboarded, currentStep, completeOnboarding]);

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
            <AuthStep onSuccess={handleAuthSuccess} />
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

  // Show loading while auth or store is loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 animate-pulse" />
          <p className="text-surface-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="p-8 relative">
          {/* Back to landing page button */}
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 right-4 p-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Back to home"
            >
              <X className="w-5 h-5" />
            </button>
          )}
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
