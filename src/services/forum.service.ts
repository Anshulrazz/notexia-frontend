import api from './api'

export interface Thread {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  replies: number
  createdAt: string
}

export interface Forum {
  id: string
  name: string
  description: string
  category: string
  membersCount: number
  threadsCount: number
  isJoined: boolean
  threads: Thread[]
  createdAt: string
}

interface CreateForumPayload {
  name: string
  description: string
  category: string
}

interface CreateThreadPayload {
  title: string
  content: string
}

export const forumService = {
  async getForums(params?: { category?: string; search?: string }): Promise<Forum[]> {
    const { data } = await api.get('/api/forums', { params })
    return Array.isArray(data) ? data : data?.forums || data?.data || []
  },

  async createForum(payload: CreateForumPayload): Promise<Forum> {
    const { data } = await api.post('/api/forums', payload)
    return data
  },

  async joinForum(forumId: string): Promise<void> {
    await api.post(`/api/forums/${forumId}/join`)
  },

  async createThread(forumId: string, payload: CreateThreadPayload): Promise<Thread> {
    const { data } = await api.post(`/api/forums/${forumId}/thread`, payload)
    return data
  },
}
