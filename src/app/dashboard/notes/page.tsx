'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Download, Heart, Filter, Loader2, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/FileUpload'
import { ReportButton } from '@/components/ReportButton'
import { noteService, Note } from '@/services/note.service'
import { bookmarkService } from '@/services/bookmark.service'
import { SUBJECTS } from '@/utils/constants'
import { formatRelativeTime, getInitials, getAvatarUrl, getFileUrl } from '@/utils/helpers'
import { toast } from 'sonner'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Set<string>>(new Set())

  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    subject: '',
    tags: '',
    type: 'note' as 'note' | 'project',
    file: null as File | null,
  })

  useEffect(() => {
    loadNotes()
  }, [selectedSubject, searchQuery])

  const loadNotes = async () => {
    setIsLoading(true)
    try {
      const params: { subject?: string; search?: string } = {}
      if (selectedSubject !== 'all') params.subject = selectedSubject
      if (searchQuery) params.search = searchQuery
      const data = await noteService.getNotes(params)
      setNotes(data)
    } catch {
      setNotes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = async () => {
    if (!newNote.title || !newNote.subject || !newNote.file) {
      toast.error('Please fill all required fields')
      return
    }

    setIsCreating(true)
      try {
        await noteService.createNote({
          title: newNote.title,
          description: newNote.description,
          subject: newNote.subject,
          tags: newNote.tags.split(',').map((t) => t.trim()).filter(Boolean),
          type: newNote.type,
          file: newNote.file,
        })
        toast.success('Note uploaded successfully')
        setIsCreateOpen(false)
        setNewNote({ title: '', description: '', subject: '', tags: '', type: 'note', file: null })
      loadNotes()
    } catch {
      toast.error('Failed to upload note')
    } finally {
      setIsCreating(false)
    }
  }

  const handleLike = async (noteId: string) => {
    try {
      const response = await noteService.likeNote(noteId)
      setNotes((prev) =>
        prev.map((n) => (n._id === noteId ? { ...n, likes: [...n.likes, 'user'] } : n))
      )
      toast.success(`Liked! Total: ${response.likes}`)
    } catch {
      toast.error('Failed to like note')
    }
  }

  const handleDownload = async (note: Note) => {
    try {
      await noteService.downloadNote(note._id)
      const url = getFileUrl(note.file.path)
      if (url) window.open(url, '_blank')
      toast.success('Download started')
    } catch {
      toast.error('Failed to download')
    }
  }

  const handleBookmark = async (noteId: string) => {
    try {
      if (bookmarkedNotes.has(noteId)) {
        const checkResult = await bookmarkService.check('note', noteId)
        if (checkResult.bookmarkId) {
          await bookmarkService.remove(checkResult.bookmarkId)
          setBookmarkedNotes((prev) => {
            const newSet = new Set(prev)
            newSet.delete(noteId)
            return newSet
          })
          toast.success('Bookmark removed')
        }
      } else {
        await bookmarkService.add('note', noteId)
        setBookmarkedNotes((prev) => new Set(prev).add(noteId))
        toast.success('Bookmarked!')
      }
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notes</h1>
          <p className="text-slate-400 mt-1">Browse and share study materials</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Upload Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e2e] border-[#2a2a3e] text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Enter note title"
                  className="bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={newNote.subject} onValueChange={(v) => setNewNote({ ...newNote, subject: v })}>
                  <SelectTrigger className="bg-[#12121a] border-[#2a2a3e] text-white">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s} className="text-white hover:bg-[#2a2a3e]">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  placeholder="e.g., DSA, Algorithms, Trees"
                  className="bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>File *</Label>
                <FileUpload
                  accept=".pdf,.zip,.doc,.docx,.ppt,.pptx"
                  onFileSelect={(file) => setNewNote({ ...newNote, file })}
                  onError={(error) => toast.error(error)}
                />
              </div>
              <Button
                onClick={handleCreateNote}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Note'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="pl-10 bg-[#1e1e2e] border-[#2a2a3e] text-white"
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-[200px] bg-[#1e1e2e] border-[#2a2a3e] text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
            <SelectItem value="all" className="text-white hover:bg-[#2a2a3e]">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s} value={s} className="text-white hover:bg-[#2a2a3e]">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No notes found. Be the first to share!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
<Card key={note._id} className="bg-[#1e1e2e] border-[#2a2a3e] hover:border-violet-500/50 transition-colors">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
                        {typeof note.subject === 'object' && note.subject !== null ? (note.subject as { name?: string }).name || 'Unknown' : note.subject}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${bookmarkedNotes.has(note._id) ? 'text-violet-400' : 'text-slate-400'} hover:text-violet-400 hover:bg-violet-500/10`}
                          onClick={() => handleBookmark(note._id)}
                        >
                          <Bookmark className={`h-4 w-4 ${bookmarkedNotes.has(note._id) ? 'fill-current' : ''}`} />
                        </Button>
                        <ReportButton contentType="note" contentId={note._id} />
                      </div>
                    </div>
                    <Link href={`/dashboard/notes/${note._id}`}>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 hover:text-violet-400 transition-colors">{note.title}</h3>
                    </Link>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{note.description || 'No description'}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(Array.isArray(note.tags) ? note.tags : []).slice(0, 3).map((tag) => {
                      const tagName = typeof tag === 'object' && tag !== null ? (tag as { name?: string }).name || '' : tag
                      return (
                        <Badge key={tagName} variant="outline" className="text-xs border-[#2a2a3e] text-slate-400">
                          {tagName}
                        </Badge>
                      )
                    })}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#2a2a3e]">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={getAvatarUrl(note.author?.avatar)} />
                      <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs">
                        {getInitials(note.author?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium text-white">{note.author?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{formatRelativeTime(note.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10"
                      onClick={() => handleLike(note._id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-slate-500">{note.likes?.length || 0}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10"
                      onClick={() => handleDownload(note)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
