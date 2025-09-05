import React, { useState } from 'react';
import { Search, Bell, User, Menu, X, Home, Compass, Heart, MessageCircle, Bookmark, Settings } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-3xl border-b border-cyan-500/20 shadow-[0_8px_32px_rgba(37,99,235,0.1)]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-blue-600/5 bg-[length:200%_100%] animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section with Glow Effect */}
          <div className="flex-shrink-0 group">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500 transform group-hover:scale-110"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-500 transform-gpu group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-slate-50 font-black text-lg">S</span>
                </div>
              </div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-500">
                Social
              </h1>
            </div>
          </div>

          {/* Advanced Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl blur-xl transition-all duration-500 ${isSearchFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}></div>
              <div className="relative flex items-center">
                <Search className={`absolute left-4 w-5 h-5 transition-all duration-300 ${isSearchFocused ? 'text-blue-600 scale-110' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search posts, people, topics..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full pl-12 pr-6 py-3 bg-white/60 backdrop-blur-xl border-2 rounded-2xl text-slate-900 placeholder-slate-500 transition-all duration-500 focus:outline-none transform-gpu ${
                    isSearchFocused 
                      ? 'border-blue-600/50 bg-white/80 shadow-[0_0_40px_rgba(37,99,235,0.2)] scale-[1.02]' 
                      : 'border-slate-200/50 hover:border-cyan-500/30 hover:bg-white/70'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            {[
              { icon: Home, active: true },
              { icon: Compass, active: false },
              { icon: Heart, active: false },
              { icon: MessageCircle, active: false },
              { icon: Bookmark, active: false }
            ].map((item, index) => (
              <button
                key={index}
                className={`relative p-3 rounded-xl transition-all duration-300 transform-gpu group ${
                  item.active 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-110' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-110'
                }`}
              >
                <item.icon className="w-6 h-6" />
                {item.active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                )}
              </button>
            ))}
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell with Glow */}
            <button className="relative p-3 text-slate-600 hover:text-blue-600 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 transform-gpu hover:scale-110 group">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-pulse">
                3
              </span>
              <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>

            {/* Profile with Advanced Effects */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-500 transform-gpu hover:scale-105">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="hidden sm:block font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  John Doe
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu with Glassmorphism */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white/80 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_25px_50px_rgba(37,99,235,0.15)] overflow-hidden">
            <div className="px-6 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-600/50 transition-all duration-300"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Home, label: 'Home', active: true },
                  { icon: Compass, label: 'Explore', active: false },
                  { icon: Heart, label: 'Likes', active: false },
                  { icon: MessageCircle, label: 'Messages', active: false },
                  { icon: Bookmark, label: 'Saved', active: false },
                  { icon: Settings, label: 'Settings', active: false }
                ].map((item, index) => (
                  <button
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                      item.active 
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg' 
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
    </nav>
  );
};

export default Navbar;