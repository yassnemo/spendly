'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Sparkles,
  Shield,
  Zap,
  ChevronRight,
  Wallet,
  Receipt,
  PiggyBank,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0c0b] overflow-hidden">
      <Navbar onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <HowItWorks />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

function Navbar({ onGetStarted }: { onGetStarted: () => void }) {
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

function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Background Ripple Effect - top portion only with fade */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-auto">
        <BackgroundRippleEffect />
        {/* Fade out gradient - pointer-events-none so clicks pass through */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fafaf9] dark:to-[#0c0c0b] pointer-events-none" />
        {/* Radial fade for softer edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_0%,#fafaf9_100%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_0%,#0c0c0b_100%)] pointer-events-none" />
      </div>

      {/* Background gradient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary-200/20 dark:bg-secondary-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-100 dark:border-primary-900/50 mb-8"
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-surface-900 dark:text-white tracking-tight leading-[1.1]"
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
            className="mt-6 text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-xl mx-auto leading-relaxed"
          >
            Track spending, set budgets, and reach your financial goals with intelligent insights that adapt to your lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
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
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-surface-700 dark:text-surface-300 rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 md:mt-24 relative"
        >
          <div className="relative mx-auto max-w-4xl">
            {/* Browser frame */}
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-soft-xl border border-surface-200/80 dark:border-surface-800/80 bg-white dark:bg-surface-900">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-surface-300 dark:bg-surface-700" />
                  <div className="w-3 h-3 rounded-full bg-surface-300 dark:bg-surface-700" />
                  <div className="w-3 h-3 rounded-full bg-surface-300 dark:bg-surface-700" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-md mx-auto h-7 rounded-lg bg-surface-100 dark:bg-surface-800" />
                </div>
              </div>

              {/* App preview content */}
              <div className="p-4 md:p-8 bg-gradient-to-b from-surface-50 to-white dark:from-surface-950 dark:to-surface-900">
                <DashboardPreview />
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="hidden lg:block absolute -left-12 top-1/3 p-4 rounded-2xl bg-white dark:bg-surface-800 shadow-soft-lg border border-surface-100 dark:border-surface-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-surface-500">This month</div>
                  <div className="font-semibold text-surface-900 dark:text-white">+12% saved</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="hidden lg:block absolute -right-8 top-1/2 p-4 rounded-2xl bg-white dark:bg-surface-800 shadow-soft-lg border border-surface-100 dark:border-surface-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="text-xs text-surface-500">Vacation fund</div>
                  <div className="font-semibold text-surface-900 dark:text-white">78% complete</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const targetBalance = 12450.80;
    const targetIncome = 4200;
    const targetExpenses = 2180;
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedBalance(targetBalance * eased);
      setAnimatedIncome(targetIncome * eased);
      setAnimatedExpenses(targetExpenses * eased);
      
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, []);

  const transactions = [
    { name: 'Morning Coffee', amount: -4.50, category: 'Food', icon: Coffee, time: '2 min ago' },
    { name: 'Grocery Store', amount: -85.40, category: 'Shopping', icon: ShoppingBag, time: '1 hour ago' },
    { name: 'Uber Ride', amount: -24.00, category: 'Transport', icon: Car, time: '3 hours ago' },
    { name: 'Salary Deposit', amount: 4200, category: 'Income', icon: Wallet, time: 'Yesterday' },
    { name: 'Rent Payment', amount: -1200, category: 'Housing', icon: Home, time: 'Nov 1' },
  ];

  const budgets = [
    { category: 'Food & Dining', spent: 340, limit: 500, color: 'bg-orange-500' },
    { category: 'Shopping', spent: 280, limit: 300, color: 'bg-purple-500' },
    { category: 'Transport', spent: 120, limit: 200, color: 'bg-blue-500' },
    { category: 'Entertainment', spent: 45, limit: 150, color: 'bg-pink-500' },
  ];

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-4">
      {/* Main Balance Card */}
      <div className="col-span-12 md:col-span-8 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 dark:from-surface-800 dark:via-surface-900 dark:to-surface-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-500/10 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-surface-400 text-xs font-medium uppercase tracking-wider">Total Balance</span>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            ${animatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          
          <div className="mt-4 md:mt-6 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                <span className="text-surface-400 text-xs">Income</span>
              </div>
              <div className="text-lg font-semibold text-green-400">
                +${animatedIncome.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                <span className="text-surface-400 text-xs">Expenses</span>
              </div>
              <div className="text-lg font-semibold text-red-400">
                -${animatedExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
          <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2">
            <PieChart className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-surface-500 text-xs mb-0.5">Budget Used</div>
          <div className="text-xl font-bold text-surface-900 dark:text-white">67%</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
          <div className="w-9 h-9 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-2">
            <Target className="w-4.5 h-4.5 text-secondary-600 dark:text-secondary-400" />
          </div>
          <div className="text-surface-500 text-xs mb-0.5">Goals</div>
          <div className="text-xl font-bold text-surface-900 dark:text-white">3 Active</div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="col-span-12 md:col-span-6 p-4 md:p-5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-surface-900 dark:text-white">Budget Overview</span>
          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">View All</span>
        </div>
        <div className="space-y-3">
          {budgets.map((budget, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-surface-600 dark:text-surface-400">{budget.category}</span>
                <span className="text-xs text-surface-500">${budget.spent} / ${budget.limit}</span>
              </div>
              <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(budget.spent / budget.limit) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                  className={cn("h-full rounded-full", budget.color)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="col-span-12 md:col-span-6 p-4 md:p-5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-surface-900 dark:text-white">Recent Transactions</span>
          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">View All</span>
        </div>
        <div className="space-y-2">
          {transactions.slice(0, 4).map((tx, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                tx.amount > 0 
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400"
              )}>
                <tx.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-surface-900 dark:text-white truncate">{tx.name}</div>
                <div className="text-xs text-surface-500">{tx.time}</div>
              </div>
              <div className={cn(
                "text-sm font-semibold",
                tx.amount > 0 ? "text-green-600 dark:text-green-400" : "text-surface-900 dark:text-white"
              )}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
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

  return (
    <section id="features" className="py-20 md:py-32 bg-white dark:bg-surface-950">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 hover:border-surface-200 dark:hover:border-surface-700 transition-colors"
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                feature.color === 'primary' && "bg-primary-100 dark:bg-primary-900/30",
                feature.color === 'secondary' && "bg-secondary-100 dark:bg-secondary-900/30",
                feature.color === 'accent' && "bg-accent-100 dark:bg-accent-900/30",
              )}>
                <feature.icon className={cn(
                  "w-6 h-6",
                  feature.color === 'primary' && "text-primary-600 dark:text-primary-400",
                  feature.color === 'secondary' && "text-secondary-600 dark:text-secondary-400",
                  feature.color === 'accent' && "text-accent-600 dark:text-accent-400",
                )} />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create your account',
      description: 'Sign up in seconds with your email or social accounts. No credit card required.',
    },
    {
      number: '02',
      title: 'Set your budget',
      description: 'Define spending limits for different categories based on your income and goals.',
    },
    {
      number: '03',
      title: 'Track and save',
      description: 'Log expenses, monitor your progress, and watch your savings grow over time.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-surface-50 dark:bg-surface-900">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight"
          >
            Get started in minutes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-surface-600 dark:text-surface-400"
          >
            Three simple steps to financial freedom.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-surface-300 dark:from-surface-700 to-transparent" />
              )}
              <div className="text-5xl font-bold text-surface-200 dark:text-surface-800 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-surface-950">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-surface-900 to-surface-800 dark:from-surface-800 dark:to-surface-900 p-8 md:p-16 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }} />
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/20 rounded-full blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            >
              Start your journey to financial freedom
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-surface-300"
            >
              Free to use. No credit card required. Set up in under 2 minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={onGetStarted}
                className="group w-full sm:w-auto px-8 py-4 text-base font-medium text-surface-900 bg-white rounded-2xl hover:bg-surface-100 transition-colors shadow-soft-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  Get started free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How it works', href: '#how-it-works' },
      { name: 'Pricing', href: '#' },
      { name: 'FAQ', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-surface-900 dark:bg-surface-950 border-t border-surface-800">
      <div className="mx-auto max-w-6xl px-6">
        {/* Main footer content */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/images/logo.svg" 
                alt="Spendly" 
                className="w-9 h-9 rounded-xl"
              />
              <span className="font-semibold text-white text-lg tracking-tight">
                Spendly
              </span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs mb-6">
              Take control of your finances with intelligent tracking, budgeting, and AI-powered insights.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/yassnemo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-sm text-surface-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-surface-500">
            {currentYear} Spendly. All rights reserved.
          </div>
          <div className="text-sm text-surface-500">
            Built by{' '}
            <a 
              href="https://yerradouani.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              Yassine Erradouani
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
