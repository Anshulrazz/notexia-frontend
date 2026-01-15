'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, Heart, Calendar, FileText, Tag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ReportButton } from '@/components/ReportButton'
import { noteService, Note } from '@/services/note.service'
import { formatRelativeTime, getInitials, getAvatarUrl, getFileUrl } from '@/utils/helpers'
import { toast } from 'sonner'

export default function NoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadNote(params.id as string)
    }
  }, [params.id])

  const loadNote = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await noteService.getNote(id)
      setNote(data)
    } catch {
      toast.error('Failed to load note')
      router.push('/dashboard/notes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    if (!note) return
    try {
      const response = await noteService.likeNote(note._id)
      setNote((prev) => prev ? { ...prev, likes: [...prev.likes, 'user'] } : null)
      toast.success(`Liked! Total: ${response.likes}`)
    } catch {
      toast.error('Failed to like note')
    }
  }

  const handleDownload = async () => {
    if (!note) return
    try {
      await noteService.downloadNote(note._id)
      const url = getFileUrl(note.file.path)
      if (url) window.open(url, '_blank')
      toast.success('Download started')
    } catch {
      toast.error('Failed to download')
    }
  }

  const getSubjectName = (subject: string | { name?: string } | null): string => {
    if (!subject) return 'Unknown'
    if (typeof subject === 'object' && subject.name) return subject.name
    if (typeof subject === 'string') return subject
    return 'Unknown'
  }

  const parseTags = (tags: string | string[] | { _id: string; name: string }[]): string[] => {
    if (!tags) return []
    if (Array.isArray(tags)) {
      return tags.map(t => {
        if (typeof t === 'object' && t !== null && 'name' in t) return t.name
        return String(t)
      }).filter(Boolean)
    }
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean)
    return []
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Note not found</p>
        <Button variant="ghost" onClick={() => router.push('/dashboard/notes')} className="mt-4 text-violet-400">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.push('/dashboard/notes')} className="text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Notes
      </Button>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/30 mb-4">
              {getSubjectName(note.subject)}
            </Badge>
            <ReportButton contentType="note" contentId={note._id} />
          </div>
          <CardTitle className="text-2xl text-white">{note.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {note.description && (
            <p className="text-slate-300 leading-relaxed">{note.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {parseTags(note.tags).map((tag) => (
              <Badge key={tag} variant="outline" className="border-[#2a2a3e] text-slate-400">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-[#2a2a3e]">
            <div className="flex items-center gap-2 text-slate-400">
              <Heart className="h-4 w-4 text-pink-400" />
              <span>{note.likes?.length || 0} likes</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Download className="h-4 w-4 text-violet-400" />
              <span>{note.downloads || 0} downloads</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{formatRelativeTime(note.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <FileText className="h-4 w-4" />
              <span>{note.file?.filename || 'File'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatarUrl(note.author?.avatar)} />
                <AvatarFallback className="bg-violet-500/20 text-violet-400">
                  {getInitials(note.author?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{note.author?.name || 'Unknown'}</p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-[#2a2a3e] text-slate-300 hover:text-pink-400 hover:border-pink-500/50"
                onClick={handleLike}
              >
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
