"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Search, Menu, X, Home, BookOpen, User, Phone, Settings, Moon, Sun, Zap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
  };

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: BookOpen, label: "Posts", href: "/posts" },
    { icon: User, label: "About", href: "/about" },
    { icon: Phone, label: "Contact", href: "/contact" },
    { icon: Settings, label: "Admin", href: "/admin" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="relative">
                <Zap className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 tracking-tighter">
                ChyrpBlog
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group relative px-3 py-2 text-gray-300 hover:text-cyan-400 transition-all duration-300 ease-out"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 group-hover:w-full transition-all duration-300 ease-out"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xs mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-gray-300 placeholder-gray-400 backdrop-blur-xl focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                placeholder="Search posts..."
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 to-pink-400/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-xl group"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              )}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-gray-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-xl"
              >
                {isOpen ? (
                  <X className="h-6 w-6 rotate-180 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95 backdrop-blur-xl border-t border-cyan-500/20">
          {/* Mobile Search */}
          <div className="px-3 py-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-gray-300 placeholder-gray-400 backdrop-blur-xl focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                placeholder="Search posts..."
              />
            </div>
          </div>

          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="group flex items-center px-3 py-2 text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </nav>
  );
};

export default Navbar;
