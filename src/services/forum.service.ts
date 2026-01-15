import api from './api'

export interface Thread {
  _id: string
  title: string
  content: string
  author?: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  replies?: Reply[]
  createdAt: string
}

export interface Reply {
  _id: string
  content: string
  author?: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  createdAt: string
}

export interface Forum {
  _id: string
  id?: string
  name: string
  description: string
  category?: string
  members: string[] | number
  threads?: Thread[]
  creator?: {
    _id?: string
    id?: string
    name?: string
  } | string
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

  async getForum(forumId: string): Promise<Forum> {
    const { data } = await api.get(`/api/forums/${forumId}`)
    return data.forum || data
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

  async createThread(forumId: string, payload: { title: string; content: string }): Promise<Thread> {
    const { data } = await api.post(`/api/forums/${forumId}/thread`, payload)
    return data.thread || data
  },

  async getThreads(forumId: string): Promise<Thread[]> {
    const { data } = await api.get(`/api/forums/${forumId}/thread`)
    if (Array.isArray(data)) return data
    if (data.threads) return data.threads
    if (data.data) return data.data
    return []
  },

  async addReply(forumId: string, threadId: string, content: string): Promise<Reply> {
    const { data } = await api.post(`/api/forums/${forumId}/threads/${threadId}/replies`, { content })
    return data.reply || data
  },
}
