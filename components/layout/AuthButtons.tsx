'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AuthButtons() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/login"
        className="text-gray-600 hover:text-gray-900 transition"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        Sign Up
      </Link>
    </div>
  );
}
