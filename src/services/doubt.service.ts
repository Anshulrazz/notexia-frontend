import api from './api'

export interface Answer {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  upvotes: number
  isAccepted: boolean
  createdAt: string
}

export interface Doubt {
  id: string
  title: string
  description: string
  subject: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  answers: Answer[]
  tags: string[]
  isSolved: boolean
  createdAt: string
}

interface CreateDoubtPayload {
  title: string
  description: string
  subject: string
  tags: string[]
}

export const doubtService = {
  async getDoubts(params?: { subject?: string; search?: string; solved?: boolean }): Promise<Doubt[]> {
    const { data } = await api.get('/api/doubts', { params })
    return data
  },

  async createDoubt(payload: CreateDoubtPayload): Promise<Doubt> {
    const { data } = await api.post('/api/doubts', payload)
    return data
  },

  async addAnswer(doubtId: string, content: string): Promise<Answer> {
    const { data } = await api.post(`/api/doubts/${doubtId}/answer`, { content })
    return data
  },

  async upvoteAnswer(doubtId: string, answerId: string): Promise<void> {
    await api.post(`/api/doubts/${doubtId}/answer/${answerId}/upvote`)
  },

  async acceptAnswer(doubtId: string, answerId: string): Promise<void> {
    await api.post(`/api/doubts/${doubtId}/accept/${answerId}`)
  },
}
