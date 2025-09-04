"use client";

import Link from "next/link";

type ProfileActionsProps = {
  isOwner: boolean;
};

export default function ProfileActions({ isOwner }: ProfileActionsProps) {
  if (!isOwner) return null;

  return (
    <div className="mb-6 flex space-x-4">
      <Link
        href="/dashboard"
        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/posts/new"
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
      >
        New Post
      </Link>
    </div>
  );
}
