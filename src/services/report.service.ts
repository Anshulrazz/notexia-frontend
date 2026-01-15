import api from './api'

export interface Report {
  id: string
  contentType: 'note' | 'doubt' | 'answer' | 'blog' | 'thread' | 'forum'
  contentId: string
  reason: string
  description: string
  reporter: {
    id: string
    name: string
  }
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
}

interface CreateReportPayload {
  contentType: 'note' | 'doubt' | 'answer' | 'blog' | 'thread' | 'forum'
  contentId: string
  reason: string
  description: string
}

export const reportService = {
  async createReport(payload: CreateReportPayload): Promise<Report> {
    const { data } = await api.post('/api/reports', payload)
    return data
  },

  async getReports(): Promise<Report[]> {
    const { data } = await api.get('/api/reports')
    return data
  },

  async updateReportStatus(reportId: string, status: Report['status']): Promise<Report> {
    const { data } = await api.put(`/api/reports/${reportId}/status`, { status })
    return data
  },
}
