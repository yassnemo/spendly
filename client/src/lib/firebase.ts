import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug: Log the configuration values
console.log('Firebase Config Debug:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '[SET]' : '[MISSING]',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '[SET]' : '[MISSING]',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? '[SET]' : '[MISSING]',
  isDev: import.meta.env.DEV
});

// Validate configuration before initializing
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('Firebase configuration is incomplete. Please check your .env file contains:');
  console.error('- VITE_FIREBASE_API_KEY');
  console.error('- VITE_FIREBASE_PROJECT_ID');
  console.error('- VITE_FIREBASE_APP_ID');
  console.error('Current config:', firebaseConfig);
  throw new Error('Firebase configuration is missing required fields. Please check your .env file.');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider for better user experience
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
