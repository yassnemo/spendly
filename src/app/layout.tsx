import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Spendly - Smart Budget Tracking',
  description: 'Take control of your money. Track spending, set budgets, and reach your financial goals with AI-powered insights.',
  keywords: ['budget', 'finance', 'expense tracker', 'money management', 'AI insights'],
  authors: [{ name: 'Spendly' }],
  openGraph: {
    title: 'Spendly - Smart Budget Tracking',
    description: 'Take control of your money. Track spending, set budgets, and reach your financial goals with AI-powered insights.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
