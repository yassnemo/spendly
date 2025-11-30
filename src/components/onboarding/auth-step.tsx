'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Chrome,
  Github,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { Button, Input } from '@/components/ui';

// Auth Step Component
export const AuthStep: React.FC<{
  onSuccess: (name: string) => void;
  onSkip: () => void;
}> = ({ onSuccess, onSkip }) => {
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
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

  const handleDemoAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      await auth.signInAsDemo();
      onSuccess('Demo User');
    } catch (err: any) {
      setError(err.message || 'Demo sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Demo Button for quick start */}
      <Button
        variant="primary"
        className="w-full"
        onClick={handleDemoAuth}
        disabled={isLoading}
        leftIcon={<Zap className="w-5 h-5" />}
      >
        Quick Start (Demo)
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
        <span className="text-xs text-surface-400">or sign in</span>
        <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
      </div>

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
        {!isLogin && (
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

      {error && (
        <p className="text-sm text-danger-500 text-center">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handleEmailAuth}
        isLoading={isLoading}
      >
        {isLogin ? 'Sign In' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-surface-500">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary-500 font-medium hover:underline"
          disabled={isLoading}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>

      <button
        onClick={onSkip}
        className="w-full text-center text-sm text-surface-400 hover:text-surface-600 transition-colors"
        disabled={isLoading}
      >
        Skip for now
      </button>
    </div>
  );
};
