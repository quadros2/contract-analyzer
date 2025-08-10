"use client";
import { useEffect, useState } from "react";
import { auth, signInWithGoogle, signOutUser } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="px-4 py-2 rounded bg-black text-white"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">Hi, {user.email}</span>
      <button
        onClick={signOutUser}
        className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
      >
        Sign out
      </button>
    </div>
  );
}
