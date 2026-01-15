import api from './api'
import { User } from '@/store/auth.store'

interface UpdateUserPayload {
  name?: string
  college?: string
}

export const userService = {
  async getMe(): Promise<User> {
    const { data } = await api.get('/api/users/me')
    return data
  },

  async updateMe(payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.put('/api/users/me', payload)
    return data
  },

  async updateAvatar(file: File): Promise<User> {
    const formData = new FormData()
    formData.append('avatar', file)
    const { data } = await api.put('/api/users/me/avatar', formData)
    return data
  },
}
