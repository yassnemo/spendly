'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { chatWithAssistant, isAIAvailable, ChatMessage as GeminiChatMessage } from '@/lib/gemini';
import { Button } from '@/components/ui';
import { CATEGORIES } from '@/lib/constants';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({
  isOpen,
  onClose,
  isFullScreen = false,
  onToggleFullScreen,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Spendly AI assistant. I can help you understand your spending patterns, suggest ways to save money, and answer questions about managing your finances. How can I help you today?",
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
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const getFinancialContext = () => {
    if (!monthlyStats) return undefined;

    const topCategories = Object.entries(monthlyStats.byCategory)
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
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
    setInput('');
    setIsLoading(true);

    try {
      const history: GeminiChatMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }));

      const response = await chatWithAssistant(
        userMessage.content,
        history,
        getFinancialContext()
      );

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
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    'How can I save more money?',
    'Analyze my spending',
    'Budget tips for this month',
    'How am I doing financially?',
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col bg-white dark:bg-surface-900',
        'border border-surface-200 dark:border-surface-800',
        'shadow-soft-xl rounded-2xl overflow-hidden',
        isFullScreen
          ? 'fixed inset-4 z-50'
          : 'fixed bottom-20 right-4 w-[400px] h-[600px] z-50 lg:bottom-4'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Spendly AI</h3>
            <p className="text-xs text-white/70">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onToggleFullScreen && (
            <button
              onClick={onToggleFullScreen}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullScreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
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
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'user'
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'bg-secondary-100 dark:bg-secondary-900/30'
                )}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                ) : (
                  <Bot className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                )}
              </div>
              <div
                className={cn(
                  'max-w-[80%] px-4 py-3 rounded-2xl text-sm',
                  message.role === 'user'
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-bl-md'
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
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="bg-surface-100 dark:bg-surface-800 px-4 py-3 rounded-2xl rounded-bl-md">
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
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-surface-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
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
      <div className="p-4 border-t border-surface-200 dark:border-surface-800">
        {!isAIAvailable() && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
            Add your Gemini API key in settings to enable AI chat
          </p>
        )}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your finances..."
            disabled={isLoading}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-xl text-sm',
              'bg-surface-50 dark:bg-surface-800',
              'border border-surface-200 dark:border-surface-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              'placeholder:text-surface-400 dark:placeholder:text-surface-500',
              'disabled:opacity-50'
            )}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="md"
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
