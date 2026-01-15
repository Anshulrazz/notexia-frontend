import api from './api'

export interface Answer {
  _id: string
  id?: string
  text: string
  author: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  upvotes: string[]
  createdAt: string
}

export interface Doubt {
  _id: string
  id?: string
  question: string
  description: string
  subject?: string
  author: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  answers: Answer[]
  tags: string
  acceptedAnswer?: string
  createdAt: string
}

interface CreateDoubtPayload {
  question: string
  description: string
  tags: string
}

interface DoubtResponse {
  success: boolean
  doubt: Doubt
}

interface AnswerResponse {
  success: boolean
  answers: Answer[]
}

interface AcceptResponse {
  success: boolean
  acceptedAnswer: string
}

export const doubtService = {
  async getDoubts(params?: { subject?: string; search?: string; solved?: boolean }): Promise<Doubt[]> {
    const { data } = await api.get('/api/doubts', { params })
    if (Array.isArray(data)) return data
    if (data.doubts) return data.doubts
    if (data.data) return data.data
    return []
  },

  async getDoubt(doubtId: string): Promise<Doubt> {
    const { data } = await api.get(`/api/doubts/${doubtId}`)
    return data.doubt || data
  },

  async createDoubt(payload: CreateDoubtPayload): Promise<DoubtResponse> {
    const { data } = await api.post('/api/doubts', payload)
    return {
      success: data.success,
      doubt: data.doubt,
    }
  },

  async addAnswer(doubtId: string, text: string): Promise<AnswerResponse> {
    const { data } = await api.post(`/api/doubts/${doubtId}/answer`, { text })
    return {
      success: data.success,
      answers: data.answers,
    }
  },

  async upvoteAnswer(doubtId: string, answerId: string): Promise<void> {
    await api.post(`/api/doubts/${doubtId}/answer/${answerId}/upvote`)
  },

  async acceptAnswer(doubtId: string, answerId: string): Promise<AcceptResponse> {
    const { data } = await api.post(`/api/doubts/${doubtId}/accept/${answerId}`)
    return {
      success: data.success,
      acceptedAnswer: data.acceptedAnswer,
    }
  },

  async deleteDoubt(doubtId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/api/doubts/${doubtId}`)
    return { success: data.success }
  },
}
