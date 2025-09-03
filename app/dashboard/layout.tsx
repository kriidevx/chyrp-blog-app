'use client'

import { useAuth } from "@/context/AuthContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="p-4 text-gray-600">Checking session...</p>
  }

  if (!user) {
    return <p className="p-4 text-red-600">Redirecting to login...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {children}
    </div>
  )
}
