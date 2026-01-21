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

interface PasswordResponse {
  success: boolean
  message?: string
}

interface UserStats {
  notesUploaded: number
  doubtsAsked: number
  doubtsAnswered: number
  blogsWritten: number
  forumsJoined: number
}

interface StatsResponse {
  success: boolean
  data: UserStats
}

export const userService = {
  async getUser(userId: string): Promise<User> {
    const { data } = await api.get(`/users/${userId}`)
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

  async getMe(): Promise<User> {
    const { data } = await api.get('/users/me')
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

  async updateMe(payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.put('/users/me', payload)
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

  async updateAvatar(file: File): Promise<AvatarResponse> {
    const formData = new FormData()
    formData.append('avatar', file)
    const { data } = await api.put('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return {
      success: data.success,
      avatar: data.avatar || data.user?.avatar,
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<PasswordResponse> {
    const { data } = await api.put('/users/me/password', { currentPassword, newPassword })
    return {
      success: data.success,
      message: data.message,
    }
  },

  async getStats(): Promise<StatsResponse> {
    const { data } = await api.get('/users/me/stats')
    return {
      success: data.success,
      data: data.data,
    }
  },
}
