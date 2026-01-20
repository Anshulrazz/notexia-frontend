'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, Ban, Search, Loader2, FileText, HelpCircle, BookOpen, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { getInitials, getAvatarUrl } from '@/utils/helpers'
import { toast } from 'sonner'
import { adminService, AdminUser, AdminStats } from '@/services/admin.service'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'

interface SchemaData {
  blogs: Array<{ _id: string; createdAt: string }>
  notes: Array<{ _id: string; createdAt: string }>
  doubts: Array<{ _id: string; createdAt: string; isResolved?: boolean }>
  forums: Array<{ _id: string; createdAt: string }>
}

interface ContentTrend {
  month: string
  notes: number
  blogs: number
  doubts: number
  forums: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [contentTrends, setContentTrends] = useState<ContentTrend[]>([])
  const [pieData, setPieData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [doubtsData, setDoubtsData] = useState<Array<{ name: string; value: number; color: string }>>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, statsData] = await Promise.all([
          adminService.getUsers(),
          adminService.getStats(),
        ])
        setUsers(usersData)
        setStats(statsData)

        setPieData([
          { name: 'Notes', value: statsData?.notes ?? 0, color: '#8b5cf6' },
          { name: 'Blogs', value: statsData?.blogs ?? 0, color: '#10b981' },
          { name: 'Doubts', value: statsData?.doubts ?? 0, color: '#3b82f6' },
          { name: 'Forums', value: statsData?.forums ?? 0, color: '#f59e0b' },
        ])
      } catch {
        toast.error('Failed to load admin data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchSchemaData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schemas`)
        const result = await response.json()
        if (result.success && result.data) {
          const data: SchemaData = result.data
          const monthlyData: Record<string, ContentTrend> = {}
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          
          const currentYear = new Date().getFullYear()
          months.forEach((m) => {
            monthlyData[m] = { month: m, notes: 0, blogs: 0, doubts: 0, forums: 0 }
          })

          let resolvedDoubts = 0
          let unresolvedDoubts = 0

          data.notes?.forEach((item) => {
            const date = new Date(item.createdAt)
            if (date.getFullYear() === currentYear) {
              const month = months[date.getMonth()]
              monthlyData[month].notes++
            }
          })

          data.blogs?.forEach((item) => {
            const date = new Date(item.createdAt)
            if (date.getFullYear() === currentYear) {
              const month = months[date.getMonth()]
              monthlyData[month].blogs++
            }
          })

          data.doubts?.forEach((item) => {
            const date = new Date(item.createdAt)
            if (date.getFullYear() === currentYear) {
              const month = months[date.getMonth()]
              monthlyData[month].doubts++
            }
            if (item.isResolved) resolvedDoubts++
            else unresolvedDoubts++
          })

          data.forums?.forEach((item) => {
            const date = new Date(item.createdAt)
            if (date.getFullYear() === currentYear) {
              const month = months[date.getMonth()]
              monthlyData[month].forums++
            }
          })

          setContentTrends(months.map((m) => monthlyData[m]))
          setDoubtsData([
            { name: 'Resolved', value: resolvedDoubts, color: '#10b981' },
            { name: 'Unresolved', value: unresolvedDoubts, color: '#ef4444' },
          ])
        }
      } catch (error) {
        console.error('Failed to fetch schema data:', error)
      }
    }
    fetchSchemaData()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  const handleRoleChange = async (userId: string, role: 'student' | 'admin') => {
    try {
      const { user } = await adminService.changeUserRole(userId, role)
      setUsers((prev) => prev.map((u) => (u._id === userId ? user : u)))
      toast.success('Role updated successfully')
    } catch {
      toast.error('Failed to update role')
    }
  }

  const handleToggleBan = async (userId: string) => {
    try {
      const { user } = await adminService.toggleBanUser(userId)
      if (user) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? user : u)))
      } else {
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isBanned: !u.isBanned } : u)))
      }
      toast.success('User status updated')
    } catch {
      toast.error('Failed to update user status')
    }
  }

  const statCards = [
    { label: 'Total Users', value: stats?.users ?? 0, icon: Users, color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Notes', value: stats?.notes ?? 0, icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Doubts', value: stats?.doubts ?? 0, icon: HelpCircle, color: 'from-amber-500 to-orange-500' },
    { label: 'Blogs', value: stats?.blogs ?? 0, icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
    { label: 'Forums', value: stats?.forums ?? 0, icon: Shield, color: 'from-pink-500 to-rose-500' },
    { label: 'Reports', value: stats?.reports ?? 0, icon: Flag, color: 'from-red-500 to-orange-500' },
  ]

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 mt-1">Manage users and platform settings</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="bg-[#1e1e2e] border-[#2a2a3e]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-violet-500 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    )}
                  </div>
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
            <CardHeader>
              <CardTitle className="text-white">Content Trends (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={contentTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="notes" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
                    <Line type="monotone" dataKey="blogs" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                    <Line type="monotone" dataKey="doubts" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    <Line type="monotone" dataKey="forums" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
            <CardHeader>
              <CardTitle className="text-white">Content Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
            <CardHeader>
              <CardTitle className="text-white">Content by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pieData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
            <CardHeader>
              <CardTitle className="text-white">Doubts Resolution Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={doubtsData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {doubtsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #2a2a3e', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-white">User Management</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 bg-[#12121a] border-[#2a2a3e] text-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No users found</div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#12121a] border border-[#2a2a3e]"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getAvatarUrl(user.avatar)} />
                        <AvatarFallback className="bg-violet-500/20 text-violet-400">
                          {getInitials(user.name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{user.name || 'Unknown'}</p>
                          {user.isBanned && (
                            <Badge variant="destructive" className="text-xs">Banned</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={user.isVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>

                      <Select value={user.role} onValueChange={(v) => handleRoleChange(user._id, v as 'student' | 'admin')}>
                        <SelectTrigger className="w-[100px] h-8 bg-[#1e1e2e] border-[#2a2a3e] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                          <SelectItem value="student" className="text-white hover:bg-[#2a2a3e]">Student</SelectItem>
                          <SelectItem value="admin" className="text-white hover:bg-[#2a2a3e]">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleBan(user._id)}
                        className={user.isBanned ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
