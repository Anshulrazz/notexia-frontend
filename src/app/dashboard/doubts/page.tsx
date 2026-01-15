'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, ThumbsUp, Check, Sparkles, Loader2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ReportButton } from '@/components/ReportButton'
import { doubtService, Doubt } from '@/services/doubt.service'
import { aiService } from '@/services/ai.service'
import { formatRelativeTime, getInitials, getAvatarUrl } from '@/utils/helpers'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'

export default function DoubtsPage() {
  const { user } = useAuthStore()
  const [doubts, setDoubts] = useState<Doubt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null)
  const [answerContent, setAnswerContent] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)
  const [aiHint, setAiHint] = useState('')
  const [isGettingHint, setIsGettingHint] = useState(false)
  const [hintForDoubtId, setHintForDoubtId] = useState<string | null>(null)

  const [newDoubt, setNewDoubt] = useState({
    question: '',
    description: '',
    tags: '',
  })

  useEffect(() => {
    loadDoubts()
  }, [searchQuery])

  const loadDoubts = async () => {
    setIsLoading(true)
    try {
      const params: { search?: string } = {}
      if (searchQuery) params.search = searchQuery
      const data = await doubtService.getDoubts(params)
      setDoubts(data)
    } catch {
      setDoubts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDoubt = async () => {
    if (!newDoubt.question || !newDoubt.description) {
      toast.error('Please fill all required fields')
      return
    }

    setIsCreating(true)
    try {
      await doubtService.createDoubt({
        question: newDoubt.question,
        description: newDoubt.description,
        tags: newDoubt.tags,
      })
      toast.success('Doubt posted successfully')
      setIsCreateOpen(false)
      setNewDoubt({ question: '', description: '', tags: '' })
      loadDoubts()
    } catch {
      toast.error('Failed to post doubt')
    } finally {
      setIsCreating(false)
    }
  }

  const handleAnswer = async () => {
    if (!selectedDoubt || !answerContent) return

    setIsAnswering(true)
    try {
      const response = await doubtService.addAnswer(selectedDoubt._id, answerContent)
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === selectedDoubt._id ? { ...d, answers: response.answers } : d
        )
      )
      setSelectedDoubt((prev) => prev ? { ...prev, answers: response.answers } : null)
      setAnswerContent('')
      toast.success('Answer posted')
    } catch {
      toast.error('Failed to post answer')
    } finally {
      setIsAnswering(false)
    }
  }

  const handleUpvote = async (doubtId: string, answerId: string) => {
    try {
      await doubtService.upvoteAnswer(doubtId, answerId)
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === doubtId
            ? {
                ...d,
                answers: d.answers.map((a) =>
                  a._id === answerId ? { ...a, upvotes: [...a.upvotes, 'user'] } : a
                ),
              }
            : d
        )
      )
    } catch {
      toast.error('Failed to upvote')
    }
  }

  const handleAccept = async (doubtId: string, answerId: string) => {
    try {
      await doubtService.acceptAnswer(doubtId, answerId)
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === doubtId
            ? {
                ...d,
                acceptedAnswer: answerId,
              }
            : d
        )
      )
      toast.success('Answer accepted')
    } catch {
      toast.error('Failed to accept answer')
    }
  }

  const handleGetHint = async (doubt: Doubt) => {
    setIsGettingHint(true)
    setHintForDoubtId(doubt._id)
    try {
      const response = await aiService.getDoubtHint(doubt.question)
      setAiHint(response.hint)
    } catch {
      setAiHint('Consider breaking down the problem into smaller steps. Look for similar solved problems and adapt their solutions.')
    } finally {
      setIsGettingHint(false)
    }
  }

  const parseTags = (tags: string | string[]): string[] => {
    if (Array.isArray(tags)) return tags
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean)
    return []
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Doubts</h1>
          <p className="text-slate-400 mt-1">Ask questions and help others</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ask Doubt
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e2e] border-[#2a2a3e] text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Ask a Doubt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Question *</Label>
                <Input
                  value={newDoubt.question}
                  onChange={(e) => setNewDoubt({ ...newDoubt, question: e.target.value })}
                  placeholder="What's your question?"
                  className="bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={newDoubt.description}
                  onChange={(e) => setNewDoubt({ ...newDoubt, description: e.target.value })}
                  placeholder="Explain your doubt in detail..."
                  className="bg-[#12121a] border-[#2a2a3e] text-white min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={newDoubt.tags}
                  onChange={(e) => setNewDoubt({ ...newDoubt, tags: e.target.value })}
                  placeholder="e.g., Python, DSA, Trees"
                  className="bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
              <Button
                onClick={handleCreateDoubt}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
              >
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Post Doubt
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
          placeholder="Search doubts..."
          className="pl-10 bg-[#1e1e2e] border-[#2a2a3e] text-white"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : doubts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No doubts found. Ask the first question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doubts.map((doubt) => (
            <Card key={doubt._id} className="bg-[#1e1e2e] border-[#2a2a3e]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {doubt.acceptedAnswer && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        <Check className="h-3 w-3 mr-1" />
                        Solved
                      </Badge>
                    )}
                  </div>
                  <ReportButton contentType="doubt" contentId={doubt._id} />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{doubt.question}</h3>
                <p className="text-sm text-slate-400 mb-4">{doubt.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {parseTags(doubt.tags).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-[#2a2a3e] text-slate-400">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#2a2a3e]">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={getAvatarUrl(doubt.author?.avatar)} />
                      <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                        {getInitials(doubt.author?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium text-white">{doubt.author?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{formatRelativeTime(doubt.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-amber-400"
                      onClick={() => handleGetHint(doubt)}
                      disabled={isGettingHint && hintForDoubtId === doubt._id}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Hint
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-violet-400"
                      onClick={() => setSelectedDoubt(doubt)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {doubt.answers?.length || 0} Answers
                    </Button>
                  </div>
                </div>

                {aiHint && hintForDoubtId === doubt._id && (
                  <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-sm text-amber-200">
                      <Sparkles className="h-4 w-4 inline mr-2" />
                      {aiHint}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedDoubt} onOpenChange={(open) => !open && setSelectedDoubt(null)}>
        <DialogContent className="bg-[#1e1e2e] border-[#2a2a3e] text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDoubt?.question}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-slate-400">{selectedDoubt?.description}</p>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Answers ({selectedDoubt?.answers?.length || 0})</h4>
              {selectedDoubt?.answers?.map((answer) => (
                <div key={answer._id} className={`p-4 rounded-lg ${selectedDoubt.acceptedAnswer === answer._id ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-[#12121a] border border-[#2a2a3e]'}`}>
                  <p className="text-sm text-slate-300 mb-3">{answer.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs">
                          {getInitials(answer.author?.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-slate-400">{answer.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-blue-400"
                        onClick={() => handleUpvote(selectedDoubt!._id, answer._id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {answer.upvotes?.length || 0}
                      </Button>
                      {(selectedDoubt?.author?._id === user?.id || selectedDoubt?.author?.id === user?.id) && !selectedDoubt?.acceptedAnswer && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-emerald-400"
                          onClick={() => handleAccept(selectedDoubt!._id, answer._id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-[#2a2a3e]">
              <Label>Your Answer</Label>
              <Textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Write your answer..."
                className="bg-[#12121a] border-[#2a2a3e] text-white min-h-[100px]"
              />
              <Button
                onClick={handleAnswer}
                disabled={isAnswering || !answerContent}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              >
                {isAnswering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Post Answer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
