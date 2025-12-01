import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini AI with API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// Safety settings for the model
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// System prompt for the budget assistant
const SYSTEM_PROMPT = `You are Spendly AI, a friendly and knowledgeable personal finance assistant. Your role is to help users manage their finances better within the Spendly app.

Key capabilities:
- Analyze spending patterns and provide insights
- Suggest budget optimizations
- Answer questions about personal finance
- Help users set and achieve savings goals
- Explain financial concepts in simple terms
- Provide tips for reducing expenses

Guidelines:
- Be concise and helpful
- Use clear, simple language
- Provide actionable advice
- Be encouraging and supportive
- Never give specific investment advice or guarantee returns
- Focus on budgeting, saving, and expense management
- When users share their financial data, provide personalized insights

App features you can help with:
- Expense tracking and categorization
- Monthly budget management
- Savings goals tracking
- AI-powered insights and tips
- Data export and import
- Theme customization

Always maintain a professional yet friendly tone. If asked about something outside personal finance or the app's capabilities, politely redirect to relevant topics.`;

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FinancialContext {
  totalIncome?: number;
  totalExpenses?: number;
  savings?: number;
  topCategories?: { name: string; amount: number }[];
  savingsRate?: number;
  budgetUtilization?: number;
  currency?: string;
}

// Build context message from financial data
function buildContextMessage(context: FinancialContext): string {
  if (!context || Object.keys(context).length === 0) return '';

  const parts: string[] = ['Current financial snapshot:'];

  if (context.currency) {
    parts.push(`Currency: ${context.currency}`);
  }
  if (context.totalIncome !== undefined) {
    parts.push(`Monthly income: ${context.totalIncome.toLocaleString()}`);
  }
  if (context.totalExpenses !== undefined) {
    parts.push(`Monthly expenses: ${context.totalExpenses.toLocaleString()}`);
  }
  if (context.savings !== undefined) {
    parts.push(`Current savings: ${context.savings.toLocaleString()}`);
  }
  if (context.savingsRate !== undefined) {
    parts.push(`Savings rate: ${context.savingsRate}%`);
  }
  if (context.budgetUtilization !== undefined) {
    parts.push(`Budget utilization: ${context.budgetUtilization}%`);
  }
  if (context.topCategories && context.topCategories.length > 0) {
    const catList = context.topCategories
      .slice(0, 3)
      .map((c) => `${c.name}: ${c.amount.toLocaleString()}`)
      .join(', ');
    parts.push(`Top spending categories: ${catList}`);
  }

  return parts.join('\n');
}

// Chat with the AI assistant
export async function chatWithAssistant(
  message: string,
  history: ChatMessage[] = [],
  financialContext?: FinancialContext
): Promise<string> {
  if (!genAI) {
    return "I'm currently unavailable. Please set up your Google AI API key in the settings to enable the AI assistant.";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
    });

    // Build conversation history
    const contextMessage = financialContext ? buildContextMessage(financialContext) : '';
    
    const conversationHistory = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Start chat with system prompt and context
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System instructions: ${SYSTEM_PROMPT}${contextMessage ? `\n\n${contextMessage}` : ''}` }],
        },
        {
          role: 'model',
          parts: [{ text: "I understand. I'm Spendly AI, ready to help you manage your finances effectively. How can I assist you today?" }],
        },
        ...conversationHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini AI error:', error);
    
    if (error.message?.includes('API_KEY')) {
      return 'Please configure your Google AI API key in the settings to use the AI assistant.';
    }
    
    if (error.message?.includes('quota')) {
      return "I've reached my usage limit for now. Please try again later.";
    }
    
    return "I'm having trouble responding right now. Please try again in a moment.";
  }
}

// Generate quick insights based on financial data
export async function generateQuickInsights(
  context: FinancialContext
): Promise<string[]> {
  if (!genAI) {
    return getLocalInsights(context);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
    });

    const contextMessage = buildContextMessage(context);
    
    const prompt = `Based on this financial data, provide exactly 3 brief, actionable insights. Each insight should be one sentence, practical, and specific. Format as a simple numbered list without bullet points or special characters.

${contextMessage}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response into individual insights
    const insights = response
      .split(/\n/)
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((line) => line.length > 10 && line.length < 200)
      .slice(0, 3);

    return insights.length > 0 ? insights : getLocalInsights(context);
  } catch (error) {
    console.error('Quick insights error:', error);
    return getLocalInsights(context);
  }
}

// Local fallback insights
function getLocalInsights(context: FinancialContext): string[] {
  const insights: string[] = [];

  if (context.savingsRate !== undefined) {
    if (context.savingsRate >= 20) {
      insights.push(`Your ${context.savingsRate}% savings rate is excellent - you are building wealth effectively.`);
    } else if (context.savingsRate >= 10) {
      insights.push(`Consider increasing your savings rate from ${context.savingsRate}% toward 20% for faster financial growth.`);
    } else if (context.savingsRate > 0) {
      insights.push(`Your savings rate of ${context.savingsRate}% has room for improvement - aim for at least 10%.`);
    } else {
      insights.push("You are spending more than you earn this month - review your expenses for potential cuts.");
    }
  }

  if (context.topCategories && context.topCategories.length > 0) {
    const topCategory = context.topCategories[0];
    insights.push(`${topCategory.name} is your biggest expense - look for ways to optimize spending here.`);
  }

  if (context.budgetUtilization !== undefined) {
    if (context.budgetUtilization > 90) {
      insights.push("You are near your budget limits - track remaining expenses carefully this month.");
    } else if (context.budgetUtilization < 50) {
      insights.push('Great budget discipline! Consider allocating excess funds to savings goals.');
    }
  }

  // Default insights if none generated
  if (insights.length === 0) {
    insights.push('Start tracking all expenses to get personalized financial insights.');
    insights.push('Set up monthly budgets by category to better control spending.');
    insights.push('Create savings goals to stay motivated on your financial journey.');
  }

  return insights.slice(0, 3);
}

// Categorize an expense description using AI
export async function categorizeExpenseAI(description: string): Promise<string> {
  if (!genAI) {
    return 'other';
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
    });

    const prompt = `Categorize this expense into exactly one of these categories: food, transport, shopping, utilities, entertainment, health, education, travel, subscriptions, other.

Expense: "${description}"

Reply with only the category name in lowercase, nothing else.`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim().toLowerCase();
    
    const validCategories = [
      'food', 'transport', 'shopping', 'utilities', 'entertainment',
      'health', 'education', 'travel', 'subscriptions', 'other'
    ];
    
    return validCategories.includes(category) ? category : 'other';
  } catch (error) {
    console.error('Expense categorization error:', error);
    return 'other';
  }
}

// Check if AI is available
export function isAIAvailable(): boolean {
  return !!genAI;
}
