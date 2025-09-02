"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);  // Wrong credentials, no redirect
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) {
      alert(profileError.message);
      return;
    }

    if (!profile) {
      alert("User profile not found. Please sign up.");
      router.push("/signup");  // Only redirect if profile missing
      return;
    }

    if (profile.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/profile");
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 text-black"
          required
          autoComplete="email"
          aria-label="Email address"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 text-black"
          required
          autoComplete="current-password"
          aria-label="Password"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up here
        </Link>
      </div>
    </div>
  );
}
