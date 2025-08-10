"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";

interface AnalysisResponse {
  user: string;
  filename: string;
  chars: number;
  preview: string;
}

type ErrorResponse = { detail?: string };

export default function Uploader() {
  const [res, setRes] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
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

    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!r.ok) {
        const errBody: ErrorResponse = await r.json().catch(() => ({}));
        throw new Error(errBody.detail ?? "Upload failed");
      }

      const data: AnalysisResponse = await r.json();
      setRes(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
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
