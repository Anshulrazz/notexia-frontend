'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ThumbsUp, Check, Sparkles, Calendar, Tag, MessageSquare, Loader2, Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ReportButton } from '@/components/ReportButton'
import { doubtService, Doubt } from '@/services/doubt.service'
import { bookmarkService } from '@/services/bookmark.service'
import { aiService } from '@/services/ai.service'
import { formatRelativeTime, getInitials, getAvatarUrl } from '@/utils/helpers'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'sonner'

export default function DoubtDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [doubt, setDoubt] = useState<Doubt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [answerContent, setAnswerContent] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)
  const [aiHint, setAiHint] = useState('')
  const [isGettingHint, setIsGettingHint] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      loadDoubt(params.id as string)
      checkBookmark(params.id as string)
    }
  }, [params.id])

  const loadDoubt = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await doubtService.getDoubt(id)
      setDoubt(data)
    } catch {
      toast.error('Failed to load doubt')
      router.push('/dashboard/doubts')
    } finally {
      setIsLoading(false)
    }
  }

  const checkBookmark = async (id: string) => {
    try {
      const response = await bookmarkService.check('doubt', id)
      setIsBookmarked(response.isBookmarked)
      setBookmarkId(response.bookmarkId)
    } catch {
      setIsBookmarked(false)
    }
  }

  const handleBookmark = async () => {
    if (!doubt) return
    try {
      if (isBookmarked && bookmarkId) {
        await bookmarkService.remove(bookmarkId)
        setIsBookmarked(false)
        setBookmarkId(null)
        toast.success('Bookmark removed')
      } else {
        const response = await bookmarkService.add('doubt', doubt._id)
        setIsBookmarked(true)
        setBookmarkId(response.data._id)
        toast.success('Bookmarked!')
      }
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  const handleAnswer = async () => {
    if (!doubt || !answerContent) return

    setIsAnswering(true)
    try {
      const response = await doubtService.addAnswer(doubt._id, answerContent)
      setDoubt((prev) => prev ? { ...prev, answers: response.answers } : null)
      setAnswerContent('')
      toast.success('Answer posted')
    } catch {
      toast.error('Failed to post answer')
    } finally {
      setIsAnswering(false)
    }
  }

  const handleUpvote = async (answerId: string) => {
    if (!doubt) return
    try {
      await doubtService.upvoteAnswer(doubt._id, answerId)
      setDoubt((prev) =>
        prev
          ? {
              ...prev,
              answers: prev.answers.map((a) =>
                a._id === answerId ? { ...a, upvotes: [...a.upvotes, 'user'] } : a
              ),
            }
          : null
      )
    } catch {
      toast.error('Failed to upvote')
    }
  }

  const handleAccept = async (answerId: string) => {
    if (!doubt) return
    try {
      await doubtService.acceptAnswer(doubt._id, answerId)
      setDoubt((prev) => (prev ? { ...prev, acceptedAnswer: answerId } : null))
      toast.success('Answer accepted')
    } catch {
      toast.error('Failed to accept answer')
    }
  }

  const handleGetHint = async () => {
    if (!doubt) return
    setIsGettingHint(true)
    try {
      const response = await aiService.getDoubtHint(doubt.question)
      setAiHint(response.hint)
    } catch {
      setAiHint('Consider breaking down the problem into smaller steps. Look for similar solved problems and adapt their solutions.')
    } finally {
      setIsGettingHint(false)
    }
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

  if (!doubt) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Doubt not found</p>
        <Button variant="ghost" onClick={() => router.push('/dashboard/doubts')} className="mt-4 text-violet-400">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Doubts
        </Button>
      </div>
    )
  }

  const isAuthor = doubt.author?._id === user?.id || doubt.author?.id === user?.id

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.push('/dashboard/doubts')} className="text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Doubts
      </Button>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
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
          <CardTitle className="text-2xl text-white mt-2">{doubt.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-300 leading-relaxed">{doubt.description}</p>

          <div className="flex flex-wrap gap-2">
            {parseTags(doubt.tags).map((tag) => (
              <Badge key={tag} variant="outline" className="border-[#2a2a3e] text-slate-400">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

            <div className="flex items-center justify-between py-4 border-t border-b border-[#2a2a3e]">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getAvatarUrl(doubt.author?.avatar)} />
                  <AvatarFallback className="bg-blue-500/20 text-blue-400">
                    {getInitials(doubt.author?.name || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">{doubt.author?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatRelativeTime(doubt.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className={`border-[#2a2a3e] ${isBookmarked ? 'text-blue-400 border-blue-500/50' : 'text-slate-300 hover:text-blue-400 hover:border-blue-500/50'}`}
                  onClick={handleBookmark}
                >
                  {isBookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  onClick={handleGetHint}
                  disabled={isGettingHint}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGettingHint ? 'Getting Hint...' : 'AI Hint'}
                </Button>
              </div>
            </div>

          {aiHint && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-200">
                <Sparkles className="h-4 w-4 inline mr-2" />
                {aiHint}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Answers ({doubt.answers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {doubt.answers?.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No answers yet. Be the first to help!</p>
          ) : (
            doubt.answers?.map((answer) => (
              <div
                key={answer._id}
                className={`p-4 rounded-lg ${
                  doubt.acceptedAnswer === answer._id
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-[#12121a] border border-[#2a2a3e]'
                }`}
              >
                {doubt.acceptedAnswer === answer._id && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-3">
                    <Check className="h-3 w-3 mr-1" />
                    Accepted Answer
                  </Badge>
                )}
                <p className="text-slate-300 mb-4">{answer.text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={getAvatarUrl(answer.author?.avatar)} />
                      <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs">
                        {getInitials(answer.author?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-400">{answer.author?.name || 'Unknown'}</span>
                    <span className="text-xs text-slate-500">{formatRelativeTime(answer.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-blue-400"
                      onClick={() => handleUpvote(answer._id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {answer.upvotes?.length || 0}
                    </Button>
                    {isAuthor && !doubt.acceptedAnswer && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-emerald-400"
                        onClick={() => handleAccept(answer._id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="space-y-3 pt-4 border-t border-[#2a2a3e]">
            <Label className="text-white">Your Answer</Label>
            <Textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer..."
              className="bg-[#12121a] border-[#2a2a3e] text-white min-h-[120px]"
            />
            <Button
              onClick={handleAnswer}
              disabled={isAnswering || !answerContent}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
            >
              {isAnswering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Post Answer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
