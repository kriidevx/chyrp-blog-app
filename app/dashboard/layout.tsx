'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/auth/login') {
      router.push('/auth/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <p className="p-4 text-gray-600">Checking session...</p>;
  }

  if (!user) {
    // Optionally show a message or blank while redirecting
    return <p className="p-4 text-red-600">Redirecting to login...</p>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {children}
    </div>
  )
}
