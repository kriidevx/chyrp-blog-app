"use client";

import { useAuth } from "@/app/providers/AuthProvider";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      <div className="space-y-2">
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">User ID:</span> {user.id}
        </p>
      </div>

      <button
        onClick={signOut}
        className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
      >
        Sign Out
      </button>
    </div>
  );
}
