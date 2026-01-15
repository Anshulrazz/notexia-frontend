'use client'

import { FileText, HelpCircle, Users, BookOpen, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'

const stats = [
  { label: 'Notes Shared', value: '24', icon: FileText, color: 'from-violet-500 to-fuchsia-500' },
  { label: 'Doubts Asked', value: '12', icon: HelpCircle, color: 'from-blue-500 to-cyan-500' },
  { label: 'Forums Joined', value: '5', icon: Users, color: 'from-amber-500 to-orange-500' },
  { label: 'Blogs Written', value: '8', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
]

const recentActivity = [
  { type: 'note', title: 'Data Structures Notes', time: '2 hours ago' },
  { type: 'doubt', title: 'How to implement BST?', time: '5 hours ago' },
  { type: 'forum', title: 'Joined CS Study Group', time: '1 day ago' },
  { type: 'blog', title: 'My Learning Journey', time: '2 days ago' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#1e1e2e] border-[#2a2a3e]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
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
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-[#12121a] border border-[#2a2a3e]">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    item.type === 'note' ? 'bg-violet-500/10 text-violet-400' :
                    item.type === 'doubt' ? 'bg-blue-500/10 text-blue-400' :
                    item.type === 'forum' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {item.type === 'note' && <FileText className="h-5 w-5" />}
                    {item.type === 'doubt' && <HelpCircle className="h-5 w-5" />}
                    {item.type === 'forum' && <Users className="h-5 w-5" />}
                    {item.type === 'blog' && <BookOpen className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
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
                  <span className="text-white font-medium">75%</span>
                </div>
                <div className="h-2 rounded-full bg-[#12121a]">
                  <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Doubts Resolved</span>
                  <span className="text-white font-medium">60%</span>
                </div>
                <div className="h-2 rounded-full bg-[#12121a]">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Forum Engagement</span>
                  <span className="text-white font-medium">45%</span>
                </div>
                <div className="h-2 rounded-full bg-[#12121a]">
                  <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Blog Activity</span>
                  <span className="text-white font-medium">80%</span>
                </div>
                <div className="h-2 rounded-full bg-[#12121a]">
                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
