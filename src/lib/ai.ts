// AI Integration using HuggingFace Free Inference API
// This module provides expense categorization and financial insights

import { CategoryType, Expense, MonthlyStats } from '@/types';
import { CATEGORIES } from './constants';
import { formatCurrency, calculateSavingsRate } from './utils';

// HuggingFace Inference API endpoint
const HF_API_URL = 'https://api-inference.huggingface.co/models';

// Free models that work without authentication for basic inference
const MODELS = {
  // For text classification/categorization
  classification: 'facebook/bart-large-mnli',
  // For text generation (insights)
  generation: 'google/flan-t5-small',
};

// Category keywords for fallback classification
const CATEGORY_KEYWORDS: Record<CategoryType, string[]> = {
  food: ['food', 'restaurant', 'grocery', 'meal', 'coffee', 'lunch', 'dinner', 'breakfast', 'snack', 'drink', 'pizza', 'burger', 'sushi', 'cafe', 'bakery'],
  transport: ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus', 'train', 'flight', 'car', 'toll', 'transit'],
  shopping: ['amazon', 'store', 'shop', 'clothes', 'shoes', 'electronics', 'mall', 'retail', 'purchase', 'buy', 'gift'],
  utilities: ['electric', 'water', 'gas', 'internet', 'phone', 'bill', 'utility', 'rent', 'mortgage', 'insurance'],
  entertainment: ['movie', 'netflix', 'spotify', 'game', 'concert', 'show', 'theater', 'music', 'streaming', 'fun'],
  health: ['doctor', 'medicine', 'pharmacy', 'gym', 'fitness', 'health', 'medical', 'hospital', 'dental', 'vitamin'],
  education: ['book', 'course', 'school', 'tuition', 'class', 'learning', 'udemy', 'coursera', 'training', 'workshop'],
  travel: ['hotel', 'airbnb', 'vacation', 'trip', 'travel', 'booking', 'resort', 'cruise', 'tour'],
  subscriptions: ['subscription', 'membership', 'monthly', 'annual', 'premium', 'pro', 'plan'],
  other: [],
};

// Fallback categorization using keywords
export function categorizeExpenseLocal(description: string): CategoryType {
  const lowerDesc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category as CategoryType;
    }
  }
  
  return 'other';
}

