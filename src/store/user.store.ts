import { create } from 'zustand'

interface UserStats {
  notesCount: number
  doubtsCount: number
  answersCount: number
  blogsCount: number
}

interface UserState {
  stats: UserStats | null
  setStats: (stats: UserStats) => void
  clearStats: () => void
}

export const useUserStore = create<UserState>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
  clearStats: () => set({ stats: null }),
}))
