'use client'

import { useState, useEffect, useMemo } from 'react'
import { Trophy, Medal, Crown, TrendingUp, Loader2, Search, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getInitials, getAvatarUrl } from '@/utils/helpers'
import { leaderboardService, LeaderboardUser } from '@/services/leaderboard.service'

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadLeaderboard()
  }, [period])

  const loadLeaderboard = async () => {
    setIsLoading(true)
    try {
      const response = await leaderboardService.getLeaderboard(period)
      setUsers(response.data || [])
    } catch {
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users
    const query = searchQuery.toLowerCase()
    return users.filter(user => user.name.toLowerCase().includes(query))
  }, [users, searchQuery])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-400" />
      case 2: return <Medal className="h-5 w-5 text-slate-300" />
      case 3: return <Medal className="h-5 w-5 text-amber-600" />
      default: return <span className="text-slate-400 font-bold">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
      case 2: return 'bg-gradient-to-r from-slate-400/20 to-slate-500/20 border-slate-400/30'
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30'
      default: return 'bg-[#1e1e2e] border-[#2a2a3e]'
    }
  }

  const topThree = filteredUsers.slice(0, 3)
  const rest = filteredUsers.slice(3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
          Leaderboard
        </h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">Top contributors in the community</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name..."
            className="pl-10 pr-10 bg-[#1e1e2e] border-[#2a2a3e] text-white placeholder:text-slate-500 focus:border-yellow-500/50"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-white"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as 'all' | 'month' | 'week')} className="w-full">
        <TabsList className="bg-[#1e1e2e] border border-[#2a2a3e] w-full sm:w-auto grid grid-cols-3 sm:flex">
          <TabsTrigger value="all" className="data-[state=active]:bg-violet-500/20 text-xs sm:text-sm">All Time</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-violet-500/20 text-xs sm:text-sm">This Month</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-violet-500/20 text-xs sm:text-sm">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
            ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No leaderboard data available</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {topThree.map((user) => (
                  <Card key={user._id} className={`${getRankBg(user.rank)} border relative overflow-hidden`}>
                    {user.rank === 1 && (
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl" />
                    )}
                    <CardContent className="p-4 sm:p-6 text-center relative">
                      <div className="flex justify-center mb-3 sm:mb-4">
                        {getRankIcon(user.rank)}
                      </div>
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 ring-4 ring-violet-500/20">
                        <AvatarImage src={getAvatarUrl(user.avatar)} />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-lg sm:text-xl font-bold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{user.name}</h3>
                      <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 mb-3 sm:mb-4">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {user.points.toLocaleString()} points
                      </Badge>
                        <div className="grid grid-cols-3 gap-2 text-center pt-3 sm:pt-4 border-t border-[#2a2a3e]">
                          <div>
                            <p className="text-base sm:text-lg font-bold text-white">{user.stats?.notesCreated || 0}</p>
                            <p className="text-xs text-slate-500">Notes</p>
                          </div>
                          <div>
                            <p className="text-base sm:text-lg font-bold text-white">{user.stats?.doubtsAnswered || 0}</p>
                            <p className="text-xs text-slate-500">Answers</p>
                          </div>
                          <div>
                            <p className="text-base sm:text-lg font-bold text-white">{user.stats?.blogsCreated || 0}</p>
                            <p className="text-xs text-slate-500">Blogs</p>
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {rest.length > 0 && (
                <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
                  <CardHeader>
                    <CardTitle className="text-white">Rankings</CardTitle>
                  </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-[#2a2a3e]">
                        {rest.map((user) => (
                          <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-[#12121a] transition-colors gap-3">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-8 text-center flex-shrink-0">
                                {getRankIcon(user.rank)}
                              </div>
                              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                <AvatarImage src={getAvatarUrl(user.avatar)} />
                                <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs sm:text-sm">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                                <div className="min-w-0">
                                  <p className="text-white font-medium truncate">{user.name}</p>
                                  <p className="text-xs text-slate-500">
                                    {user.stats?.notesCreated || 0} notes • {user.stats?.doubtsAnswered || 0} answers • {user.stats?.blogsCreated || 0} blogs
                                  </p>
                                </div>
                            </div>
                            <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/30 self-end sm:self-auto">
                              {user.points.toLocaleString()} pts
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
