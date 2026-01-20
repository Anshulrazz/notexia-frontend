'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, HelpCircle, Users, BookOpen, TrendingUp, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'
import { adminService, AdminStats } from '@/services/admin.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, getAvatarUrl } from '@/utils/helpers'
import { formatDistanceToNow } from 'date-fns'

interface ActivityItem {
  id: string
  type: 'note' | 'doubt' | 'forum' | 'blog'
  title: string
  time: string
  timestamp: Date
}

interface SchemaData {
  blogs: Array<{ _id: string; title: string; createdAt: string; author?: { _id: string } }>
  notes: Array<{ _id: string; title: string; createdAt: string; author?: { _id: string } }>
  doubts: Array<{ _id: string; question: string; createdAt: string; author?: { _id: string }; acceptedAnswer?: string | null }>
  forums: Array<{ _id: string; name: string; createdAt: string; createdBy?: { _id: string } }>
}

interface UserProgress {
  notesContribution: number
  doubtsResolved: number
  forumEngagement: number
  blogActivity: number
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [progress, setProgress] = useState<UserProgress>({ notesContribution: 0, doubtsResolved: 0, forumEngagement: 0, blogActivity: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats()
        setStats(data)
      } catch {
        setStats({ totalUsers: 0, totalNotes: 0, totalDoubts: 0, totalBlogs: 0, totalForums: 0 })
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schemas`)
        const result = await response.json()
        if (result.success && result.data) {
          const data: SchemaData = result.data
          const activities: ActivityItem[] = []
          const userId = user?._id

          let userNotes = 0
          let userBlogs = 0
          let userDoubts = 0
          let userResolvedDoubts = 0
          let userForums = 0

          data.blogs?.forEach((blog) => {
            activities.push({
              id: blog._id,
              type: 'blog',
              title: blog.title,
              time: formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }),
              timestamp: new Date(blog.createdAt),
            })
            if (blog.author?._id === userId) userBlogs++
          })

          data.notes?.forEach((note) => {
            activities.push({
              id: note._id,
              type: 'note',
              title: note.title,
              time: formatDistanceToNow(new Date(note.createdAt), { addSuffix: true }),
              timestamp: new Date(note.createdAt),
            })
            if (note.author?._id === userId) userNotes++
          })

          data.doubts?.forEach((doubt) => {
            activities.push({
              id: doubt._id,
              type: 'doubt',
              title: doubt.question,
              time: formatDistanceToNow(new Date(doubt.createdAt), { addSuffix: true }),
              timestamp: new Date(doubt.createdAt),
            })
            if (doubt.author?._id === userId) {
              userDoubts++
              if (doubt.acceptedAnswer) userResolvedDoubts++
            }
          })

          data.forums?.forEach((forum) => {
            activities.push({
              id: forum._id,
              type: 'forum',
              title: forum.name,
              time: formatDistanceToNow(new Date(forum.createdAt), { addSuffix: true }),
              timestamp: new Date(forum.createdAt),
            })
            if (forum.createdBy?._id === userId) userForums++
          })

          activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          setRecentActivity(activities.slice(0, 6))

          const totalNotes = data.notes?.length || 1
          const totalBlogs = data.blogs?.length || 1
          const totalDoubts = data.doubts?.length || 1
          const totalForums = data.forums?.length || 1

          setProgress({
            notesContribution: Math.min(100, Math.round((userNotes / totalNotes) * 100)),
            blogActivity: Math.min(100, Math.round((userBlogs / totalBlogs) * 100)),
            doubtsResolved: userDoubts > 0 ? Math.round((userResolvedDoubts / userDoubts) * 100) : 0,
            forumEngagement: Math.min(100, Math.round((userForums / totalForums) * 100)),
          })
        }
      } catch (error) {
        console.error('Failed to fetch recent activity:', error)
      }
    }
    fetchRecentActivity()
  }, [user?._id])

  const statCards = [
    { label: 'Notes Shared', value: stats?.totalNotes ?? stats?.notes ?? 0, icon: FileText, color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Doubts Asked', value: stats?.totalDoubts ?? stats?.doubts ?? 0, icon: HelpCircle, color: 'from-blue-500 to-cyan-500' },
    { label: 'Forums', value: stats?.totalForums ?? stats?.forums ?? 0, icon: Users, color: 'from-amber-500 to-orange-500' },
    { label: 'Blogs Written', value: stats?.totalBlogs ?? stats?.blogs ?? 0, icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-4 ring-violet-500/20">
          <AvatarImage src={getAvatarUrl(user?.avatar)} alt={user?.name} />
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xl font-bold">
            {getInitials(user?.name || '')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening with your account.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-[#1e1e2e] border-[#2a2a3e]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500 mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  )}
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-violet-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((item) => {
                  const href = item.type === 'note' ? `/dashboard/notes/${item.id}` :
                    item.type === 'doubt' ? `/dashboard/doubts/${item.id}` :
                      item.type === 'forum' ? `/dashboard/forums/${item.id}` :
                        `/dashboard/blogs/${item.id}`
                  return (
                    <Link key={item.id} href={href} className="flex items-center gap-4 p-3 rounded-lg bg-[#12121a] border border-[#2a2a3e] hover:border-violet-500/50 hover:bg-[#1a1a2a] transition-all cursor-pointer">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.type === 'note' ? 'bg-violet-500/10 text-violet-400' :
                          item.type === 'doubt' ? 'bg-blue-500/10 text-blue-400' :
                            item.type === 'forum' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-emerald-500/10 text-emerald-400'
                        }`}>
                        {item.type === 'note' && <FileText className="h-5 w-5" />}
                        {item.type === 'doubt' && <HelpCircle className="h-5 w-5" />}
                        {item.type === 'forum' && <Users className="h-5 w-5" />}
                        {item.type === 'blog' && <BookOpen className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.time}</p>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Your Progress
            </CardTitle>
          </CardHeader>
<CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Notes Contribution</span>
                    <span className="text-white font-medium">{progress.notesContribution}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#12121a]">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${progress.notesContribution}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Doubts Resolved</span>
                    <span className="text-white font-medium">{progress.doubtsResolved}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#12121a]">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500" style={{ width: `${progress.doubtsResolved}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Forum Engagement</span>
                    <span className="text-white font-medium">{progress.forumEngagement}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#12121a]">
                    <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${progress.forumEngagement}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Blog Activity</span>
                    <span className="text-white font-medium">{progress.blogActivity}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#12121a]">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${progress.blogActivity}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
