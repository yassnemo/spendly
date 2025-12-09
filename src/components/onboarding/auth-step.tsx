'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Chrome,
  Github,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { Button, Input } from '@/components/ui';

// Auth Step Component
export const AuthStep: React.FC<{
  onSuccess: (name: string) => void;
}> = ({ onSuccess }) => {
  const auth = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailAuth = async () => {
    if (!email || (mode !== 'forgot' && !password)) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (mode === 'forgot') {
        await auth.resetPassword(email);
        setSuccessMessage('Password reset email sent! Check your inbox.');
        return;
      }
      
      if (mode === 'login') {
        await auth.signInWithEmail(email, password);
        onSuccess(email.split('@')[0]);
      } else {
        if (!name) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        await auth.signUpWithEmail(email, password, name);
        onSuccess(name);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      await auth.signInWithGoogle();
      onSuccess('User');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      await auth.signInWithGithub();
      onSuccess('User');
    } catch (err: any) {
      setError(err.message || 'GitHub sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };



  // Forgot Password Mode
  if (mode === 'forgot') {
    return (
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
          className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </button>

        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Reset Password</h3>
          <p className="text-sm text-surface-500 mt-1">Enter your email to receive a reset link</p>
        </div>

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          leftElement={<Mail className="w-4 h-4 text-surface-400" />}
          disabled={isLoading}
        />

        {error && (
          <p className="text-sm text-danger-500 text-center">{error}</p>
        )}

        {successMessage && (
          <p className="text-sm text-green-500 text-center">{successMessage}</p>
        )}

        <Button
          className="w-full"
          onClick={handleEmailAuth}
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          leftIcon={<Chrome className="w-5 h-5" />}
        >
          Continue with Google
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGithubAuth}
          disabled={isLoading}
          leftIcon={<Github className="w-5 h-5" />}
        >
          Continue with GitHub
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
        <span className="text-xs text-surface-400">or</span>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
      </div>

      {/* Email/Password Form */}
      <div className="space-y-3">
        {mode === 'signup' && (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            leftElement={<User className="w-4 h-4 text-surface-400" />}
            disabled={isLoading}
          />
        )}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          leftElement={<Mail className="w-4 h-4 text-surface-400" />}
          disabled={isLoading}
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          leftElement={<Lock className="w-4 h-4 text-surface-400" />}
          disabled={isLoading}
        />
      </div>

      {mode === 'login' && (
        <button
          onClick={() => { setMode('forgot'); setError(''); }}
          className="text-sm text-primary-500 hover:underline"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      )}

      {error && (
        <p className="text-sm text-danger-500 text-center">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handleEmailAuth}
        isLoading={isLoading}
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-surface-500">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="text-primary-500 font-medium hover:underline"
          disabled={isLoading}
        >
          {mode === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
};
