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

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, statsData] = await Promise.all([
          adminService.getUsers(),
          adminService.getStats(),
        ])
        setUsers(usersData)
        setStats(statsData)
      } catch {
        toast.error('Failed to load admin data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
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
      setUsers((prev) => prev.map((u) => (u._id === userId ? user : u)))
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
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{user.name}</p>
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
