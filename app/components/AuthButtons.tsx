"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    // If we came back from a redirect, resolve it silently
    getRedirectResult(auth).catch(() => {});
    return () => unsub();
  }, []);

  async function handleSignIn() {
    setErr(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      const code = e?.code as string | undefined;
      // Common cases
      if (code === "auth/popup-blocked") {
        // Fallback to redirect flow
        await signInWithRedirect(auth, provider);
        return;
      }
      if (code === "auth/unauthorized-domain") {
        setErr("This domain is not authorized in Firebase Authentication settings.");
        return;
      }
      setErr(e?.message ?? "Sign-in failed.");
    }
  }

  if (!user) {
    return (
      <div className="space-y-2">
        <button onClick={handleSignIn} className="px-4 py-2 bg-black text-white rounded">
          Sign in with Google
        </button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">Hi, {user.email}</span>
      <button
        onClick={() => auth.signOut()}
        className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Sign out
      </button>
    </div>
  );
}
