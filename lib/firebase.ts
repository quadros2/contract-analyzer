import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCi8rubinr8uRFEyl-4bw6pI1lwsZNwJ8Q",
  authDomain: "contract-analyzer-afce0.firebaseapp.com",
  projectId: "contract-analyzer-afce0",
  storageBucket: "contract-analyzer-afce0.firebasestorage.app",
  messagingSenderId: "739403388195",
  appId: "1:739403388195:web:b153944db9787368ea2896",
  measurementId: "G-L2PRGC95H4"
};

// Initialize Firebase app
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);

// Create provider
const googleProvider = new GoogleAuthProvider();

// Helper functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
