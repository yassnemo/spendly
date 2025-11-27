'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  RefreshCw,
  Send,
  Bot,
  Zap,
  Target,
  PieChart,
  ArrowRight,
  X,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '@/store';
import { Card, Button, Badge, Skeleton, EmptyState } from '@/components/ui';
import { cn, formatCurrency, calculateSavingsRate } from '@/lib/utils';
import { generateLocalInsights, generateWeeklyTips, detectAnomalies } from '@/lib/ai';
import { chatWithAssistant, generateQuickInsights, FinancialContext, ChatMessage } from '@/lib/gemini';
import { CATEGORIES } from '@/lib/constants';
import { AIInsight } from '@/types';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Insight Card Component
interface InsightCardProps {
  insight: AIInsight;
  onDismiss: () => void;
  index: number;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, onDismiss, index }) => {
  const typeConfig = {
    tip: {
      icon: Lightbulb,
      color: 'text-accent-500',
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      border: 'border-accent-200 dark:border-accent-800/50',
      iconBg: 'bg-accent-100 dark:bg-accent-900/40',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-warning-500',
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800/50',
      iconBg: 'bg-warning-100 dark:bg-warning-900/40',
    },
    achievement: {
      icon: CheckCircle,
      color: 'text-success-500',
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800/50',
      iconBg: 'bg-success-100 dark:bg-success-900/40',
    },
    pattern: {
      icon: TrendingUp,
      color: 'text-secondary-500',
      bg: 'bg-secondary-50 dark:bg-secondary-900/20',
      border: 'border-secondary-200 dark:border-secondary-800/50',
      iconBg: 'bg-secondary-100 dark:bg-secondary-900/40',
    },
  };

  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay: index * 0.05 }}
      className={cn(
        'group p-5 rounded-2xl border transition-all duration-300',
        config.bg,
        config.border,
        insight.isRead ? 'opacity-60' : 'hover:shadow-soft-md',
        'hover:scale-[1.01]'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
            'transition-transform duration-300 group-hover:scale-110',
            config.iconBg
          )}
        >
          <Icon className={cn('w-5 h-5', config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-surface-900 dark:text-white leading-relaxed">
            {insight.description}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Badge
              size="sm"
              variant={
                insight.priority === 'high'
                  ? 'danger'
                  : insight.priority === 'medium'
                  ? 'warning'
                  : 'default'
              }
            >
              {insight.priority} priority
            </Badge>
            {insight.category && (
              <Badge size="sm" variant="secondary">
                {insight.category}
              </Badge>
            )}
          </div>
        </div>

        {!insight.isRead && (
          <button
            onClick={onDismiss}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300',
              'hover:bg-surface-100 dark:hover:bg-surface-800',
              'opacity-0 group-hover:opacity-100'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Weekly Tips Section
const WeeklyTips: React.FC = () => {
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTips = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTips(generateWeeklyTips());
      setIsLoading(false);
      setIsRefreshing(false);
    }, 400);
  }, []);

  useEffect(() => {
    loadTips();
  }, [loadTips]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 mb-5">
          <Skeleton className="w-11 h-11 rounded-xl" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-secondary-500 flex items-center justify-center shadow-soft-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 dark:text-white">
              Weekly Tips
            </h3>
            <p className="text-xs text-surface-500">Personalized advice</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={loadTips}
          className="!p-2"
        >
          <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
        </Button>
      </div>

      <motion.div 
        className="space-y-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {tips.map((tip, index) => (
          <motion.div
            key={`${tip}-${index}`}
            variants={fadeInUp}
            className={cn(
              'p-4 rounded-xl transition-all duration-300',
              'bg-surface-50 dark:bg-surface-800/50',
              'border border-surface-100 dark:border-surface-700/50',
              'hover:border-secondary-200 dark:hover:border-secondary-800/50',
              'hover:bg-secondary-50/50 dark:hover:bg-secondary-900/20'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
                  {index + 1}
                </span>
              </div>
              <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                {tip}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};

// Spending Analysis Section
const SpendingAnalysis: React.FC = () => {
  const monthlyStats = useStore((state) => state.monthlyStats);
  const profile = useStore((state) => state.profile);

  if (!monthlyStats) return null;

  const savingsRate = calculateSavingsRate(monthlyStats.totalIncome, monthlyStats.totalExpenses);

  const topCategories = Object.entries(monthlyStats.byCategory)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const maxAmount = topCategories.length > 0 ? topCategories[0][1] : 1;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft-sm">
          <PieChart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white">
            Spending Analysis
          </h3>
          <p className="text-xs text-surface-500">This month overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          className={cn(
            'p-4 rounded-xl transition-all duration-300',
            'bg-surface-50 dark:bg-surface-800/50',
            'border border-surface-100 dark:border-surface-700/50'
          )}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-xs font-medium text-surface-500 mb-2">Savings Rate</p>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-2xl font-bold tracking-tight',
                savingsRate >= 20 ? 'text-success-500' : 
                savingsRate >= 10 ? 'text-accent-500' : 'text-danger-500'
              )}
            >
              {savingsRate}%
            </span>
            <div className={cn(
              'p-1.5 rounded-lg',
              savingsRate >= 20 ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'
            )}>
              {savingsRate >= 20 ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger-500" />
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className={cn(
            'p-4 rounded-xl transition-all duration-300',
            'bg-surface-50 dark:bg-surface-800/50',
            'border border-surface-100 dark:border-surface-700/50'
          )}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-xs font-medium text-surface-500 mb-2">Monthly Savings</p>
          <span
            className={cn(
              'text-2xl font-bold tracking-tight',
              monthlyStats.savings >= 0 ? 'text-success-500' : 'text-danger-500'
            )}
          >
            {formatCurrency(Math.abs(monthlyStats.savings), profile?.currency)}
          </span>
        </motion.div>
      </div>

      {topCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-4">
            Top Categories
          </h4>
          <div className="space-y-3">
            {topCategories.map(([categoryId, amount], index) => {
              const category = CATEGORIES.find((c) => c.id === categoryId);
              const percentage = Math.round((amount / monthlyStats.totalExpenses) * 100);
              const barWidth = (amount / maxAmount) * 100;

              return (
                <motion.div
                  key={categoryId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-surface-400 w-4">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-surface-900 dark:text-white">
                        {category?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">
                        {formatCurrency(amount, profile?.currency)}
                      </span>
                      <Badge size="sm" variant="secondary">
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

// AI Chat Interface with Gemini
const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const expenses = useStore((state) => state.expenses);
  const budgets = useStore((state) => state.budgets);
  const goals = useStore((state) => state.goals);
  const profile = useStore((state) => state.profile);
  const monthlyStats = useStore((state) => state.monthlyStats);

  // Generate quick suggestions based on expense data
  const getQuickSuggestions = () => {
    const suggestions = [
      "How am I doing with my budget this month?",
      "What are my biggest spending categories?",
      "How can I save more money?",
      "Give me tips for reducing expenses",
    ];
    return suggestions;
  };

  useEffect(() => {
    setSuggestions(getQuickSuggestions());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build financial context for the AI
      const context: FinancialContext = {
        totalExpenses: monthlyStats?.totalExpenses || 0,
        totalIncome: monthlyStats?.totalIncome || 0,
        savingsRate: monthlyStats ? calculateSavingsRate(monthlyStats.totalIncome, monthlyStats.totalExpenses) : 0,
        topCategories: monthlyStats?.byCategory 
          ? Object.entries(monthlyStats.byCategory)
              .map(([name, amount]) => ({ name, amount }))
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
          : [],
        budgetUtilization: budgets.length > 0 
          ? budgets.reduce((sum, b) => sum + (monthlyStats?.byCategory?.[b.category] || 0) / b.limit * 100, 0) / budgets.length
          : 0,
        currency: profile?.currency || 'USD',
      };

      const response = await chatWithAssistant(messageText, messages, context);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please check your API key in settings or try again later.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-[480px]">
      <div className="flex items-center gap-3 pb-4 border-b border-surface-100 dark:border-surface-700/50">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-soft-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success-500 rounded-full border-2 border-white dark:border-surface-900" />
        </div>
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white">
            AI Assistant
          </h3>
          <p className="text-xs text-surface-500">Powered by Gemini</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
              Ask me anything about your finances, budgets, or spending habits.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(suggestion)}
                  className={cn(
                    'px-3 py-1.5 text-xs rounded-full transition-all duration-200',
                    'bg-surface-100 dark:bg-surface-800',
                    'text-surface-600 dark:text-surface-400',
                    'hover:bg-primary-100 hover:text-primary-600',
                    'dark:hover:bg-primary-900/30 dark:hover:text-primary-400',
                    'border border-surface-200 dark:border-surface-700'
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-md'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white rounded-bl-md'
                  )}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-surface-100 dark:bg-surface-800">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    <span className="text-sm text-surface-500">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="pt-4 border-t border-surface-100 dark:border-surface-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your finances..."
            disabled={isLoading}
            className={cn(
              'flex-1 px-4 py-3 rounded-xl text-sm',
              'bg-surface-50 dark:bg-surface-800',
              'border border-surface-200 dark:border-surface-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'placeholder:text-surface-400',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200'
            )}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="!px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Main Insights Page
export const InsightsPage: React.FC = () => {
  const insights = useStore((state) => state.insights);
  const refreshInsights = useStore((state) => state.refreshInsights);
  const dismissInsight = useStore((state) => state.dismissInsight);
  const expenses = useStore((state) => state.expenses);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [anomalies, setAnomalies] = useState<string[]>([]);

  useEffect(() => {
    refreshInsights();
    setAnomalies(detectAnomalies(expenses));
  }, [refreshInsights, expenses]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshInsights();
    setAnomalies(detectAnomalies(expenses));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const unreadInsights = insights.filter((i) => !i.isRead);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            AI Insights
          </h1>
          <p className="text-surface-500 mt-1">
            Smart recommendations powered by AI
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleRefresh}
          leftIcon={
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          }
        >
          Refresh
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Insights Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Insights List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                Your Insights
              </h2>
              {unreadInsights.length > 0 && (
                <Badge variant="primary">{unreadInsights.length} new</Badge>
              )}
            </div>

            {insights.length === 0 ? (
              <Card className="py-12">
                <EmptyState
                  icon={<Sparkles className="w-12 h-12" />}
                  title="No insights yet"
                  description="Add some expenses to get personalized AI-powered insights about your spending habits."
                  action={
                    <Button onClick={() => window.location.href = '/expenses'}>
                      Add Expense
                    </Button>
                  }
                />
              </Card>
            ) : (
              <motion.div 
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence mode="popLayout">
                  {insights.map((insight, index) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onDismiss={() => dismissInsight(insight.id)}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Anomalies */}
          <AnimatePresence>
            {anomalies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-danger-200 dark:border-danger-800/50 bg-danger-50/50 dark:bg-danger-900/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-danger-100 dark:bg-danger-900/40 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-danger-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">
                        Spending Alerts
                      </h3>
                      <p className="text-xs text-surface-500">Unusual patterns detected</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {anomalies.map((anomaly, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          'p-4 rounded-xl text-sm',
                          'bg-white dark:bg-surface-800/50',
                          'border border-danger-200 dark:border-danger-800/50',
                          'text-danger-700 dark:text-danger-300'
                        )}
                      >
                        {anomaly}
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spending Analysis */}
          <SpendingAnalysis />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WeeklyTips />
          <AIChat />
        </div>
      </div>
    </div>
  );
};
