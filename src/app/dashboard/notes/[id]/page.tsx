'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, Heart, Calendar, FileText, Tag, Loader2, Bookmark, BookmarkCheck, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ReportButton } from '@/components/ReportButton'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('@/components/PDFViewer').then(mod => ({ default: mod.PDFViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
    </div>
  )
})
import { noteService, Note, NoteComment } from '@/services/note.service'
import { bookmarkService } from '@/services/bookmark.service'
import { formatRelativeTime, getInitials, getAvatarUrl, getFileUrl } from '@/utils/helpers'
import { toast } from 'sonner'

export default function NoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadNote(params.id as string)
      checkBookmark(params.id as string)
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

  const checkBookmark = async (id: string) => {
    try {
      const response = await bookmarkService.check('note', id)
      setIsBookmarked(response.isBookmarked)
      setBookmarkId(response.bookmarkId)
    } catch {
      setIsBookmarked(false)
    }
  }

  const handleBookmark = async () => {
    if (!note) return
    try {
      if (isBookmarked && bookmarkId) {
        await bookmarkService.remove(bookmarkId)
        setIsBookmarked(false)
        setBookmarkId(null)
        toast.success('Bookmark removed')
      } else {
        const response = await bookmarkService.add('note', note._id)
        setIsBookmarked(true)
        setBookmarkId(response.data._id)
        toast.success('Bookmarked!')
      }
    } catch {
      toast.error('Failed to update bookmark')
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

  const handleAddComment = async () => {
    if (!note || !commentText.trim()) return
    setIsSubmittingComment(true)
    try {
      const response = await noteService.addComment(note._id, commentText.trim())
      setNote((prev) => prev ? { ...prev, comments: response.comments } : null)
      setCommentText('')
      toast.success('Comment added!')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const getSubjectName = (subject: string | { name?: string } | null | undefined): string => {
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
    <div className="space-y-6 max-w-6xl mx-auto">
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
            <div className="text-slate-300 leading-relaxed">
              <MarkdownRenderer content={note.description} />
            </div>
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
                <AvatarImage src={getAvatarUrl(note.uploader?.avatar)} />
                <AvatarFallback className="bg-violet-500/20 text-violet-400">
                  {getInitials(note.uploader?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{note.uploader?.name || 'Unknown'}</p>
                <p className="text-xs text-slate-500">uploader</p>
              </div>
            </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className={`border-[#2a2a3e] ${isBookmarked ? 'text-violet-400 border-violet-500/50' : 'text-slate-300 hover:text-violet-400 hover:border-violet-500/50'}`}
                  onClick={handleBookmark}
                >
                  {isBookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
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

        {note.file?.path && note.file.path.toLowerCase().endsWith('.pdf') && (
          <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
            <CardHeader>
              <CardTitle className="text-lg text-white">PDF Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <PDFViewer url={getFileUrl(note.file.path) || ''} />
            </CardContent>
          </Card>
        )}

        <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-violet-400" />
              Comments ({note.comments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-[#12121a] border-[#2a2a3e] text-white placeholder:text-slate-500 min-h-[80px] resize-none"
              />
              <Button
                onClick={handleAddComment}
                disabled={!commentText.trim() || isSubmittingComment}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 self-end"
              >
                {isSubmittingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="space-y-4 mt-6">
              {note.comments && note.comments.length > 0 ? (
                note.comments.map((comment, index) => (
                  <div key={comment._id || index} className="flex gap-3 p-3 rounded-lg bg-[#12121a] border border-[#2a2a3e]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarUrl(comment.user?.avatar)} />
                      <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs">
                        {getInitials(comment.user?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{comment.user?.name || 'Unknown'}</span>
                        <span className="text-xs text-slate-500">{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
