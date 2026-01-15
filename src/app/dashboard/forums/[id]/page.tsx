'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Users, Calendar, MessageSquare, Loader2, Plus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ReportButton } from '@/components/ReportButton'
import { forumService, Forum, Thread } from '@/services/forum.service'
import { formatRelativeTime, getInitials, getAvatarUrl } from '@/utils/helpers'
import { toast } from 'sonner'

export default function ForumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [forum, setForum] = useState<Forum | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [isCreatingThread, setIsCreatingThread] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newThread, setNewThread] = useState({ title: '', content: '' })
  const [expandedThread, setExpandedThread] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadForum(params.id as string)
    }
  }, [params.id])

  const loadForum = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await forumService.getForum(id)
      setForum(data)
    } catch {
      toast.error('Failed to load forum')
      router.push('/dashboard/forums')
    } finally {
      setIsLoading(false)
    }
  }

    const handleJoin = async () => {
      if (!forum) return
      setIsJoining(true)
      try {
        await forumService.joinForum(forum._id)
        setForum((prev) => {
          if (!prev) return null
          const currentMembers = Array.isArray(prev.members) ? prev.members : []
          return { ...prev, members: [...currentMembers, { name: 'user' }] }
        })
        toast.success('Joined forum successfully')
      } catch {
        toast.error('Failed to join forum')
      } finally {
        setIsJoining(false)
      }
    }

  const handleCreateThread = async () => {
    if (!forum || !newThread.title || !newThread.content) return
    setIsCreatingThread(true)
    try {
      const result = await forumService.createThread(forum._id, newThread)
      setForum((prev) => {
        if (!prev) return null
        return { ...prev, threads: [...result.threads, ...(prev.threads || [])] }
      })
      setNewThread({ title: '', content: '' })
      setDialogOpen(false)
      toast.success('Thread created successfully')
    } catch {
      toast.error('Failed to create thread')
    } finally {
      setIsCreatingThread(false)
    }
  }

  const handleReply = async (threadId: string) => {
    if (!forum || !replyContent) return
    setIsReplying(true)
    try {
      const reply = await forumService.addReply(forum._id, threadId, replyContent)
      setForum((prev) => {
        if (!prev) return null
        return {
          ...prev,
          threads: prev.threads?.map((t) =>
            t._id === threadId ? { ...t, replies: [...(t.replies || []), reply] } : t
          ),
        }
      })
      setReplyContent('')
      toast.success('Reply posted')
    } catch {
      toast.error('Failed to post reply')
    } finally {
      setIsReplying(false)
    }
  }

  const getMembersCount = (members: { _id?: string; id?: string; name: string }[] | undefined): number => {
    return members?.length || 0
  }

  const getThreadsCount = (threads: Thread[] | undefined): number => {
    return threads?.length || 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (!forum) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Forum not found</p>
        <Button variant="ghost" onClick={() => router.push('/dashboard/forums')} className="mt-4 text-violet-400">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forums
        </Button>
      </div>
    )
  }

  const forumName = forum.name || 'Unnamed Forum'
  const forumDescription = forum.description || 'No description available'
  const threads = forum.threads || []

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.push('/dashboard/forums')} className="text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Forums
      </Button>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">{forumName[0]}</span>
            </div>
            <ReportButton contentType="forum" contentId={forum._id} />
          </div>
          <CardTitle className="text-2xl text-white">{forumName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-300 leading-relaxed">{forumDescription}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-[#2a2a3e]">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4 text-amber-400" />
              <span>{getMembersCount(forum.members)} members</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              <span>{getThreadsCount(forum.threads)} threads</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>Created {formatRelativeTime(forum.createdAt)}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={handleJoin}
              disabled={isJoining}
            >
              {isJoining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
              Join Forum
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Forum Threads ({threads.length})
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  New Thread
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Thread</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-white">Title</Label>
                    <Input
                      value={newThread.title}
                      onChange={(e) => setNewThread((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Thread title..."
                      className="bg-[#12121a] border-[#2a2a3e] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Content</Label>
                    <Textarea
                      value={newThread.content}
                      onChange={(e) => setNewThread((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="What do you want to discuss?"
                      className="bg-[#12121a] border-[#2a2a3e] text-white min-h-[120px]"
                    />
                  </div>
                  <Button
                    onClick={handleCreateThread}
                    disabled={isCreatingThread || !newThread.title || !newThread.content}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    {isCreatingThread ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Create Thread
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {threads.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No threads yet. Be the first to start a discussion!
            </p>
          ) : (
            threads.map((thread) => (
              <div key={thread._id} className="p-4 rounded-lg bg-[#12121a] border border-[#2a2a3e]">
                <div className="flex items-start justify-between mb-3">
                  <h4
                    className="text-white font-medium cursor-pointer hover:text-amber-400 transition-colors"
                    onClick={() => setExpandedThread(expandedThread === thread._id ? null : thread._id)}
                  >
                    {thread.title}
                  </h4>
                  <span className="text-xs text-slate-500">{thread.replies?.length || 0} replies</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{thread.content}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={getAvatarUrl(thread.author?.avatar)} />
                    <AvatarFallback className="bg-amber-500/20 text-amber-400 text-xs">
                      {getInitials(thread.author?.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-slate-500">{thread.author?.name || 'Unknown'}</span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-500">{formatRelativeTime(thread.createdAt)}</span>
                </div>

                {expandedThread === thread._id && (
                  <div className="mt-4 pt-4 border-t border-[#2a2a3e] space-y-3">
                    {thread.replies?.map((reply) => (
                      <div key={reply._id} className="pl-4 border-l-2 border-amber-500/30">
                        <p className="text-sm text-slate-300">{reply.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{reply.author?.name || 'Unknown'}</span>
                          <span className="text-xs text-slate-600">•</span>
                          <span className="text-xs text-slate-500">{formatRelativeTime(reply.createdAt)}</span>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 mt-3">
                      <Input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="bg-[#1e1e2e] border-[#2a2a3e] text-white text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleReply(thread._id)}
                        disabled={isReplying || !replyContent}
                        className="bg-amber-500 hover:bg-amber-600"
                      >
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
