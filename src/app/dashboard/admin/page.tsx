'use client'

import { useState } from 'react'
import { Users, Shield, Ban, CheckCircle, Search, Loader2 } from 'lucide-react'
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
import { getInitials } from '@/utils/helpers'
import { toast } from 'sonner'

interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
  isVerified: boolean
  isBlocked: boolean
  createdAt: string
}

const mockUsers: AdminUser[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', isVerified: true, isBlocked: false, createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', isVerified: true, isBlocked: false, createdAt: '2024-02-20' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', isVerified: false, isBlocked: false, createdAt: '2024-03-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'user', isVerified: true, isBlocked: true, createdAt: '2024-03-25' },
]

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRoleChange = (userId: string, role: 'user' | 'admin') => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)))
    toast.success('Role updated successfully')
  }

  const handleVerify = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isVerified: true } : u)))
    toast.success('User verified')
  }

  const handleToggleBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    )
    toast.success('User status updated')
  }

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Verified', value: users.filter((u) => u.isVerified).length, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
    { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, icon: Shield, color: 'from-amber-500 to-orange-500' },
    { label: 'Blocked', value: users.filter((u) => u.isBlocked).length, icon: Ban, color: 'from-red-500 to-pink-500' },
  ]

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 mt-1">Manage users and platform settings</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-[#1e1e2e] border-[#2a2a3e]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
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
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#12121a] border border-[#2a2a3e]"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-violet-500/20 text-violet-400">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{user.name}</p>
                          {user.isBlocked && (
                            <Badge variant="destructive" className="text-xs">Blocked</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={user.isVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>

                      <Select value={user.role} onValueChange={(v) => handleRoleChange(user.id, v as 'user' | 'admin')}>
                        <SelectTrigger className="w-[100px] h-8 bg-[#1e1e2e] border-[#2a2a3e] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                          <SelectItem value="user" className="text-white hover:bg-[#2a2a3e]">User</SelectItem>
                          <SelectItem value="admin" className="text-white hover:bg-[#2a2a3e]">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      {!user.isVerified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerify(user.id)}
                          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleBlock(user.id)}
                        className={user.isBlocked ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        {user.isBlocked ? 'Unblock' : 'Block'}
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
