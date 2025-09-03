'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, profile, signOut, loading } = useAuth();

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-blue-400">Chyrp Blog</Link>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/about" className="hover:text-blue-400">About</Link>
          <Link href="/contact" className="hover:text-blue-400">Contact</Link>
          <Link href="/posts" className="hover:text-blue-400">Feed</Link>
        </div>
        <div className="flex space-x-4 items-center">
          {loading ? null : !user ? (
            <>
              <Link href="/auth/login" className="bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 text-sm font-medium">Login</Link>
              <Link href="/auth/signup" className="bg-green-600 px-3 py-1 rounded-md hover:bg-green-700 text-sm font-medium">Sign Up</Link>
            </>
          ) : (
            <>
              <Link href={`/profile/${profile?.username || 'me'}`} className="hover:text-blue-400">Profile</Link>
              <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
              <button onClick={signOut} className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 text-sm font-medium">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
