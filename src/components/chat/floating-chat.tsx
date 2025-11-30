'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, MessageCircle, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { CATEGORIES } from '@/lib/constants';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Simple local responses when Gemini is not available
const getLocalResponse = (message: string, context: any): string => {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|howdy|greetings)/)) {
    return "Hello! I'm your Spendly assistant. I can help you understand your spending, suggest ways to save, and answer questions about managing your finances. What would you like to know?";
  }
  
  // How am I doing / status questions
  if (lowerMessage.includes('how am i doing') || lowerMessage.includes('my status') || lowerMessage.includes('financial health')) {
    if (context.totalExpenses > 0) {
      const savingsRate = context.savingsRate || 0;
      let status = '';
      if (savingsRate >= 20) {
        status = `Great job! You're saving ${savingsRate}% of your income, which is excellent.`;
      } else if (savingsRate >= 10) {
        status = `You're doing okay with a ${savingsRate}% savings rate. Try to push it to 20% for better financial health.`;
      } else if (savingsRate > 0) {
        status = `Your savings rate is ${savingsRate}%. Consider cutting some expenses to save more.`;
      } else {
        status = "You're spending more than you're earning this month. Let's look at where you can cut back.";
      }
      return status;
    }
    return "I don't have enough data yet to assess your financial health. Start tracking your income and expenses to get personalized insights!";
  }
  
  // Spending / expenses
  if (lowerMessage.includes('spending') || lowerMessage.includes('expense') || lowerMessage.includes('where') && lowerMessage.includes('money')) {
    if (context.topCategories && context.topCategories.length > 0) {
      const top = context.topCategories.slice(0, 3);
      const catList = top.map((c: any) => `${c.name} ($${c.amount.toLocaleString()})`).join(', ');
      return `Your top spending categories are: ${catList}. Focus on these areas if you want to reduce expenses.`;
    }
    return "Add some expenses to see where your money is going! I'll help you analyze your spending patterns.";
  }
  
  // Save money tips
  if (lowerMessage.includes('save') || lowerMessage.includes('saving') || lowerMessage.includes('cut') || lowerMessage.includes('reduce')) {
    const tips = [
      "Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
      "Review your subscriptions - cancel any you haven't used in the past month.",
      "Meal prep on weekends to reduce food delivery and restaurant spending.",
      "Wait 24 hours before any non-essential purchase over $50.",
      "Set up automatic transfers to savings right after payday.",
      "Use cashback apps and browser extensions for everyday purchases.",
    ];
    const randomTips = tips.sort(() => Math.random() - 0.5).slice(0, 2);
    return `Here are some tips to save more:\n\n• ${randomTips.join('\n• ')}\n\nWould you like more specific advice based on your spending patterns?`;
  }
  
  // Budget
  if (lowerMessage.includes('budget')) {
    if (context.budgetUtilization !== undefined) {
      if (context.budgetUtilization > 90) {
        return `You've used ${context.budgetUtilization}% of your budgets this month. Be careful with remaining spending!`;
      } else if (context.budgetUtilization > 70) {
        return `You've used ${context.budgetUtilization}% of your budgets. You're on track but keep monitoring.`;
      } else {
        return `You've only used ${context.budgetUtilization}% of your budgets. Great discipline! Consider putting the extra into savings.`;
      }
    }
    return "Set up budgets for your spending categories to get better control of your finances. Go to the Budget page to create them!";
  }
  
  // Goals
  if (lowerMessage.includes('goal')) {
    return "Setting financial goals is a great way to stay motivated! You can create savings goals in the Goals section. Would you like tips on achieving your goals faster?";
  }
  
  // Categories
  if (lowerMessage.includes('categor')) {
    const categories = CATEGORIES.map(c => c.name).join(', ');
    return `Spendly supports these expense categories: ${categories}. When you add an expense, it gets categorized to help you understand your spending patterns.`;
  }
  
  // Help
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('features')) {
    return "I can help you with:\n\n• Analyzing your spending patterns\n• Suggesting ways to save money\n• Tracking your budget progress\n• Understanding your financial health\n• Tips for reaching your savings goals\n\nJust ask me anything about your finances!";
  }
  
  // Thank you
  if (lowerMessage.includes('thank')) {
    return "You're welcome! Let me know if you have any other questions about your finances. I'm here to help! 💰";
  }
  
  // Default response
  return "I can help you with budgeting, tracking expenses, and saving money. Try asking me:\n\n• \"How am I doing financially?\"\n• \"Where is my money going?\"\n• \"How can I save more?\"\n• \"What's my budget status?\"";
};

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your Spendly assistant. How can I help you with your finances today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const monthlyStats = useStore((state) => state.monthlyStats);
  const profile = useStore((state) => state.profile);
  const budgets = useStore((state) => state.budgets);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getFinancialContext = () => {
    if (!monthlyStats) return {};

    const topCategories = Object.entries(monthlyStats.byCategory || {})
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, amount]) => ({
        name: CATEGORIES.find((c) => c.id === id)?.name || id,
        amount,
      }));

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    return {
      totalIncome: monthlyStats.totalIncome,
      totalExpenses: monthlyStats.totalExpenses,
      savings: monthlyStats.savings,
      savingsRate: monthlyStats.totalIncome > 0
        ? Math.round((monthlyStats.savings / monthlyStats.totalIncome) * 100)
        : 0,
      budgetUtilization: totalBudget > 0
        ? Math.round((totalSpent / totalBudget) * 100)
        : 0,
      topCategories,
      currency: profile?.currency || 'USD',
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Simulate a brief delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    try {
      const context = getFinancialContext();
      
      // Try Gemini first, fall back to local responses
      let response: string;
      
      try {
        const { chatWithAssistant, isAIAvailable } = await import('@/lib/gemini');
        
        if (isAIAvailable()) {
          const history = messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          }));
          
          response = await chatWithAssistant(userInput, history, context);
          
          // Check if it's an error response from Gemini
          if (response.includes("I'm currently unavailable") || 
              response.includes("having trouble responding") ||
              response.includes("API key")) {
            response = getLocalResponse(userInput, context);
          }
        } else {
          response = getLocalResponse(userInput, context);
        }
      } catch (error) {
        console.warn('Gemini unavailable, using local responses');
        response = getLocalResponse(userInput, context);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const context = getFinancialContext();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getLocalResponse(input, context),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'How am I doing?',
    'Where is my money going?',
    'How can I save more?',
  ];

  return (
    <>
      {/* Chat Button - positioned above mobile nav */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              'fixed z-50',
              'w-12 h-12 sm:w-14 sm:h-14 rounded-full',
              'bg-gradient-to-br from-primary-500 to-primary-600',
              'text-white shadow-lg',
              'flex items-center justify-center',
              'hover:shadow-xl hover:shadow-primary-500/25 transition-shadow',
              // Mobile: above bottom nav (nav height ~60px + safe area)
              'bottom-20 right-4',
              // Desktop: normal position
              'lg:bottom-6 lg:right-6'
            )}
            aria-label="Open chat assistant"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed z-50',
              // Mobile: full width with padding, above bottom nav
              'bottom-20 left-3 right-3',
              'h-[60vh] max-h-[500px]',
              // Desktop: fixed size
              'lg:bottom-6 lg:right-6 lg:left-auto',
              'lg:w-[360px] lg:h-[500px]',
              'flex flex-col',
              'bg-white dark:bg-surface-900',
              'border border-surface-200 dark:border-surface-700',
              'shadow-2xl rounded-2xl overflow-hidden'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Spendly Assistant</h3>
                  <p className="text-xs text-white/70">Here to help with your finances</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'flex gap-2.5',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                        message.role === 'user'
                          ? 'bg-primary-100 dark:bg-primary-900/30'
                          : 'bg-surface-100 dark:bg-surface-800'
                      )}
                    >
                      {message.role === 'user' ? (
                        <User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-surface-600 dark:text-surface-400" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm',
                        message.role === 'user'
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-bl-sm'
                      )}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-surface-600 dark:text-surface-400" />
                  </div>
                  <div className="bg-surface-100 dark:bg-surface-800 px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-surface-400" />
                      <span className="text-sm text-surface-400">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="px-3 py-1.5 text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-surface-200 dark:border-surface-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className={cn(
                    'flex-1 px-3.5 py-2.5 rounded-xl text-sm',
                    'bg-surface-50 dark:bg-surface-800',
                    'border border-surface-200 dark:border-surface-700',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
                    'placeholder:text-surface-400 dark:placeholder:text-surface-500',
                    'disabled:opacity-50'
                  )}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    'px-3.5 py-2.5 rounded-xl',
                    'bg-primary-500 text-white',
                    'hover:bg-primary-600 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-center justify-center'
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
