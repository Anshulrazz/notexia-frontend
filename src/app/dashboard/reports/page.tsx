'use client'

import { useState, useEffect } from 'react'
import { Flag, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { reportService, Report } from '@/services/report.service'
import { formatRelativeTime } from '@/utils/helpers'
import { toast } from 'sonner'

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  reviewed: { label: 'Reviewed', icon: CheckCircle, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  resolved: { label: 'Resolved', icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  dismissed: { label: 'Dismissed', icon: XCircle, color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setIsLoading(true)
    try {
      const data = await reportService.getReports()
      setReports(data)
      } catch {
        setReports([
          {
            _id: '1',
            id: '1',
            contentType: 'note',
            contentId: 'n1',
            reason: 'Spam or misleading',
            description: 'This note contains misleading information.',
            reporter: { id: '1', name: 'User 1' },
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2',
            id: '2',
            contentType: 'blog',
            contentId: 'b1',
            reason: 'Inappropriate content',
            description: 'Contains offensive language.',
            reporter: { id: '2', name: 'User 2' },
            status: 'reviewed',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (reportId: string, status: Report['status']) => {
    try {
      await reportService.updateReportStatus(reportId, status)
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      )
      toast.success('Report status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400 mt-1">Review and manage reported content</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : reports.length === 0 ? (
          <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Flag className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400">No reports to review</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const status = statusConfig[report.status]
              const StatusIcon = status.icon

                return (
                  <Card key={report._id || report.id} className="bg-[#1e1e2e] border-[#2a2a3e]">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize border-[#2a2a3e] text-slate-400">
                          {report.contentType}
                        </Badge>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500">{formatRelativeTime(report.createdAt)}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-white font-medium">{report.reason}</p>
                      <p className="text-sm text-slate-400">{report.description}</p>
                      <p className="text-xs text-slate-500">Reported by: {report.reporter.name}</p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-[#2a2a3e]">
                      <span className="text-sm text-slate-400">Update Status:</span>
                        <Select
                          value={report.status}
                          onValueChange={(value) => handleStatusUpdate(report._id || report.id || '', value as Report['status'])}
                        >
                        <SelectTrigger className="w-[150px] bg-[#12121a] border-[#2a2a3e] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                          <SelectItem value="pending" className="text-white hover:bg-[#2a2a3e]">Pending</SelectItem>
                          <SelectItem value="reviewed" className="text-white hover:bg-[#2a2a3e]">Reviewed</SelectItem>
                          <SelectItem value="resolved" className="text-white hover:bg-[#2a2a3e]">Resolved</SelectItem>
                          <SelectItem value="dismissed" className="text-white hover:bg-[#2a2a3e]">Dismissed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