// AI-powered categorization using HuggingFace
export async function categorizeExpenseAI(description: string): Promise<CategoryType> {
  try {
    const categoryLabels = CATEGORIES.map((c) => c.name);
    
    const response = await fetch(`${HF_API_URL}/${MODELS.classification}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: description,
        parameters: {
          candidate_labels: categoryLabels,
        },
      }),
    });

    if (!response.ok) {
      // Fallback to local categorization
      return categorizeExpenseLocal(description);
    }

    const result = await response.json();
    const topLabel = result.labels?.[0];
    
    if (topLabel) {
      const category = CATEGORIES.find((c) => c.name === topLabel);
      return category?.id || 'other';
    }
    
    return categorizeExpenseLocal(description);
  } catch (error) {
    console.warn('AI categorization failed, using local fallback:', error);
    return categorizeExpenseLocal(description);
  }
}

// Generate insights based on spending patterns
export function generateLocalInsights(
  stats: MonthlyStats,
  expenses: Expense[],
  currency: string = 'USD'
): string[] {
  const insights: string[] = [];
  const { totalIncome, totalExpenses, byCategory } = stats;
  
  // Calculate savings rate
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);
  
  // Savings insight
  if (savingsRate >= 20) {
    insights.push(`Excellent! You are saving ${savingsRate}% of your income this month.`);
  } else if (savingsRate >= 10) {
    insights.push(`Good job! You are saving ${savingsRate}% of your income. Aim for 20% to build wealth faster.`);
  } else if (savingsRate > 0) {
    insights.push(`You are only saving ${savingsRate}% of your income. Consider cutting back on non-essentials.`);
  } else {
    insights.push(`You are spending more than you earn. Review your expenses urgently.`);
  }

  // Find top spending category
  const sortedCategories = Object.entries(byCategory)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length > 0) {
    const [topCategory, topAmount] = sortedCategories[0];
    const categoryInfo = CATEGORIES.find((c) => c.id === topCategory);
    const percentage = Math.round((topAmount / totalExpenses) * 100);
    
    if (percentage > 40) {
      insights.push(
        `${categoryInfo?.name || topCategory} makes up ${percentage}% of your spending (${formatCurrency(topAmount, currency)}). Consider setting a stricter budget.`
      );
    } else {
      insights.push(
        `Your biggest expense category is ${categoryInfo?.name || topCategory} at ${formatCurrency(topAmount, currency)} (${percentage}% of total).`
      );
    }
  }

  // Detect unusual spending patterns
  const avgExpenseAmount = totalExpenses / Math.max(expenses.length, 1);
  const unusualExpenses = expenses.filter((e) => e.amount > avgExpenseAmount * 3);
  
  if (unusualExpenses.length > 0) {
    const total = unusualExpenses.reduce((sum, e) => sum + e.amount, 0);
    insights.push(
      `You had ${unusualExpenses.length} unusually large expense${unusualExpenses.length > 1 ? 's' : ''} totaling ${formatCurrency(total, currency)}. Review these for potential savings.`
    );
  }

  // Budget tip based on spending pattern
  if (byCategory.entertainment && byCategory.entertainment > byCategory.food) {
    insights.push(
      `Your entertainment spending exceeds food expenses. Consider reallocating some funds.`
    );
  }

  // Subscription reminder
  if (byCategory.subscriptions && byCategory.subscriptions > 0) {
    insights.push(
      `You are spending ${formatCurrency(byCategory.subscriptions, currency)} on subscriptions. Review them quarterly to cancel unused ones.`
    );
  }

  return insights;
}

// Generate weekly tips
export function generateWeeklyTips(): string[] {
  const tips = [
    "Set up automatic transfers to savings right after payday.",
    "Try the 24-hour rule: wait a day before non-essential purchases over $50.",
    "Review your subscriptions monthly - the average person wastes $200/year on unused ones.",
    "Cooking at home 3 more times per week can save you $300+ monthly.",
    "That daily $5 coffee adds up to $1,825/year. Consider brewing at home sometimes.",
    "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
    "Track every expense for a week to find hidden spending leaks.",
    "Always check for coupons or cashback before making online purchases.",
    "Review your utility bills for savings opportunities like off-peak usage.",
    "Set up a fun fund with a fixed monthly amount for guilt-free enjoyment.",
  ];
  
  // Return 3 random tips
  const shuffled = tips.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// Calculate financial health score
export function calculateFinancialHealth(
  income: number,
  expenses: number,
  savingsGoalProgress: number,
  budgetAdherence: number
): { score: number; status: 'excellent' | 'good' | 'fair' | 'poor' } {
  let score = 0;
  
  // Savings rate (40 points max)
  const savingsRate = calculateSavingsRate(income, expenses);
  if (savingsRate >= 20) score += 40;
  else if (savingsRate >= 10) score += 30;
  else if (savingsRate >= 5) score += 20;
  else if (savingsRate > 0) score += 10;
  
  // Budget adherence (30 points max)
  score += Math.min(30, budgetAdherence * 0.3);
  
  // Savings goal progress (30 points max)
  score += Math.min(30, savingsGoalProgress * 0.3);
  
  // Determine status
  let status: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 80) status = 'excellent';
  else if (score >= 60) status = 'good';
  else if (score >= 40) status = 'fair';
  else status = 'poor';
  
  return { score: Math.round(score), status };
}

// Detect anomalies in spending
export function detectAnomalies(expenses: Expense[]): string[] {
  const anomalies: string[] = [];
  
  if (expenses.length < 5) return anomalies;
  
  // Calculate average and standard deviation
  const amounts = expenses.map((e) => e.amount);
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);
  
  // Find outliers (more than 2 standard deviations from mean)
  expenses.forEach((expense) => {
    if (expense.amount > avg + 2 * stdDev) {
      anomalies.push(
        `Unusual expense detected: "${expense.description}" (${expense.amount.toFixed(2)}) is significantly higher than your average.`
      );
    }
  });
  
  // Detect sudden increase in category spending
  const categoryTotals: Record<string, number[]> = {};
  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = [];
    }
    categoryTotals[expense.category].push(expense.amount);
  });
  
  return anomalies.slice(0, 3); // Return max 3 anomalies
}

// AI-powered insight generation using HuggingFace
export async function generateAIInsights(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${HF_API_URL}/${MODELS.generation}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 150,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('AI generation failed');
    }

    const result = await response.json();
    return result[0]?.generated_text || '';
  } catch (error) {
    console.warn('AI insight generation failed:', error);
    return '';
  }
}
