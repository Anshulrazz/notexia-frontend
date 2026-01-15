import api from './api'
import { User } from '@/store/auth.store'

interface UpdateUserPayload {
  name?: string
  college?: string
  branch?: string
  year?: number
}

interface AvatarResponse {
  success: boolean
  avatar: string
}

export const userService = {
  async getMe(): Promise<User> {
    const { data } = await api.get('/api/users/me')
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

  async updateMe(payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.put('/api/users/me', payload)
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

  async updateAvatar(file: File): Promise<AvatarResponse> {
    const formData = new FormData()
    formData.append('avatar', file)
    const { data } = await api.put('/api/users/me/avatar', formData, {
      headers: {
        'Content-Type': undefined,
      },
    })
    return {
      success: data.success,
      avatar: data.avatar,
    }
  },
}
