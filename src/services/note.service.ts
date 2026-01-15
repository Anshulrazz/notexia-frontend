import api from './api'

export interface Note {
  id: string
  title: string
  description: string
  subject: string
  fileUrl: string
  fileName: string
  fileType: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  likes: number
  downloads: number
  comments: Comment[]
  tags: string[]
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
}

interface CreateNotePayload {
  title: string
  description: string
  subject: string
  tags: string[]
  file: File
}

export const noteService = {
  async getNotes(params?: { subject?: string; search?: string }): Promise<Note[]> {
    const { data } = await api.get('/api/notes', { params })
    return Array.isArray(data) ? data : data?.notes || data?.data || []
  },

  async createNote(payload: CreateNotePayload): Promise<Note> {
    const formData = new FormData()
    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('subject', payload.subject)
    formData.append('tags', JSON.stringify(payload.tags))
    formData.append('file', payload.file)

    const { data } = await api.post('/api/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  async likeNote(noteId: string): Promise<void> {
    await api.post(`/api/notes/${noteId}/like`)
  },

  async addComment(noteId: string, content: string): Promise<Comment> {
    const { data } = await api.post(`/api/notes/${noteId}/comment`, { content })
    return data
  },

  async downloadNote(noteId: string): Promise<void> {
    await api.post(`/api/notes/${noteId}/download`)
  },
}
