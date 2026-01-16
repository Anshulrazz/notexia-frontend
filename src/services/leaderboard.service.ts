import api from './api'

export interface LeaderboardUser {
  _id: string
  name: string
  avatar?: string
  points: number
  rank: number
  stats: {
    notesCount: number
    doubtsAnswered: number
    blogsCount: number
  }
}

export interface LeaderboardResponse {
  success: boolean
  data: LeaderboardUser[]
  period: 'all' | 'month' | 'week'
}

export const leaderboardService = {
  getLeaderboard: async (period: 'all' | 'month' | 'week' = 'all'): Promise<LeaderboardResponse> => {
    const response = await api.get('/leaderboard', { params: { period } })
    return response.data
  },

  getMyRank: async (): Promise<{ success: boolean; data: { rank: number; points: number } }> => {
    const response = await api.get('/leaderboard/me')
    return response.data
  },
}
