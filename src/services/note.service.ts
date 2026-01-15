import api from './api'

export interface Note {
  _id: string
  id?: string
  title: string
  description?: string
  subject: string
  file: {
    path: string
    filename?: string
  }
  author: {
    _id?: string
    id?: string
    name: string
    avatar?: string
  }
  likes: string[]
  downloads: number
  tags: string[]
  createdAt: string
}

interface CreateNotePayload {
  title: string
  subject: string
  tags: string[]
  file: File
}

interface NoteResponse {
  success: boolean
  note: Note
}

interface LikeResponse {
  success: boolean
  likes: number
}

export const noteService = {
  async getNotes(params?: { subject?: string; search?: string }): Promise<Note[]> {
    const { data } = await api.get('/api/notes', { params })
    if (Array.isArray(data)) return data
    if (data.notes) return data.notes
    if (data.data) return data.data
    return []
  },

  async getNote(noteId: string): Promise<Note> {
    const { data } = await api.get(`/api/notes/${noteId}`)
    return data.note || data
  },

  async createNote(payload: CreateNotePayload): Promise<NoteResponse> {
    const formData = new FormData()
    formData.append('note', payload.file)
    formData.append('title', payload.title)
    formData.append('subject', payload.subject)
    formData.append('tags', payload.tags.join(','))

    const { data } = await api.post('/api/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return {
      success: data.success,
      note: data.note,
    }
  },

  async likeNote(noteId: string): Promise<LikeResponse> {
    const { data } = await api.post(`/api/notes/${noteId}/like`)
    return {
      success: data.success,
      likes: data.likes,
    }
  },

  async downloadNote(noteId: string): Promise<void> {
    await api.post(`/api/notes/${noteId}/download`)
  },

  async updateNote(noteId: string, payload: { title?: string; subject?: string; tags?: string[] }): Promise<NoteResponse> {
    const { data } = await api.put(`/api/notes/${noteId}`, payload)
    return {
      success: data.success,
      note: data.note,
    }
  },

  async deleteNote(noteId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/api/notes/${noteId}`)
    return { success: data.success }
  },
}
