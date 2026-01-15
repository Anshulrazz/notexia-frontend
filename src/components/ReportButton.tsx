'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { REPORT_REASONS } from '@/utils/constants'
import { reportService } from '@/services/report.service'
import { toast } from 'sonner'

interface ReportButtonProps {
  contentType: 'note' | 'doubt' | 'answer' | 'blog' | 'thread' | 'forum'
  contentId: string
  variant?: 'icon' | 'default'
}

export function ReportButton({ contentType, contentId, variant = 'icon' }: ReportButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason')
      return
    }

    setIsLoading(true)
    try {
      await reportService.createReport({
        contentType,
        contentId,
        reason,
        description,
      })
      toast.success('Report submitted successfully')
      setOpen(false)
      setReason('')
      setDescription('')
    } catch {
      toast.error('Failed to submit report')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <Flag className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" className="text-slate-400 hover:text-red-400">
            <Flag className="h-4 w-4 mr-2" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#1e1e2e] border-[#2a2a3e] text-white">
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription className="text-slate-400">
            Help us understand what&apos;s wrong with this content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-white">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="bg-[#12121a] border-[#2a2a3e] text-white">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                {REPORT_REASONS.map((r) => (
                  <SelectItem
                    key={r}
                    value={r}
                    className="text-white hover:bg-[#2a2a3e] focus:bg-[#2a2a3e]"
                  >
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Additional Details (Optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context about the issue..."
              className="bg-[#12121a] border-[#2a2a3e] text-white placeholder:text-slate-500 min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-[#2a2a3e] text-white hover:bg-[#2a2a3e]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
