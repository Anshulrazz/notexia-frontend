import api from './api'

export interface Blog {
  _id: string
  id?: string
  title: string
  content: string
  excerpt?: string
  tags: string[]
  author: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  published: boolean
  likes: string[]
  views: number
  createdAt: string
  updatedAt?: string
}

interface CreateBlogPayload {
  title: string
  content: string
  tags?: string
  published?: boolean
}

interface BlogResponse {
  success: boolean
  blog: Blog
}

interface LikeResponse {
  success: boolean
  likes: number
}

export const blogService = {
  async getBlogs(params?: { tag?: string; search?: string }): Promise<Blog[]> {
    const { data } = await api.get('/blogs', { params })
    if (Array.isArray(data)) return data
    if (data.blogs) return data.blogs
    if (data.data) return data.data
    return []
  },

  async getBlog(blogId: string): Promise<Blog> {
    const { data } = await api.get(`/blogs/${blogId}`)
    return data.blog || data
  },

  async createBlog(payload: CreateBlogPayload): Promise<BlogResponse> {
    const { data } = await api.post('/blogs', payload)
    return {
      success: data.success,
      blog: data.blog,
    }
  },

  async updateBlog(blogId: string, payload: { title?: string; content?: string; tags?: string[] | string }): Promise<BlogResponse> {
    const { data } = await api.put(`/blogs/${blogId}`, payload)
    return {
      success: data.success,
      blog: data.data?.blog || data.blog,
    }
  },

  async deleteBlog(blogId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/blogs/${blogId}`)
    return { success: data.success }
  },

  async likeBlog(blogId: string): Promise<LikeResponse> {
    const { data } = await api.post(`/blogs/${blogId}/like`)
    return {
      success: data.success,
      likes: data.likes,
    }
  },
}
