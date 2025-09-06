'use client';

import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Script from 'next/script';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        {/* You can add meta tags, fonts, or title here */}
      </head>
      <body className="bg-slate-50 min-h-screen text-slate-900">
        {/* Load MathJax globally */}
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          strategy="afterInteractive"
        />

        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navbar />
            <main className="max-w-6xl mx-auto p-4">{children}</main>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
