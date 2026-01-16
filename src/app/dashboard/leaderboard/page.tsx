'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Crown, TrendingUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getInitials, getAvatarUrl } from '@/utils/helpers'
import { leaderboardService, LeaderboardUser } from '@/services/leaderboard.service'

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all')

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

  const topThree = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Leaderboard
        </h1>
        <p className="text-slate-400 mt-1">Top contributors in the community</p>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as 'all' | 'month' | 'week')} className="w-full">
        <TabsList className="bg-[#1e1e2e] border border-[#2a2a3e]">
          <TabsTrigger value="all" className="data-[state=active]:bg-violet-500/20">All Time</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-violet-500/20">This Month</TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-violet-500/20">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No leaderboard data available</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {topThree.map((user) => (
                  <Card key={user._id} className={`${getRankBg(user.rank)} border relative overflow-hidden`}>
                    {user.rank === 1 && (
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl" />
                    )}
                    <CardContent className="p-6 text-center relative">
                      <div className="flex justify-center mb-4">
                        {getRankIcon(user.rank)}
                      </div>
                      <Avatar className="h-16 w-16 mx-auto mb-4 ring-4 ring-violet-500/20">
                        <AvatarImage src={getAvatarUrl(user.avatar)} />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xl font-bold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold text-white mb-1">{user.name}</h3>
                      <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 mb-4">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {user.points.toLocaleString()} points
                      </Badge>
                      <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-[#2a2a3e]">
                        <div>
                          <p className="text-lg font-bold text-white">{user.stats?.notesCount || 0}</p>
                          <p className="text-xs text-slate-500">Notes</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">{user.stats?.doubtsAnswered || 0}</p>
                          <p className="text-xs text-slate-500">Answers</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">{user.stats?.blogsCount || 0}</p>
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
                        <div key={user._id} className="flex items-center justify-between p-4 hover:bg-[#12121a] transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-8 text-center">
                              {getRankIcon(user.rank)}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={getAvatarUrl(user.avatar)} />
                              <AvatarFallback className="bg-violet-500/20 text-violet-400">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-xs text-slate-500">
                                {user.stats?.notesCount || 0} notes • {user.stats?.doubtsAnswered || 0} answers • {user.stats?.blogsCount || 0} blogs
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/30">
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
