// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// --- Firebase Web Config (PUBLIC) pulled from env vars ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MSG_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Initialize app once
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);

// App Check (reCAPTCHA v3)
// Put your Site Key into NEXT_PUBLIC_APP_CHECK_KEY in .env.local and Vercel
let __appCheckInitialized = false;
if (typeof window !== "undefined" && !__appCheckInitialized) {
  const siteKey = process.env.NEXT_PUBLIC_APP_CHECK_KEY;
  if (!siteKey) {
    // Not fatal, but App Check tokens won't be issued; backend may reject requests if enforced.
    // Add NEXT_PUBLIC_APP_CHECK_KEY to your envs and redeploy.
    console.warn("App Check site key missing: set NEXT_PUBLIC_APP_CHECK_KEY.");
  } else {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
    __appCheckInitialized = true;
  }
}
