'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'

export function useAuth(requireAuth = true) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, login, logout, setLoading } = useAuthStore()

  const checkAuth = useCallback(async () => {
    if (isAuthenticated && user) {
      setLoading(false)
      return
    }
    
    try {
      const userData = await authService.getMe()
      login(userData)
    } catch {
      logout()
      if (requireAuth) {
        router.push('/login')
      }
    }
  }, [isAuthenticated, user, login, logout, setLoading, requireAuth, router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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
    refreshAuth: checkAuth,
  }
}
