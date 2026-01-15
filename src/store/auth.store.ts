import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  college?: string
  isVerified: boolean
  createdAt: string
}

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  login: (token: string, user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: true,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      login: (token, user) => set({ token, user, isLoading: false }),
      logout: () => set({ token: null, user: null, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'notexia-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false)
      },
    }
  )
)
