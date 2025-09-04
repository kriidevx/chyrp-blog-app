'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function UserMenu() {
  const { profile, signOut, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside (desktop + mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse" />;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="rounded-full bg-gray-700 px-3 py-2 flex items-center gap-2 focus:outline-none"
        onClick={() => setOpen((val) => !val)}
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url} // If using Supabase storage, replace with public URL
            alt={profile.username}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <span className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full uppercase font-bold">
            {profile?.username?.[0] || 'U'}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-2 z-10">
          <Link href={`/profile/${profile?.username ?? ''}`} className="block px-4 py-2 hover:bg-gray-100">
            Profile
          </Link>
          <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
            Dashboard
          </Link>
          <button
            onClick={async () => {
              await signOut();
              setOpen(false); // close menu after logout
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
