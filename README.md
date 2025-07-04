# Spendly - Personal Finance Tracker

A modern personal finance tracker built with React, TypeScript, Express, and Firebase.

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Add your Firebase configuration to `.env`:
   ```
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
   VITE_FIREBASE_APP_ID=your-firebase-app-id
   DATABASE_URL=your-database-url
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at http://localhost:3000

## Deployment to Vercel

### Prerequisites
- Vercel account
- Firebase project set up
- Database (PostgreSQL) hosted (e.g., Neon, Supabase, or Vercel Postgres)

### Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Connect to Vercel**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the framework

3. **Set Environment Variables** in Vercel Dashboard:
   ```
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
   VITE_FIREBASE_APP_ID=your-firebase-app-id
   DATABASE_URL=your-production-database-url
   NODE_ENV=production
   ````

### Firebase Configuration for Production

1. If you deploy the app Firebase, then in Firebase Console, add your Vercel domain to authorized domains:
   - Go to Authentication > Settings > Authorized domains
   - Add `your-app-name.vercel.app`

2. Update Firebase Auth configuration if needed

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check
- `npm run db:push` - Push database schema
- `npm run vercel-build` - Build for Vercel deployment

## Environment Variables

Required environment variables:

- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `DATABASE_URL` - PostgreSQL database connection string
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
