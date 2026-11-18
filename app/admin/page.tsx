
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "../../lib/supabase/client";

const ADMIN_ID = "2f836c05-a359-4467-a4be-36706e272ce8";
const year = 2026;

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError || !data.user) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      if (data.user.id !== ADMIN_ID) {
        await supabase.auth.signOut();
        setError("You are not authorized to access this admin panel.");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your admin email first.");
      return;
    }

    setResetLoading(true);

    try {
      const supabase = createClient();

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(
        "Password recovery email sent! Please check your Gmail inbox."
      );
    } catch {
      setError("Unable to send recovery email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101D30] px-5 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C9A45C]/50 bg-[#C9A45C]/10 text-[#D5B36A]">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-3xl font-bold tracking-wide text-white">
            SAUDI <span className="text-[#D5B36A]">AFAQ</span>
          </h1>

          <p className="mt-2 text-xs font-semibold tracking-[0.3em] text-[#C9A45C]">
            ADMIN CONTROL PANEL
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-7 shadow-2xl sm:p-9">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#101D30]">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage your company website.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#101D30]">
                Admin Email
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#C9A45C]">
                <Mail size={19} className="text-[#B18A43]" />

                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-13 w-full bg-transparent text-sm text-[#101D30] outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#101D30]">
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-xs font-semibold text-[#A47B32] hover:text-[#101D30] disabled:opacity-50"
                >
                  {resetLoading ? "Sending..." : "Forgot Password?"}
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#C9A45C]">
                <LockKeyhole size={19} className="text-[#B18A43]" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-13 w-full bg-transparent text-sm text-[#101D30] outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-[#101D30]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
              >
                <CheckCircle2 size={18} className="shrink-0" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#101D30] px-5 font-bold text-white transition hover:bg-[#C9A45C] hover:text-[#101D30] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Secure Login
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-gray-100 pt-5 text-center">
            <p className="text-xs text-gray-400">
              <LockKeyhole size={13} className="mr-1 inline" />
              Authorized Administrator Access Only
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-gray-400">
          © {year} SAUDI AFAQ COMPANY. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
