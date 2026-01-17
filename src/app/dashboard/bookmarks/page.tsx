'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, FileText, HelpCircle, BookOpen, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatRelativeTime, getInitials, getAvatarUrl } from '@/utils/helpers'
import { bookmarkService, Bookmark as BookmarkType } from '@/services/bookmark.service'
import { toast } from 'sonner'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadBookmarks()
  }, [activeTab])

  const loadBookmarks = async () => {
    setIsLoading(true)
    try {
      const response = await bookmarkService.getAll(activeTab, 1, 20)
      setBookmarks(response.data || [])
    } catch {
      setBookmarks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveBookmark = async (id: string) => {
    try {
      await bookmarkService.remove(id)
      setBookmarks((prev) => prev.filter((b) => b._id !== id))
      toast.success('Bookmark removed')
    } catch {
      toast.error('Failed to remove bookmark')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'note': return <FileText className="h-4 w-4" />
      case 'doubt': return <HelpCircle className="h-4 w-4" />
      case 'blog': return <BookOpen className="h-4 w-4" />
      default: return <Bookmark className="h-4 w-4" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'note': return 'from-violet-500 to-fuchsia-500'
      case 'doubt': return 'from-blue-500 to-cyan-500'
      case 'blog': return 'from-emerald-500 to-teal-500'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const getHref = (bookmark: BookmarkType) => {
    switch (bookmark.itemType) {
      case 'note': return `/dashboard/notes/${bookmark.itemId}`
      case 'doubt': return `/dashboard/doubts/${bookmark.itemId}`
      case 'blog': return `/dashboard/blogs/${bookmark.itemId}`
      default: return '#'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-violet-400" />
          Bookmarks
        </h1>
        <p className="text-slate-400 mt-1">Your saved notes, doubts, and blogs</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#1e1e2e] border border-[#2a2a3e]">
          <TabsTrigger value="all" className="data-[state=active]:bg-violet-500/20">All</TabsTrigger>
          <TabsTrigger value="note" className="data-[state=active]:bg-violet-500/20">Notes</TabsTrigger>
          <TabsTrigger value="doubt" className="data-[state=active]:bg-violet-500/20">Doubts</TabsTrigger>
          <TabsTrigger value="blog" className="data-[state=active]:bg-violet-500/20">Blogs</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No bookmarks found</p>
              <p className="text-slate-500 text-sm mt-1">Save items to access them quickly later</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark._id} className="bg-[#1e1e2e] border-[#2a2a3e] hover:border-violet-500/50 transition-colors group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${getColor(bookmark.itemType)} flex items-center justify-center`}>
                        {getIcon(bookmark.itemType)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveBookmark(bookmark._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Badge variant="secondary" className="mb-2 capitalize bg-slate-500/10 text-slate-400 border-slate-500/30">
                      {bookmark.itemType}
                    </Badge>

                    <Link href={getHref(bookmark)}>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-violet-400 transition-colors">
                        {bookmark.item?.title || 'Untitled'}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {bookmark.item?.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-[#2a2a3e] text-slate-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-[#2a2a3e]">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={getAvatarUrl(bookmark.item?.author?.avatar)} />
                        <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs">
                          {getInitials(bookmark.item?.author?.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-white">{bookmark.item?.author?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{formatRelativeTime(bookmark.item?.createdAt || bookmark.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
