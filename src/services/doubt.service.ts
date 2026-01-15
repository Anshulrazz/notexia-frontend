import api from './api'

export interface Answer {
  _id: string
  id?: string
  text: string
  user: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  author?: {
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
  description?: string
  tags: string[]
  author: {
    _id?: string
    id?: string
    name: string
    college?: string
    avatar?: string
  }
  answers: Answer[]
  acceptedAnswer?: string | null
  createdAt: string
}

interface CreateDoubtPayload {
  question: string
  description?: string
  tags?: string
}

interface DoubtResponse {
  success: boolean
  doubt: Doubt
}

interface AnswerResponse {
  success: boolean
  answers: Answer[]
}

interface UpvoteResponse {
  success: boolean
  upvotes: number
}

interface AcceptResponse {
  success: boolean
  acceptedAnswer: string
}

export const doubtService = {
  async getDoubts(params?: { subject?: string; search?: string; solved?: boolean }): Promise<Doubt[]> {
    const { data } = await api.get('/doubts', { params })
    if (Array.isArray(data)) return data
    if (data.doubts) return data.doubts
    if (data.data) return data.data
    return []
  },

  async getDoubt(doubtId: string): Promise<Doubt> {
    const { data } = await api.get(`/doubts/${doubtId}`)
    return data.doubt || data
  },

  async createDoubt(payload: CreateDoubtPayload): Promise<DoubtResponse> {
    const { data } = await api.post('/doubts', payload)
    return {
      success: data.success,
      doubt: data.doubt,
    }
  },

  async deleteDoubt(doubtId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/doubts/${doubtId}`)
    return { success: data.success }
  },

  async addAnswer(doubtId: string, text: string): Promise<AnswerResponse> {
    const { data } = await api.post(`/doubts/${doubtId}/answer`, { text })
    return {
      success: data.success,
      answers: data.answers,
    }
  },

  async upvoteAnswer(doubtId: string, answerId: string): Promise<UpvoteResponse> {
    const { data } = await api.post(`/doubts/${doubtId}/answer/${answerId}/upvote`)
    return {
      success: data.success,
      upvotes: data.upvotes,
    }
  },

  async acceptAnswer(doubtId: string, answerId: string): Promise<AcceptResponse> {
    const { data } = await api.post(`/doubts/${doubtId}/accept/${answerId}`)
    return {
      success: data.success,
      acceptedAnswer: data.acceptedAnswer,
    }
  },
}
