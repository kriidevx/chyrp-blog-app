"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
          Chyrp Modernized
        </Link>

        {/* Desktop Menu - hidden on small screens */}
        <div className="hidden md:flex space-x-8 items-center text-lg font-medium text-gray-700 dark:text-gray-300">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
            Contact
          </Link>
          {session ? (
            <>
              <Link href="/admin/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors duration-200 rounded px-2 py-1"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button - shows only on small screens */}
        <div className="flex md:hidden items-center space-x-4">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            {mobileMenuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md px-6 pb-6 space-y-3 text-lg font-medium text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
            Home
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
            About
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
            Contact
          </Link>
          {session ? (
            <>
              <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors duration-200 rounded px-2 py-1"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded px-2 py-1">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
