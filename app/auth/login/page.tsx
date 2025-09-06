"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && profile?.username) {
      router.replace(`/profile/${profile.username}`);
    }
  }, [loading, user, profile, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setError(null);

    try {
      const { data, error: authError } = await import("@/lib/supabase").then(({ supabase }) =>
        supabase.auth.signInWithPassword({ email, password })
      );

      if (authError) {
        setError(authError.message);
        setLoadingForm(false);
        return;
      }

      await refreshProfile();

      if (profile?.username) {
        router.replace(`/profile/${profile.username}`);
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">Log In</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              placeholder="Password"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loadingForm}
            className="w-full rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 py-2 text-white font-semibold hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-500 transition"
          >
            {loadingForm ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        <p className="mt-2 text-center text-sm">
          <Link href="/auth/forgot-password" className="text-cyan-600 hover:underline">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}
