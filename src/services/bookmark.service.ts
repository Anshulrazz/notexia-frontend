import api from './api'

export interface Bookmark {
  _id: string
  user: string
  itemType: 'note' | 'doubt' | 'blog'
  itemId: string
  item?: {
    _id: string
    title: string
    author?: {
      _id: string
      name: string
      avatar?: string
    }
    subject?: string
    tags?: string[]
    createdAt: string
  }
  createdAt: string
}

export interface BookmarkResponse {
  success: boolean
  data: Bookmark[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const bookmarkService = {
  getAll: async (type?: string): Promise<BookmarkResponse> => {
    const params = type && type !== 'all' ? { type } : {}
    const response = await api.get('/bookmarks', { params })
    return response.data
  },

  add: async (itemType: 'note' | 'doubt' | 'blog', itemId: string): Promise<{ success: boolean; data: Bookmark }> => {
    const response = await api.post('/bookmarks', { itemType, itemId })
    return response.data
  },

  remove: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/bookmarks/${id}`)
    return response.data
  },

  check: async (itemType: string, itemId: string): Promise<{ success: boolean; isBookmarked: boolean; bookmarkId?: string }> => {
    const response = await api.get(`/bookmarks/check/${itemType}/${itemId}`)
    return response.data
  },
}
