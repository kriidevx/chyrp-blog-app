"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";
import AuthButtons from "./AuthButtons";
import { PenTool, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-3xl border-b border-cyan-500/20 shadow-[0_8px_32px_rgba(37,99,235,0.1)] relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-blue-600/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & site name */}
          <Link href="/" className="flex items-center space-x-2 select-none">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-2 rounded-md shadow-md">
              <PenTool className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-xl">
              Chyrp Blogger
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex space-x-10 font-semibold text-blue-700">
            <Link href="/" className="hover:text-cyan-500 transition">
              Home
            </Link>
            <Link href="/posts" className="hover:text-cyan-500 transition">
              Feed
            </Link>
            <Link href="/about" className="hover:text-cyan-500 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-cyan-500 transition">
              Contact
            </Link>
          </nav>

          {/* Right side - user menu or auth buttons */}
          <div className="flex items-center space-x-4">
            {user ? <UserMenu /> : <AuthButtons />}

            {/* Mobile menu button */}
            <button
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-md text-blue-600 hover:bg-blue-50 transition"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4 border-t border-cyan-500/30">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md font-semibold text-blue-700 hover:bg-cyan-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="block px-3 py-2 rounded-md font-semibold text-blue-700 hover:bg-cyan-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Feed
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md font-semibold text-blue-700 hover:bg-cyan-100"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md font-semibold text-blue-700 hover:bg-cyan-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {!user && (
              <div className="flex flex-col space-y-2 px-3 mt-2">
                <Link
                  href="/auth/login"
                  className="block text-center px-4 py-2 rounded-md border border-cyan-500 text-cyan-600 font-semibold hover:bg-cyan-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block text-center px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-cyan-500 hover:to-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
