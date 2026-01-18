import api from './api'

interface HintResponse {
  success: boolean
  hint: string
}

interface AnswerResponse {
  success: boolean
  answer: string
}

interface TagsResponse {
  success: boolean
  tags: string[]
}

interface SummaryResponse {
  success: boolean
  summary: string
}

export const aiService = {
  async getDoubtHint(question: string): Promise<HintResponse> {
    const { data } = await api.post('/ai/doubt-hint', { question })
    return {
      success: data.success,
      hint: data.hint,
    }
  },

  async getDoubtAnswer(question: string, description?: string): Promise<AnswerResponse> {
    const { data } = await api.post('/ai/doubt-answer', { question, description })
    return {
      success: data.success,
      answer: data.answer,
    }
  },

  async generateTags(text: string): Promise<TagsResponse> {
    const { data } = await api.post('/ai/tags', { text })
    return {
      success: data.success,
      tags: data.tags,
    }
  },

  async getBlogSummary(content: string): Promise<SummaryResponse> {
    const { data } = await api.post('/ai/blog-summary', { content })
    return {
      success: data.success,
      summary: data.summary,
    }
  },
}
