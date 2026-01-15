import api from './api'

interface HintResponse {
  hint: string
}

interface TagsResponse {
  tags: string[]
}

interface SummaryResponse {
  summary: string
}

export const aiService = {
  async getDoubtHint(doubtId: string): Promise<HintResponse> {
    const { data } = await api.post('/api/ai/doubt-hint', { doubtId })
    return data
  },

  async generateTags(content: string): Promise<TagsResponse> {
    const { data } = await api.post('/api/ai/tags', { content })
    return data
  },

  async getBlogSummary(blogId: string): Promise<SummaryResponse> {
    const { data } = await api.post('/api/ai/blog-summary', { blogId })
    return data
  },
}
