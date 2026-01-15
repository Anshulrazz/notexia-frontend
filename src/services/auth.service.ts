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
  token: string
  user: User
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/login', payload)
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
    const { data } = await api.post('/api/auth/register', payload)
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
    const { data } = await api.post('/api/auth/google', { token: googleToken })
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
    const { data } = await api.get('/api/auth/me')
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
      createdAt: user.createdAt,
    }
  },
}
