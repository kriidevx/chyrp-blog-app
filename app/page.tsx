'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (profile?.username) {
        router.replace(`/profile/${profile.username}`);
      } else {
        router.replace('/profile/edit');
      }
    }
  }, [loading, user, profile, router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to Chyrp Blog 🚀</h1>
        <p className="text-gray-600 mb-6">
          Share your thoughts, read posts, and connect with others.
        </p>
        <div className="space-x-4">
          <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Log in</Link>
          <Link href="/auth/signup" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">Sign up</Link>
        </div>
      </div>
    );
  }

  return null;
}
