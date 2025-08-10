"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function Uploader() {
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setError(null);
      const f = e.target.files?.[0];
      if (!f) return;
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        setError("Please sign in first.");
        return;
      }
      const fd = new FormData();
      fd.append("file", f);
      setLoading(true);
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j?.detail || "Upload failed");
      } else {
        setRes(j);
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 border rounded p-4">
      <input type="file" accept=".pdf,.docx" onChange={onFile} />
      {loading && <p>Analyzing…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {res && (
        <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-2 rounded">
          {JSON.stringify(res, null, 2)}
        </pre>
      )}
    </div>
  );
}
