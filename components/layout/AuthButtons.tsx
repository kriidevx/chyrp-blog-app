'use client';
import Link from 'next/link';

export default function AuthButtons() {
  return (
    <div className="flex gap-4">
      <Link
        href="/auth/login"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
      >
        Signup
      </Link>
    </div>
  );
}
