"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase/client";

type Mode = "signin" | "reset";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const sb = getBrowserSupabase();
    if (!sb) {
      setError("Supabase is not configured in this environment.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "reset") {
        const { error } = await sb.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin`,
        });
        if (error) throw error;
        setNotice(
          "If that email belongs to a staff account, a reset link is on its way.",
        );
        setMode("signin");
        return;
      }

      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;

      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setError(
        /invalid login credentials/i.test(message)
          ? "That email and password combination is not recognised."
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
      <div>
        <label className="field-label" htmlFor="login-email">
          Work email
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gorealtors.in"
          className="field"
        />
      </div>

      {mode === "signin" && (
        <div>
          <div className="flex items-baseline justify-between">
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <button
              type="button"
              onClick={() => setMode("reset")}
              className="mb-1.5 text-[0.75rem] font-semibold text-brand-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="field pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            >
              {show ? (
                <EyeOff className="h-4 w-4" strokeWidth={2.2} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={2.2} />
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-[0.8125rem] text-red-700">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-sm border border-brand-200 bg-brand-50 px-3 py-2 text-[0.8125rem] text-brand-800">
          {notice}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-dark w-full btn-lg">
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
            {mode === "reset" ? "Sending…" : "Signing in…"}
          </>
        ) : mode === "reset" ? (
          "Send reset link"
        ) : (
          "Sign in"
        )}
      </button>

      {mode === "reset" && (
        <button
          type="button"
          onClick={() => setMode("signin")}
          className="w-full text-[0.8125rem] font-semibold text-ink-500 hover:text-ink-900"
        >
          Back to sign in
        </button>
      )}

      <p className="text-[0.75rem] leading-relaxed text-ink-400">
        Accounts are created by an administrator from{" "}
        <span className="font-semibold">Team &amp; Access</span>. If you need
        access, ask your administrator to invite you.
      </p>
    </form>
  );
}
