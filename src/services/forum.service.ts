import api from './api'

export interface Forum {
  _id: string
  id?: string
  name: string
  description: string
  category?: string
  members: number
  author?: {
    _id?: string
    id?: string
    name: string
  }
  createdAt: string
}

interface CreateForumPayload {
  name: string
  description: string
}

interface ForumResponse {
  success: boolean
  forum: Forum
}

export const forumService = {
  async getForums(params?: { category?: string; search?: string }): Promise<Forum[]> {
    const { data } = await api.get('/api/forums', { params })
    if (Array.isArray(data)) return data
    if (data.forums) return data.forums
    if (data.data) return data.data
    return []
  },

  async createForum(payload: CreateForumPayload): Promise<ForumResponse> {
    const { data } = await api.post('/api/forums', payload)
    return {
      success: data.success,
      forum: data.forum,
    }
  },

  async joinForum(forumId: string): Promise<void> {
    await api.post(`/api/forums/${forumId}/join`)
  },
}
