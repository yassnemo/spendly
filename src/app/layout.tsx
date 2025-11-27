import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Smart Budget - Your Personal Finance Companion',
  description: 'Track expenses, create budgets, and get AI-powered insights to improve your financial health.',
  keywords: ['budget', 'finance', 'expense tracker', 'money management', 'AI insights'],
  authors: [{ name: 'Smart Budget Team' }],
  openGraph: {
    title: 'Smart Budget - Your Personal Finance Companion',
    description: 'Track expenses, create budgets, and get AI-powered insights to improve your financial health.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
