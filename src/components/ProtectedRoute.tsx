'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isAdmin, isVerified } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (!isVerified) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0a0a0f] text-center px-4">
        <div className="rounded-full bg-amber-500/10 p-4 mb-4">
          <svg
            className="h-12 w-12 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Account Not Verified</h1>
        <p className="text-slate-400 max-w-md">
          Your account is pending verification. Please check your email or contact support.
        </p>
      </div>
    )
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0a0a0f] text-center px-4">
        <div className="rounded-full bg-red-500/10 p-4 mb-4">
          <svg
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 max-w-md">
          You do not have permission to access this page.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
