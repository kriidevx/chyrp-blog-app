'use client';

import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
          {user?.email?.[0].toUpperCase()}
        </div>
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg p-1">
        <Menu.Item>
          {({ active }) => (
            <Link
              href="/dashboard"
              className={`${
                active ? 'bg-gray-100' : ''
              } block px-4 py-2 text-sm text-gray-700 rounded-md`}
            >
              Dashboard
            </Link>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <Link
              href="/profile/edit"
              className={`${
                active ? 'bg-gray-100' : ''
              } block px-4 py-2 text-sm text-gray-700 rounded-md`}
            >
              Profile Settings
            </Link>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <button
              onClick={handleSignOut}
              className={`${
                active ? 'bg-gray-100' : ''
              } block w-full text-left px-4 py-2 text-sm text-red-600 rounded-md`}
            >
              Sign Out
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
