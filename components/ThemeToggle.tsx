import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { 
      id: 'light', 
      name: 'Light', 
      icon: Sun, 
      gradient: 'from-yellow-400 to-orange-500',
      bg: 'bg-slate-50',
      preview: 'bg-gradient-to-br from-slate-50 to-white'
    },
    { 
      id: 'dark', 
      name: 'Dark', 
      icon: Moon, 
      gradient: 'from-slate-800 to-slate-900',
      bg: 'bg-slate-900',
      preview: 'bg-gradient-to-br from-slate-800 to-slate-900'
    },
    { 
      id: 'system', 
      name: 'System', 
      icon: Monitor, 
      gradient: 'from-blue-600 to-cyan-500',
      bg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
      preview: 'bg-gradient-to-br from-blue-100 to-cyan-100'
    },
    { 
      id: 'auto', 
      name: 'Auto', 
      icon: Palette, 
      gradient: 'from-purple-600 to-pink-600',
      bg: 'bg-gradient-to-br from-purple-600 to-pink-600',
      preview: 'bg-gradient-to-br from-purple-100 to-pink-100'
    }
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: string) => {
    const root = document.documentElement;
    
    switch (selectedTheme) {
      case 'dark':
        root.classList.add('dark');
        break;
      case 'light':
        root.classList.remove('dark');
        break;
      case 'system':
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        break;
      case 'auto':
        const hour = new Date().getHours();
        if (hour >= 19 || hour <= 6) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        break;
    }
  };

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white/80 backdrop-blur-xl border border-slate-200/50 hover:border-blue-300 rounded-2xl text-slate-700 hover:text-blue-600 transition-all duration-300 transform-gpu hover:scale-110 group"
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${currentTheme.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
        <currentTheme.icon className="w-6 h-6 relative z-10" />
        
        {/* Indicator dot */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r ${currentTheme.gradient} rounded-full border-2 border-white shadow-lg`}></div>
      </button>

      {/* Theme Picker Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-3 w-80 bg-white/95 backdrop-blur-3xl border border-cyan-500/20 rounded-3xl shadow-[0_35px_80px_rgba(37,99,235,0.2)] overflow-hidden z-50">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4">
              <div className="absolute inset-0 bg-white/10"></div>
              <h3 className="relative text-lg font-bold text-white">Choose Theme</h3>
            </div>

            {/* Theme Options */}
            <div className="p-6 space-y-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 transform-gpu hover:scale-[1.02] group ${
                    theme === themeOption.id
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg'
                      : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 border-2 border-transparent'
                  }`}
                >
                  {/* Theme Preview */}
                  <div className={`w-16 h-12 ${themeOption.preview} rounded-xl shadow-inner border border-white/50 relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <themeOption.icon className={`w-6 h-6 text-slate-600 ${theme === themeOption.id ? 'scale-110' : ''} transition-transform duration-300`} />
                    </div>
                    {theme === themeOption.id && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20"></div>
                    )}
                  </div>

                  {/* Theme Info */}
                  <div className="flex-1 text-left">
                    <h4 className={`font-semibold transition-colors duration-300 ${
                      theme === themeOption.id ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {themeOption.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {themeOption.id === 'light' && 'Clean and bright interface'}
                      {themeOption.id === 'dark' && 'Easy on the eyes'}
                      {themeOption.id === 'system' && 'Follows your OS preference'}
                      {themeOption.id === 'auto' && 'Changes based on time'}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {theme === themeOption.id && (
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Advanced Options */}
            <div className="px-6 pb-6 space-y-3">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl">
                <div>
                  <h4 className="font-semibold text-slate-900">Auto-switch</h4>
                  <p className="text-sm text-slate-600">Automatically change themes</p>
                </div>
                <label className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-12 h-6 bg-slate-300 rounded-full shadow-inner transition-colors duration-300 hover:bg-blue-300">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-0.5 translate-y-0.5 transition-transform duration-300"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;