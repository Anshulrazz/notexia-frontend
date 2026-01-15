import api from './api'
import { User } from '@/store/auth.store'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  college?: string
  branch?: string
  year?: number
}

interface AuthResponse {
  success: boolean
  user: User
  token?: string
}

const setTokenCookie = (token: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`
  }
}

const getTokenFromCookie = (): string | null => {
  if (typeof window === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
  return match ? match[2] : null
}

const clearTokenCookie = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', payload)
    
    if (data.token) {
      setTokenCookie(data.token)
    }
    
    return {
      success: data.success,
      token: data.token,
      user: {
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role || 'student',
        isVerified: data.user.isVerified ?? false,
        avatar: data.user.avatar,
        college: data.user.college,
        branch: data.user.branch,
        year: data.user.year,
      },
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', payload)
    
    if (data.token) {
      setTokenCookie(data.token)
    }
    
    return {
      success: data.success,
      token: data.token,
      user: {
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role || 'student',
        isVerified: data.user.isVerified ?? false,
        avatar: data.user.avatar,
        college: data.user.college,
        branch: data.user.branch,
        year: data.user.year,
      },
    }
  },

  async googleLogin(googleToken: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/google', { token: googleToken })
    
    if (data.token) {
      setTokenCookie(data.token)
    }
    
    return {
      success: data.success,
      token: data.token,
      user: {
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name || '',
        role: data.user.role || 'student',
        isVerified: data.user.isVerified ?? true,
        avatar: data.user.avatar,
        college: data.user.college,
        branch: data.user.branch,
        year: data.user.year,
      },
    }
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me')
    const user = data.user || data
    return {
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'student',
      isVerified: user.isVerified ?? false,
      avatar: user.avatar,
      college: user.college,
      branch: user.branch,
      year: user.year,
      reputation: user.reputation,
      createdAt: user.createdAt,
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
    } finally {
      clearTokenCookie()
    }
  },

  getToken: getTokenFromCookie,
  setToken: setTokenCookie,
  clearToken: clearTokenCookie,
}
