"use client";

import Image from "next/image";

type User = {
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
};

type ProfileInfoProps = {
  user: User;
};

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={user.username}
          width={80}
          height={80}
          className="rounded-full"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xl font-bold">
          {user.username[0].toUpperCase()}
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          @{user.username}
        </h1>
        {user.bio && <p className="text-gray-600 dark:text-gray-300">{user.bio}</p>}
      </div>
    </div>
  );
}
