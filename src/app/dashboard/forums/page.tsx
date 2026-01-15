'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Users, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ReportButton } from '@/components/ReportButton'
import { forumService, Forum } from '@/services/forum.service'
import { toast } from 'sonner'

export default function ForumsPage() {
  const [forums, setForums] = useState<Forum[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [newForum, setNewForum] = useState({ name: '', description: '' })

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
      setForums([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateForum = async () => {
    if (!newForum.name) {
      toast.error('Please fill all required fields')
      return
    }

    setIsCreating(true)
    try {
      await forumService.createForum(newForum)
      toast.success('Forum created successfully')
      setIsCreateOpen(false)
      setNewForum({ name: '', description: '' })
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
        prev.map((f) => (f._id === forumId ? { ...f, members: f.members + 1 } : f))
      )
      toast.success('Joined forum successfully')
    } catch {
      toast.error('Failed to join forum')
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
            <Card key={forum._id} className="bg-[#1e1e2e] border-[#2a2a3e] hover:border-amber-500/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold">{typeof forum.name === 'object' && forum.name !== null ? (forum.name as { name?: string }).name?.[0] || 'F' : forum.name?.[0] || 'F'}</span>
                    </div>
                    <ReportButton contentType="forum" contentId={forum._id} />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{typeof forum.name === 'object' && forum.name !== null ? (forum.name as { name?: string }).name || 'Unnamed' : forum.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{typeof forum.description === 'object' && forum.description !== null ? (forum.description as { name?: string }).name || 'No description' : forum.description || 'No description'}</p>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {forum.members || 0} members
                  </span>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                  onClick={() => handleJoinForum(forum._id)}
                >
                  Join
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
