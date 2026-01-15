import api from './api'

export interface Reply {
  _id: string
  id?: string
  content: string
  author: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  createdAt: string
}

export interface Thread {
  _id: string
  id?: string
  title: string
  content: string
  author: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  replies?: Reply[]
  createdAt: string
}

export interface Forum {
  _id: string
  id?: string
  name: string
  description?: string
  creator: {
    _id?: string
    id?: string
    name: string
  }
  members: { _id?: string; id?: string; name: string }[]
  threads: Thread[]
  createdAt: string
}

interface CreateForumPayload {
  name: string
  description?: string
}

interface ForumResponse {
  success: boolean
  forum: Forum
}

interface JoinResponse {
  success: boolean
  membersCount: number
}

interface ThreadResponse {
  success: boolean
  threads: Thread[]
}

export const forumService = {
  async getForums(params?: { category?: string; search?: string }): Promise<Forum[]> {
    const { data } = await api.get('/forums', { params })
    if (Array.isArray(data)) return data
    if (data.forums) return data.forums
    if (data.data) return data.data
    return []
  },

  async getForum(forumId: string): Promise<Forum> {
    const { data } = await api.get(`/forums/${forumId}`)
    return data.forum || data
  },

  async createForum(payload: CreateForumPayload): Promise<ForumResponse> {
    const { data } = await api.post('/forums', payload)
    return {
      success: data.success,
      forum: data.forum,
    }
  },

  async deleteForum(forumId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/forums/${forumId}`)
    return { success: data.success }
  },

  async joinForum(forumId: string): Promise<JoinResponse> {
    const { data } = await api.post(`/forums/${forumId}/join`)
    return {
      success: data.success,
      membersCount: data.membersCount,
    }
  },

  async createThread(forumId: string, payload: { title: string; content: string }): Promise<ThreadResponse> {
    const { data } = await api.post(`/forums/${forumId}/thread`, payload)
    return {
      success: data.success,
      threads: data.threads,
    }
  },

  async getThread(forumId: string, threadId: string): Promise<Thread> {
    const { data } = await api.get(`/forums/${forumId}/thread/${threadId}`)
    return data.thread || data
  },

  async addReply(forumId: string, threadId: string, content: string): Promise<Reply> {
    const { data } = await api.post(`/forums/${forumId}/thread/${threadId}/reply`, { content })
    return data.reply || data
  },
}
