import api from './api'

export interface AdminUser {
  _id: string
  name: string
  email: string
  avatar?: string
  role: 'student' | 'admin'
  isVerified: boolean
  isBanned: boolean
  createdAt: string
}

export interface AdminStats {
  totalUsers: number
  totalNotes: number
  totalDoubts: number
  totalBlogs: number
  totalForums: number
  totalReports: number
}

interface UserResponse {
  success: boolean
  user: AdminUser
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const { data } = await api.get('/api/admin/stats')
    return data.stats || data
  },

  async getUsers(): Promise<AdminUser[]> {
    const { data } = await api.get('/api/admin/users')
    if (Array.isArray(data)) return data
    if (data.users) return data.users
    if (data.data) return data.data
    return []
  },

  async changeUserRole(userId: string, role: 'student' | 'admin'): Promise<UserResponse> {
    const { data } = await api.put(`/api/admin/users/${userId}/role`, { role })
    return {
      success: data.success,
      user: data.user,
    }
  },

  async toggleBanUser(userId: string): Promise<UserResponse> {
    const { data } = await api.put(`/api/admin/users/${userId}/ban`)
    return {
      success: data.success,
      user: data.user,
    }
  },
}
