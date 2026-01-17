import api from './api'

export interface LeaderboardUser {
  _id: string
  name: string
  avatar?: string | null
  points: number
  rank: number
  stats: {
    notesCreated: number
    doubtsCreated: number
    doubtsAnswered: number
    blogsCreated: number
    forumThreads: number
  }
}

export interface LeaderboardResponse {
  success: boolean
  data: LeaderboardUser[]
  period: 'all' | 'month' | 'week'
}

export interface MyRankResponse {
  success: boolean
  data: {
    rank: number
    points: number
  }
}

export const leaderboardService = {
  getLeaderboard: async (period: 'all' | 'month' | 'week' = 'all', limit: number = 50): Promise<LeaderboardResponse> => {
    const response = await api.get('/leaderboard', { params: { period, limit } })
    return response.data
  },

  getMyRank: async (): Promise<MyRankResponse> => {
    const response = await api.get('/leaderboard/me')
    return response.data
  },
}
