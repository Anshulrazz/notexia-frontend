import api from './api'

export interface Report {
  _id: string
  id?: string
  targetType?: 'note' | 'doubt' | 'blog' | 'forum'
  contentType?: 'note' | 'doubt' | 'blog' | 'forum'
  targetId?: string
  contentId?: string
  reason: string
  description?: string
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
    const { data } = await api.post('/reports', payload)
    return {
      success: data.success,
      report: data.report,
    }
  },

  async getReports(): Promise<Report[]> {
    const { data } = await api.get('/reports')
    let reports: Report[] = []
    if (Array.isArray(data)) reports = data
    else if (data.reports) reports = data.reports
    else if (data.data) reports = data.data
    return reports.map(r => ({
      ...r,
      id: r.id || r._id,
      contentType: r.contentType || r.targetType,
      contentId: r.contentId || r.targetId,
      reporter: {
        ...r.reporter,
        id: r.reporter?.id || r.reporter?._id,
        name: r.reporter?.name || 'Unknown'
      }
    }))
  },

  async updateReportStatus(reportId: string, status: Report['status']): Promise<Report> {
    const { data } = await api.patch(`/reports/${reportId}/status`, { status })
    return data.report || data
  },
}
