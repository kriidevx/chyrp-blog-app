"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase"; // Your Supabase client import

export default function UserMenu({ onClose }: { onClose?: () => void }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      // Fetch username from your users table via Supabase
      supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error) console.error("Error fetching username:", error.message);
          else if (data?.username) setUsername(data.username);
        });
    }
  }, [user?.id]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
        if (onClose) onClose();
      }
    }
    function onEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        if (onClose) onClose();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  if (!user) return null;

  const initial = user.email?.[0].toUpperCase() || "U";

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    if (onClose) onClose();
    router.push("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-label="Open user menu"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-12 h-12 rounded-full ring-2 ring-cyan-500 ring-offset-2 ring-offset-white bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-xl select-none transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label="User menu"
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-cyan-300 ring-1 ring-cyan-200 ring-opacity-50 z-50 animate-fadeInDown"
        >
          <Link
            href={`/profile/${username || user.id}`}
            role="menuitem"
            tabIndex={0}
            className="block px-4 py-3 text-gray-700 hover:bg-cyan-100 hover:text-cyan-900 transition-colors rounded-t-xl focus:outline-none focus:bg-cyan-100"
            onClick={() => setOpen(false)}
          >
            View Profile
          </Link>

          <Link
            href="/profile/edit"
            role="menuitem"
            tabIndex={0}
            className="block px-4 py-3 text-gray-700 hover:bg-cyan-100 hover:text-cyan-900 transition-colors focus:outline-none focus:bg-cyan-100"
            onClick={() => setOpen(false)}
          >
            Edit Profile
          </Link>
          <Link
            href="/dashboard"
            role="menuitem"
            tabIndex={0}
            className="block px-4 py-3 text-gray-700 hover:bg-cyan-100 hover:text-cyan-900 transition-colors focus:outline-none focus:bg-cyan-100"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <button
            role="menuitem"
            tabIndex={0}
            onClick={handleSignOut}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-100 transition-colors rounded-b-xl focus:outline-none focus:bg-red-100"
          >
            Sign Out
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.2s ease forwards;
        }
      `}</style>
    </div>
  );
}
