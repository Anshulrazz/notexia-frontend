'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'

export function useAuth(requireAuth = true) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout, setLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, requireAuth, router])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await authService.logout()
    } finally {
      logout()
      router.push('/login')
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator',
    isVerified: user?.isVerified ?? false,
    logout: handleLogout,
  }
}
