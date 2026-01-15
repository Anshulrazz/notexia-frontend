import api from './api'

interface HintResponse {
  success: boolean
  hint: string
}

export const aiService = {
  async getDoubtHint(question: string): Promise<HintResponse> {
    const { data } = await api.post('/api/ai/doubt-hint', { question })
    return {
      success: data.success,
      hint: data.hint,
    }
  },
}
