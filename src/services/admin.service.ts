import api from './api'

export interface AdminUser {
  _id: string
  id?: string
  name: string
  email: string
  avatar?: string
  role: 'student' | 'moderator' | 'admin'
  reputation: number
  isVerified?: boolean
  isBanned?: boolean
  createdAt: string
}

export interface AdminStats {
  totalUsers: number
  totalNotes: number
  totalBlogs: number
  totalDoubts: number
  totalForums: number
  users?: number
  notes?: number
  blogs?: number
  doubts?: number
  forums?: number
  reports?: number
}

interface UserResponse {
  success: boolean
  user: AdminUser
}

interface BanResponse {
  success: boolean
  message: string
  user?: AdminUser
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const { data } = await api.get('/admin/stats')
    return data.data || data
  },

  async getUsers(): Promise<AdminUser[]> {
    const { data } = await api.get('/admin/users')
    if (Array.isArray(data)) return data
    if (data.users) return data.users
    if (data.data) return data.data
    return []
  },

  async changeUserRole(userId: string, role: 'student' | 'moderator' | 'admin'): Promise<UserResponse> {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role })
    return {
      success: data.success,
      user: data.user,
    }
  },

  async toggleBanUser(userId: string): Promise<BanResponse> {
    const { data } = await api.put(`/admin/users/${userId}/ban`)
    return {
      success: data.success,
      message: data.message,
    }
  },
}
