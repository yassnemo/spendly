'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const oobCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');

  useEffect(() => {
    async function verifyEmail() {
      if (!oobCode || mode !== 'verifyEmail') {
        setError('Invalid or expired verification link. Please request a new one.');
        setIsVerifying(false);
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setSuccess(true);
        setIsVerifying(false);
      } catch (err: any) {
        console.error('Error verifying email:', err);
        if (err.code === 'auth/expired-action-code') {
          setError('This verification link has expired. Please request a new one from your settings.');
        } else if (err.code === 'auth/invalid-action-code') {
          setError('This verification link is invalid or has already been used.');
        } else {
          setError('Unable to verify email. Please try again.');
        }
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [oobCode, mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-accent-50/30 to-secondary-50/30 dark:from-surface-950 dark:via-accent-950/20 dark:to-secondary-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-secondary-500 mb-4 shadow-lg shadow-accent-500/25">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Email Verification
          </h1>
          <p className="text-surface-500 mt-2">
            {isVerifying
              ? 'Verifying your email address...'
              : success
              ? 'Your email has been verified!'
              : 'Unable to verify email'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl shadow-surface-900/5 dark:shadow-none border border-surface-200 dark:border-surface-800 p-6">
          {isVerifying ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-surface-600 dark:text-surface-400">
                Verifying your email...
              </p>
            </div>
          ) : success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                Email Verified!
              </h2>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Your email address has been successfully verified. You now have full access to all features.
              </p>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                Verification Failed
              </h2>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                {error}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/settings')}
                  className="w-full"
                >
                  Go to Settings
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-surface-500 mt-6">
          Need help?{' '}
          <button
            onClick={() => router.push('/settings')}
            className="text-accent-600 dark:text-accent-400 hover:underline font-medium"
          >
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-accent-50/30 to-secondary-50/30 dark:from-surface-950 dark:via-accent-950/20 dark:to-secondary-950/20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
