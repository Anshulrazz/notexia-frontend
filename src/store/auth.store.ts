import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'

export interface User {
  id: string
  _id?: string
  email: string
  name: string
  avatar?: string
  role: 'student' | 'admin'
  college?: string
  branch?: string
  year?: number
  isVerified: boolean
  createdAt?: string
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

const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === 'undefined') return
    const maxAge = 7 * 24 * 60 * 60
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`
  },
  removeItem: (name: string): void => {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=;path=/;max-age=0`
  },
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
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false)
      },
    }
  )
)
