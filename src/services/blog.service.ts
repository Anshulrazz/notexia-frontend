import api from './api'

export interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  coverImage?: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  likes: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface CreateBlogPayload {
  title: string
  content: string
  excerpt: string
  coverImage?: string
  tags: string[]
}

export const blogService = {
  async getBlogs(params?: { tag?: string; search?: string }): Promise<Blog[]> {
    const { data } = await api.get('/api/blogs', { params })
    return data
  },

  async getBlog(blogId: string): Promise<Blog> {
    const { data } = await api.get(`/api/blogs/${blogId}`)
    return data
  },

  async createBlog(payload: CreateBlogPayload): Promise<Blog> {
    const { data } = await api.post('/api/blogs', payload)
    return data
  },

  async likeBlog(blogId: string): Promise<void> {
    await api.post(`/api/blogs/${blogId}/like`)
  },
}
