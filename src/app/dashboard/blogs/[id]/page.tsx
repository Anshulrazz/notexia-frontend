'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Calendar, Eye, Loader2, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ReportButton } from '@/components/ReportButton'
import { blogService, Blog } from '@/services/blog.service'
import { bookmarkService } from '@/services/bookmark.service'
import { aiService } from '@/services/ai.service'
import { formatRelativeTime, getInitials, getAvatarUrl } from '@/utils/helpers'
import { toast } from 'sonner'

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState<string | null>(null)
  const [aiSummary, setAiSummary] = useState('')
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadBlog(params.id as string)
      checkBookmark(params.id as string)
    }
  }, [params.id])

  const loadBlog = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await blogService.getBlog(id)
      setBlog(data)
    } catch {
      toast.error('Failed to load blog')
      router.push('/dashboard/blogs')
    } finally {
      setIsLoading(false)
    }
  }

  const checkBookmark = async (id: string) => {
    try {
      const response = await bookmarkService.check('blog', id)
      setIsBookmarked(response.isBookmarked)
      setBookmarkId(response.bookmarkId)
    } catch {
      setIsBookmarked(false)
    }
  }

  const handleBookmark = async () => {
    if (!blog) return
    try {
      if (isBookmarked && bookmarkId) {
        await bookmarkService.remove(bookmarkId)
        setIsBookmarked(false)
        setBookmarkId(null)
        toast.success('Bookmark removed')
      } else {
        const response = await bookmarkService.add('blog', blog._id)
        setIsBookmarked(true)
        setBookmarkId(response.data._id)
        toast.success('Bookmarked!')
      }
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  const handleLike = async () => {
    if (!blog) return
    try {
      await blogService.likeBlog(blog._id)
      setBlog((prev) => prev ? { ...prev, likes: [...prev.likes, 'user'] } : null)
      toast.success('Liked!')
    } catch {
      toast.error('Failed to like blog')
    }
  }

  const handleGenerateSummary = async () => {
    if (!blog) return
    setIsGeneratingSummary(true)
    try {
      const response = await aiService.getBlogSummary(blog.content)
      setAiSummary(response.summary)
    } catch {
      toast.error('Failed to generate summary')
    } finally {
      setIsGeneratingSummary(false)
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

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Blog not found</p>
        <Button variant="ghost" onClick={() => router.push('/dashboard/blogs')} className="mt-4 text-violet-400">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.push('/dashboard/blogs')} className="text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blogs
      </Button>

      <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
        <span className="text-8xl font-bold text-emerald-500/30">{blog.title[0]}</span>
      </div>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-wrap gap-2 mb-4">
              {parseTags(blog.tags).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  {tag}
                </Badge>
              ))}
            </div>
            <ReportButton contentType="blog" contentId={blog._id} />
          </div>
          <CardTitle className="text-3xl text-white">{blog.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between py-4 border-t border-b border-[#2a2a3e]">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatarUrl(blog.author?.avatar)} />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                  {getInitials(blog.author?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{blog.author?.name || 'Unknown'}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatRelativeTime(blog.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {blog.views || 0} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-pink-400" />
                {blog.likes?.length || 0} likes
              </span>
            </div>
          </div>

          <div
            className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

              <div className="flex items-center justify-end gap-2 pt-6 border-t border-[#2a2a3e]">
                <Button
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGeneratingSummary ? 'Generating...' : 'AI Summary'}
                </Button>
                <Button
                  variant="outline"
                  className={`border-[#2a2a3e] ${isBookmarked ? 'text-emerald-400 border-emerald-500/50' : 'text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50'}`}
                  onClick={handleBookmark}
                >
                  {isBookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                  {isBookmarked ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                  onClick={handleLike}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Like ({blog.likes?.length || 0})
                </Button>
              </div>

            {aiSummary && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">AI Summary</span>
                </div>
                <p className="text-sm text-amber-200">{aiSummary}</p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
