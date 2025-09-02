'use client';

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Palette, Sparkles } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'electric' | 'sunset';

interface ThemeOption {
  id: Theme;
  name: string;
  icon: React.ReactNode;
  gradient: string;
}

interface ColorOption {
  id: ColorScheme;
  name: string;
  colors: string[];
  preview: string;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('electric');
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions: ThemeOption[] = [
    {
      id: 'light',
      name: 'Light',
      icon: <Sun className="w-4 h-4" />,
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: <Moon className="w-4 h-4" />,
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      id: 'system',
      name: 'System',
      icon: <Monitor className="w-4 h-4" />,
      gradient: 'from-gray-400 to-gray-600'
    }
  ];

  const colorOptions: ColorOption[] = [
    {
      id: 'electric',
      name: 'Electric Dreams',
      colors: ['#6366f1', '#ec4899', '#06b6d4'],
      preview: 'from-indigo-500 via-pink-500 to-cyan-500'
    },
    {
      id: 'sunset',
      name: 'Sunset Vibes',
      colors: ['#f97316', '#a855f7', '#f43f5e'],
      preview: 'from-orange-500 via-purple-500 to-rose-500'
    }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    if (savedTheme) setTheme(savedTheme);
    if (savedColorScheme) setColorScheme(savedColorScheme);
    applyTheme(savedTheme || 'dark', savedColorScheme || 'electric');
  }, []);

  const applyTheme = (selectedTheme: Theme, selectedColorScheme: ColorScheme) => {
    const root = document.documentElement;
    if (selectedTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemPrefersDark);
    } else {
      root.classList.toggle('dark', selectedTheme === 'dark');
    }
    const colorMap = {
      electric: {
        primary: '99 102 241',
        secondary: '236 72 153',
        accent: '6 182 212'
      },
      sunset: {
        primary: '249 115 22',
        secondary: '168 85 247',
        accent: '244 63 94'
      }
    };
    const colors = colorMap[selectedColorScheme];
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
  };

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme, colorScheme);
  };

  const handleColorSchemeChange = (selectedColorScheme: ColorScheme) => {
    setColorScheme(selectedColorScheme);
    localStorage.setItem('colorScheme', selectedColorScheme);
    applyTheme(theme, selectedColorScheme);
  };

  const currentThemeOption = themeOptions.find(opt => opt.id === theme);
  const currentColorOption = colorOptions.find(opt => opt.id === colorScheme);

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <div className={`w-6 h-6 bg-gradient-to-br ${currentThemeOption?.gradient} rounded-lg flex items-center justify-center text-white`}>
          {currentThemeOption?.icon}
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full right-0 mt-2 w-80 bg-white/10 dark:bg-gray-800/50 backdrop-blur-3xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl z-50 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="p-4 border-b border-white/10 dark:border-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Theme Settings
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Customize your experience
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Theme Mode
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleThemeChange(option.id)}
                    className={`group relative p-3 rounded-xl border transition-all duration-200 ${
                      theme === option.id
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/10 dark:border-gray-700/30 hover:border-white/20 dark:hover:border-gray-600/50'
                    }`}
                  >
                    <div className={`w-full h-8 bg-gradient-to-br ${option.gradient} rounded-lg flex items-center justify-center text-white mb-2`}>
                      {option.icon}
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {option.name}
                    </span>
                    {theme === option.id && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-white/10 dark:border-gray-700/30">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">
                Color Scheme
              </h4>
              <div className="space-y-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleColorSchemeChange(option.id)}
                    className={`group w-full p-3 rounded-xl border transition-all duration-200 text-left ${
                      colorScheme === option.id
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/10 dark:border-gray-700/30 hover:border-white/20 dark:hover:border-gray-600/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${option.preview} rounded-lg`}></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {option.name}
                        </div>
                        <div className="flex gap-1 mt-1">
                          {option.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      {colorScheme === option.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
