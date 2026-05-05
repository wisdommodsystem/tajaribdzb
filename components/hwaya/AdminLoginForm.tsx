"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export function AdminLoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid credentials format");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword(
      parsed.data
    );
    setLoading(false);

    if (signInError) {
      setError("Login failed. Verify credentials and try again.");
      return;
    }

    router.push("/hwaya/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111524] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
    >
      <h1 className="text-2xl font-semibold text-white">Hwaya Admin Login</h1>
      <p className="mt-2 text-sm text-slate-400">
        Secure access with Supabase authentication.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#0f1320] px-3 py-2 text-slate-100 outline-none ring-[#5865F2] transition focus:ring-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm text-slate-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#0f1320] px-3 py-2 text-slate-100 outline-none ring-[#5865F2] transition focus:ring-2"
            required
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4a56ca] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
