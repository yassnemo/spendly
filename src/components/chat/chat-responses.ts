import { CATEGORIES } from '@/lib/constants';

interface FinancialContext {
  totalExpenses?: number;
  savingsRate?: number;
  topCategories?: Array<{ name: string; amount: number }>;
  budgetUtilization?: number;
}

// Simple local responses when Gemini is not available
export const getLocalResponse = (message: string, context: FinancialContext): string => {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|howdy|greetings)/)) {
    return "Hello! I'm your Spendly assistant. I can help you understand your spending, suggest ways to save, and answer questions about managing your finances. What would you like to know?";
  }
  
  // How am I doing / status questions
  if (lowerMessage.includes('how am i doing') || lowerMessage.includes('my status') || lowerMessage.includes('financial health')) {
    if (context.totalExpenses && context.totalExpenses > 0) {
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
      const catList = top.map((c) => `${c.name} ($${c.amount.toLocaleString()})`).join(', ');
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
