"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AuthButtons() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/login"
        className="px-4 py-2 rounded-md border border-cyan-500 text-cyan-600 font-semibold hover:bg-cyan-50 transition"
      >
        Log In
      </Link>
      <Link
        href="/auth/signup"
        className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-cyan-500 hover:to-blue-600 transition"
      >
        Get Started
      </Link>
    </div>
  );
}
