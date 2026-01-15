import api from './api'
import { User } from '@/store/auth.store'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  name: string
  college?: string
}

interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/login', payload)
    return data
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/register', payload)
    return data
  },

  async googleLogin(googleToken: string): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/google', { token: googleToken })
    return data
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/api/auth/me')
    return data
  },
}
