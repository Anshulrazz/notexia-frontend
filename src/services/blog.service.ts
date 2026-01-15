import api from './api'

export interface Blog {
  _id: string
  id?: string
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  author: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  likes: string[]
  views: number
  tags: string
  createdAt: string
  updatedAt?: string
}

interface CreateBlogPayload {
  title: string
  content: string
  tags: string
}

interface BlogResponse {
  success: boolean
  blog: Blog
}

export const blogService = {
  async getBlogs(params?: { tag?: string; search?: string }): Promise<Blog[]> {
    const { data } = await api.get('/api/blogs', { params })
    if (Array.isArray(data)) return data
    if (data.blogs) return data.blogs
    if (data.data) return data.data
    return []
  },

  async getBlog(blogId: string): Promise<Blog> {
    const { data } = await api.get(`/api/blogs/${blogId}`)
    return data.blog || data
  },

  async createBlog(payload: CreateBlogPayload): Promise<BlogResponse> {
    const { data } = await api.post('/api/blogs', payload)
    return {
      success: data.success,
      blog: data.blog,
    }
  },

  async likeBlog(blogId: string): Promise<void> {
    await api.post(`/api/blogs/${blogId}/like`)
  },
}
