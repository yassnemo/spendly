# Spendly

A personal finance tracking app built with Next.js. Track expenses, set budgets, and get AI-powered insights.

## Features

- Expense tracking with categories
- Monthly budgets
- Savings goals
- AI chat assistant (Google Gemini)
- Firebase authentication
- Neon PostgreSQL database
- Dark mode
- Mobile responsive

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

### Gemini AI
Get a free key at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Firebase
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and add Google/GitHub providers
3. Copy config from Project Settings > Your apps

### Neon Database
1. Create a database at [Neon](https://neon.tech)
2. Copy the connection string
3. Run the schema: `psql $DATABASE_URL -f schema.sql`

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase Auth
- Neon PostgreSQL
- Zustand
- Framer Motion
- Recharts
- Google Gemini AI

## License

MIT
