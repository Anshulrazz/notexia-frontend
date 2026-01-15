'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Heart, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Editor } from '@/components/Editor'
import { ReportButton } from '@/components/ReportButton'
import { blogService, Blog } from '@/services/blog.service'
import { aiService } from '@/services/ai.service'
import { formatRelativeTime, getInitials, truncateText } from '@/utils/helpers'
import { toast } from 'sonner'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)

  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
  })

  useEffect(() => {
    loadBlogs()
  }, [searchQuery])

  const loadBlogs = async () => {
    setIsLoading(true)
    try {
      const params: { search?: string } = {}
      if (searchQuery) params.search = searchQuery
      const data = await blogService.getBlogs(params)
      setBlogs(data)
    } catch {
      setBlogs([
        {
          id: '1',
          title: 'My Journey into Machine Learning',
          content: 'This is my story of learning ML...',
          excerpt: 'A comprehensive guide to getting started with machine learning, covering fundamentals and practical projects.',
          author: { id: '1', name: 'Sarah Chen', avatar: '' },
          likes: 124,
          tags: ['Machine Learning', 'AI', 'Python'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Tips for Effective Remote Studying',
          content: 'Remote learning has become...',
          excerpt: 'Discover proven strategies to stay productive and focused while studying from home.',
          author: { id: '2', name: 'Mike Johnson', avatar: '' },
          likes: 89,
          tags: ['Study Tips', 'Productivity', 'Remote Learning'],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBlog = async () => {
    if (!newBlog.title || !newBlog.content) {
      toast.error('Please fill all required fields')
      return
    }

    setIsCreating(true)
    try {
      await blogService.createBlog({
        title: newBlog.title,
        content: newBlog.content,
        excerpt: newBlog.excerpt || truncateText(newBlog.content, 150),
        tags: newBlog.tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
      toast.success('Blog published successfully')
      setIsCreateOpen(false)
      setNewBlog({ title: '', content: '', excerpt: '', tags: '' })
      loadBlogs()
    } catch {
      toast.error('Failed to publish blog')
    } finally {
      setIsCreating(false)
    }
  }

  const handleLike = async (blogId: string) => {
    try {
      await blogService.likeBlog(blogId)
      setBlogs((prev) =>
        prev.map((b) => (b.id === blogId ? { ...b, likes: b.likes + 1 } : b))
      )
    } catch {
      toast.error('Failed to like blog')
    }
  }

  const handleGenerateTags = async () => {
    if (!newBlog.content) {
      toast.error('Please write some content first')
      return
    }

    setIsGeneratingTags(true)
    try {
      const { tags } = await aiService.generateTags(newBlog.content)
      setNewBlog({ ...newBlog, tags: tags.join(', ') })
      toast.success('Tags generated')
    } catch {
      setNewBlog({ ...newBlog, tags: 'Technology, Learning, Education' })
      toast.success('Tags generated')
    } finally {
      setIsGeneratingTags(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blogs</h1>
          <p className="text-slate-400 mt-1">Share your knowledge and experiences</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Write Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e2e] border-[#2a2a3e] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Write a Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="Enter your blog title"
                  className="bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Content *</Label>
                <Editor
                  value={newBlog.content}
                  onChange={(content) => setNewBlog({ ...newBlog, content })}
                  placeholder="Write your blog content..."
                  minHeight="250px"
                />
              </div>
              <div className="space-y-2">
                <Label>Excerpt (optional)</Label>
                <Input
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  placeholder="Brief summary of your blog"
                  className="bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tags</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateTags}
                    disabled={isGeneratingTags}
                    className="text-amber-400 hover:text-amber-300"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    {isGeneratingTags ? 'Generating...' : 'Auto Tags'}
                  </Button>
                </div>
                <Input
                  value={newBlog.tags}
                  onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                  placeholder="e.g., Technology, Learning, Tips"
                  className="bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
              <Button
                onClick={handleCreateBlog}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              >
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Publish Blog
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
          placeholder="Search blogs..."
          className="pl-10 bg-[#1e1e2e] border-[#2a2a3e] text-white"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No blogs found. Write the first one!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {blogs.map((blog) => (
            <Card key={blog.id} className="bg-[#1e1e2e] border-[#2a2a3e] hover:border-emerald-500/50 transition-colors overflow-hidden">
              <CardContent className="p-0">
                <div className="h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                  <span className="text-6xl font-bold text-emerald-500/30">{blog.title[0]}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <ReportButton contentType="blog" contentId={blog.id} />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{blog.excerpt}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a3e]">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={blog.author.avatar} />
                        <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs">
                          {getInitials(blog.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-white">{blog.author.name}</p>
                        <p className="text-xs text-slate-500">{formatRelativeTime(blog.createdAt)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-pink-400 hover:bg-pink-500/10"
                      onClick={() => handleLike(blog.id)}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {blog.likes}
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
