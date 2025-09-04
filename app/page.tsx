'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Chyrp Blog 🚀</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Share your thoughts, read posts, and connect with others.
      </p>
      {user ? (
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start Writing
        </Link>
      ) : (
        <Link
          href="/auth/login"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          Log In
        </Link>
      )}
    </div>
  );
}
