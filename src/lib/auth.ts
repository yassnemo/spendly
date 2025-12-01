'use client';

// Simple local auth system
// Note: This is a development-only mock auth system
// For production, integrate with Firebase or another auth provider

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'google' | 'github' | 'email' | 'demo';
}

const AUTH_STORAGE_KEY = 'smart_budget_auth';

// Get current user from localStorage
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading auth state:', error);
  }
  return null;
}

// Set current user in localStorage
function setCurrentUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(new Event('auth-change'));
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
}

// Generate a unique ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Mock sign in with Google
export async function signInWithGoogle(): Promise<AuthUser> {
  // Simulate OAuth flow with a demo user
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user: AuthUser = {
    id: generateId(),
    email: 'demo@gmail.com',
    displayName: 'Demo User',
    photoURL: null,
    provider: 'google',
  };
  
  setCurrentUser(user);
  return user;
}

// Mock sign in with GitHub
export async function signInWithGithub(): Promise<AuthUser> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user: AuthUser = {
    id: generateId(),
    email: 'demo@github.com',
    displayName: 'GitHub User',
    photoURL: null,
    provider: 'github',
  };
  
  setCurrentUser(user);
  return user;
}

// Sign in with email/password
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Basic validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // In a real app, you would validate credentials against a backend
  const user: AuthUser = {
    id: generateId(),
    email,
    displayName: email.split('@')[0],
    photoURL: null,
    provider: 'email',
  };
  
  setCurrentUser(user);
  return user;
}

// Sign up with email/password
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Basic validation
  if (!email || !password || !displayName) {
    throw new Error('All fields are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
  
  const user: AuthUser = {
    id: generateId(),
    email,
    displayName,
    photoURL: null,
    provider: 'email',
  };
  
  setCurrentUser(user);
  return user;
}

// Sign out
export async function signOut(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  setCurrentUser(null);
}

// Reset password (mock - just shows success)
export async function resetPassword(email: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
  
  // In a real app, this would send a password reset email
  console.log('Password reset email sent to:', email);
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  // Initial call with current state
  callback(getCurrentUser());
  
  // Listen for changes
  const handleChange = () => {
    callback(getCurrentUser());
  };
  
  window.addEventListener('auth-change', handleChange);
  window.addEventListener('storage', handleChange);
  
  return () => {
    window.removeEventListener('auth-change', handleChange);
    window.removeEventListener('storage', handleChange);
  };
}

// Demo sign in (skip auth for development)
export async function signInAsDemo(): Promise<AuthUser> {
  const user: AuthUser = {
    id: 'demo_user',
    email: 'demo@spendly.app',
    displayName: 'Demo User',
    photoURL: null,
    provider: 'demo',
  };
  
  setCurrentUser(user);
  return user;
}
