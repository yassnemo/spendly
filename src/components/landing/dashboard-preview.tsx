'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Wallet,
  Receipt,
  PiggyBank,
  Coffee,
  ShoppingBag,
  Car,
} from 'lucide-react';
import {
  StatsCard,
  SpendingChart,
  CategoryChart,
  HealthScore,
  BudgetOverview,
  RecentTransactions,
} from './preview';

export function DashboardPreview() {
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const targetIncome = 4200;
    const targetExpenses = 2180;
    const targetSavings = 2020;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedIncome(targetIncome * eased);
      setAnimatedExpenses(targetExpenses * eased);
      setAnimatedSavings(targetSavings * eased);

      if (step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  const transactions = [
    { name: 'Morning Coffee', amount: -4.5, icon: Coffee, time: '2 min ago' },
    { name: 'Grocery Store', amount: -85.4, icon: ShoppingBag, time: '1 hour ago' },
    { name: 'Uber Ride', amount: -24.0, icon: Car, time: '3 hours ago' },
    { name: 'Salary Deposit', amount: 4200, icon: Wallet, time: 'Yesterday' },
  ];

  const budgets = [
    { category: 'Food & Dining', spent: 340, limit: 500, color: 'from-blue-500 to-blue-400' },
    { category: 'Shopping', spent: 280, limit: 300, color: 'from-blue-600 to-blue-500' },
    { category: 'Transport', spent: 120, limit: 200, color: 'from-blue-400 to-blue-300' },
  ];

  const spendingData = [
    { day: 'Mon', amount: 45 },
    { day: 'Tue', amount: 120 },
    { day: 'Wed', amount: 85 },
    { day: 'Thu', amount: 200 },
    { day: 'Fri', amount: 65 },
    { day: 'Sat', amount: 150 },
    { day: 'Sun', amount: 90 },
  ];
  const maxSpend = Math.max(...spendingData.map((d) => d.amount));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-xl lg:text-2xl font-bold text-surface-900 dark:text-white">
          Good morning, Alex
        </h2>
        <p className="text-sm text-surface-500 mt-1">Your financial overview for this month</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Income"
          value={`$${animatedIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          color="green"
          delay={0.3}
        />
        <StatsCard
          title="Expenses"
          value={`$${animatedExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          icon={Receipt}
          color="red"
          delay={0.35}
        />
        <StatsCard
          title="Savings"
          value={`$${animatedSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          icon={PiggyBank}
          color="primary"
          delay={0.4}
          badge="+48%"
        />
        <StatsCard title="Budget Used" value="52%" icon={Target} color="indigo" delay={0.45} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SpendingChart data={spendingData} maxSpend={maxSpend} />
        <CategoryChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <HealthScore />
        <BudgetOverview budgets={budgets} />
        <RecentTransactions transactions={transactions} />
      </div>
    </motion.div>
  );
}
