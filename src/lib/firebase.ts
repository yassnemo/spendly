import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'google' | 'github' | 'email' | 'demo';
  emailVerified?: boolean;
}

function mapFirebaseUser(user: User): AuthUser {
  const providerId = user.providerData[0]?.providerId || 'email';
  let provider: AuthUser['provider'] = 'email';
  
  if (providerId.includes('google')) provider = 'google';
  else if (providerId.includes('github')) provider = 'github';
  
  return {
    id: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    provider,
    emailVerified: user.emailVerified,
  };
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return mapFirebaseUser(result.user);
}

export async function signInWithGithub(): Promise<AuthUser> {
  const result = await signInWithPopup(auth, githubProvider);
  return mapFirebaseUser(result.user);
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(result.user);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  
  // Send verification email
  await sendEmailVerification(result.user);
  
  return mapFirebaseUser(result.user);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Send email verification
export async function sendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    await sendEmailVerification(user);
  }
}

// Delete user account
export async function deleteAccount(): Promise<void> {
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  }
}

export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
}

export function getCurrentUser(): AuthUser | null {
  const user = auth.currentUser;
  return user ? mapFirebaseUser(user) : null;
}

// Demo sign in for development
export async function signInAsDemo(): Promise<AuthUser> {
  // Use a test account or create one
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      'demo@spendly.app',
      'demo123456'
    );
    return mapFirebaseUser(result.user);
  } catch {
    // If demo account doesn't exist, create it
    const result = await createUserWithEmailAndPassword(
      auth,
      'demo@spendly.app',
      'demo123456'
    );
    await updateProfile(result.user, { displayName: 'Demo User' });
    return mapFirebaseUser(result.user);
  }
}

export { auth };
