import api from './api'

export interface Report {
  _id: string
  id?: string
  targetType: 'note' | 'doubt' | 'blog' | 'forum'
  targetId: string
  reason: string
  reporter: {
    _id?: string
    id?: string
    name: string
  }
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
}

interface CreateReportPayload {
  targetType: 'note' | 'doubt' | 'blog' | 'forum'
  targetId: string
  reason: string
}

interface ReportResponse {
  success: boolean
  report: Report
}

export const reportService = {
  async createReport(payload: CreateReportPayload): Promise<ReportResponse> {
    const { data } = await api.post('/api/reports', payload)
    return {
      success: data.success,
      report: data.report,
    }
  },

  async getReports(): Promise<Report[]> {
    const { data } = await api.get('/api/reports')
    if (Array.isArray(data)) return data
    if (data.reports) return data.reports
    if (data.data) return data.data
    return []
  },

  async updateReportStatus(reportId: string, status: Report['status']): Promise<Report> {
    const { data } = await api.put(`/api/reports/${reportId}/status`, { status })
    return data.report || data
  },
}
