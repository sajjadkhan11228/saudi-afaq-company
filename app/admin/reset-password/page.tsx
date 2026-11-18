
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (error) {
        setError(error.message);
      }

      setHasSession(Boolean(data.session));
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setHasSession(Boolean(session));
      setChecking(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleResetPassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();

    setMessage("Password updated successfully! Redirecting to login...");

    setTimeout(() => {
      router.replace("/admin");
    }, 2000);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101D30] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#C9A45C]/30 bg-white p-8 shadow-2xl">
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-semibold tracking-[3px] text-[#B18B45]">
            SAUDI AFAQ COMPANY
          </p>

          <h1 className="text-3xl font-bold text-[#101D30]">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new password for your admin account.
          </p>
        </div>

        {checking ? (
          <p className="py-6 text-center text-gray-600">
            Verifying recovery link...
          </p>
        ) : !hasSession ? (
          <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-700">
            Your recovery link is invalid or has expired.
            <p className="mt-2">
              Please request a new password recovery email.
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="mt-4 font-semibold text-[#A47B32] underline"
            >
              Back to Admin Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#C9A45C] focus:ring-2 focus:ring-[#C9A45C]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#C9A45C] focus:ring-2 focus:ring-[#C9A45C]/20"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#B18B45] px-4 py-3 font-semibold text-white transition hover:bg-[#967236] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating Password..." : "Save New Password"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          © 2026 SAUDI AFAQ COMPANY. All rights reserved.
        </p>
      </div>
    </main>
  );
}
