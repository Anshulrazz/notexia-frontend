'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export function useAuth(requireAuth = true) {
  const router = useRouter()
  const { token, user, isLoading, logout } = useAuthStore()

  useEffect(() => {
    if (!isLoading && requireAuth && !token) {
      router.push('/login')
    }
  }, [token, isLoading, requireAuth, router])

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    isVerified: user?.isVerified ?? false,
    logout,
  }
}
