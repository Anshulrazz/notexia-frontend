'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Users, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { ReportButton } from '@/components/ReportButton'
import { forumService, Forum } from '@/services/forum.service'
import { FORUM_CATEGORIES } from '@/utils/constants'
import { toast } from 'sonner'

export default function ForumsPage() {
  const [forums, setForums] = useState<Forum[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null)
  const [isThreadOpen, setIsThreadOpen] = useState(false)

  const [newForum, setNewForum] = useState({ name: '', description: '', category: '' })
  const [newThread, setNewThread] = useState({ title: '', content: '' })

  useEffect(() => {
    loadForums()
  }, [searchQuery])

  const loadForums = async () => {
    setIsLoading(true)
    try {
      const params: { search?: string } = {}
      if (searchQuery) params.search = searchQuery
      const data = await forumService.getForums(params)
      setForums(data)
    } catch {
      setForums([
        {
          id: '1',
          name: 'Computer Science Study Group',
          description: 'Discuss CS topics, share resources, and help each other learn.',
          category: 'Study Groups',
          membersCount: 156,
          threadsCount: 42,
          isJoined: true,
          threads: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Career Advice Hub',
          description: 'Get guidance on internships, jobs, and career paths.',
          category: 'Career Advice',
          membersCount: 89,
          threadsCount: 28,
          isJoined: false,
          threads: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Tech Talk',
          description: 'Latest trends in technology and development.',
          category: 'Tech Talk',
          membersCount: 234,
          threadsCount: 67,
          isJoined: false,
          threads: [],
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateForum = async () => {
    if (!newForum.name || !newForum.category) {
      toast.error('Please fill all required fields')
      return
    }

    setIsCreating(true)
    try {
      await forumService.createForum(newForum)
      toast.success('Forum created successfully')
      setIsCreateOpen(false)
      setNewForum({ name: '', description: '', category: '' })
      loadForums()
    } catch {
      toast.error('Failed to create forum')
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinForum = async (forumId: string) => {
    try {
      await forumService.joinForum(forumId)
      setForums((prev) =>
        prev.map((f) => (f.id === forumId ? { ...f, isJoined: !f.isJoined, membersCount: f.isJoined ? f.membersCount - 1 : f.membersCount + 1 } : f))
      )
      toast.success('Forum membership updated')
    } catch {
      toast.error('Failed to update membership')
    }
  }

  const handleCreateThread = async () => {
    if (!selectedForum || !newThread.title || !newThread.content) {
      toast.error('Please fill all fields')
      return
    }

    try {
      await forumService.createThread(selectedForum.id, newThread)
      toast.success('Thread created')
      setIsThreadOpen(false)
      setNewThread({ title: '', content: '' })
    } catch {
      toast.error('Failed to create thread')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Forums</h1>
          <p className="text-slate-400 mt-1">Join communities and discuss topics</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Forum
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e2e] border-[#2a2a3e] text-white">
            <DialogHeader>
              <DialogTitle>Create New Forum</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Forum Name *</Label>
                <Input
                  value={newForum.name}
                  onChange={(e) => setNewForum({ ...newForum, name: e.target.value })}
                  placeholder="Enter forum name"
                  className="bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={newForum.category} onValueChange={(v) => setNewForum({ ...newForum, category: v })}>
                  <SelectTrigger className="bg-[#12121a] border-[#2a2a3e] text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                    {FORUM_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-white hover:bg-[#2a2a3e]">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newForum.description}
                  onChange={(e) => setNewForum({ ...newForum, description: e.target.value })}
                  placeholder="Describe your forum"
                  className="bg-[#12121a] border-[#2a2a3e] text-white min-h-[80px]"
                />
              </div>
              <Button
                onClick={handleCreateForum}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              >
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Forum
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search forums..."
          className="pl-10 bg-[#1e1e2e] border-[#2a2a3e] text-white"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : forums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No forums found. Create the first one!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forums.map((forum) => (
            <Card key={forum.id} className="bg-[#1e1e2e] border-[#2a2a3e] hover:border-amber-500/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                    {forum.category}
                  </Badge>
                  <ReportButton contentType="forum" contentId={forum.id} />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{forum.name}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{forum.description}</p>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {forum.membersCount} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {forum.threadsCount} threads
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={forum.isJoined ? 'outline' : 'default'}
                    className={forum.isJoined ? 'flex-1 border-[#2a2a3e] text-white' : 'flex-1 bg-gradient-to-r from-amber-500 to-orange-500'}
                    onClick={() => handleJoinForum(forum.id)}
                  >
                    {forum.isJoined ? 'Leave' : 'Join'}
                  </Button>
                  {forum.isJoined && (
                    <Button
                      variant="outline"
                      className="border-[#2a2a3e] text-white"
                      onClick={() => {
                        setSelectedForum(forum)
                        setIsThreadOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isThreadOpen} onOpenChange={setIsThreadOpen}>
        <DialogContent className="bg-[#1e1e2e] border-[#2a2a3e] text-white">
          <DialogHeader>
            <DialogTitle>Create Thread in {selectedForum?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                placeholder="Thread title"
                className="bg-[#12121a] border-[#2a2a3e] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={newThread.content}
                onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                placeholder="Write your thread content..."
                className="bg-[#12121a] border-[#2a2a3e] text-white min-h-[120px]"
              />
            </div>
            <Button onClick={handleCreateThread} className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
              Create Thread
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
