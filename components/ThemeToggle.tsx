"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      updateHtmlClass(savedTheme);
      return;
    }
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
    updateHtmlClass(prefersDark ? "dark" : "light");
  }, []);

  const updateHtmlClass = (theme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateHtmlClass(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!theme) return null;

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      title="Toggle Dark Mode"
      style={{ width: "32px", height: "32px" }}
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mx-auto"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="none"
        >
          <path d="M12 3.1a9 9 0 000 17.8 9.003 9.003 0 000-17.8z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mx-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42" />
        </svg>
      )}
    </button>
  );
}
