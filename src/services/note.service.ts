import api from './api'

export interface NoteFile {
  filename: string
  path: string
  mimetype: string
  size: number
}

export interface NoteComment {
  user: {
    name: string
  }
  text: string
  createdAt: string
}

export interface Note {
  _id: string
  id?: string
  title: string
  description?: string
  subject?: string
  type: 'note' | 'project'
  file: NoteFile
  uploader: {
    _id?: string
    id?: string
    name: string
    college?: string
  }
  author?: {
    _id?: string
    id?: string
    name: string
    avatar?: string
    college?: string
  }
  likes: string[]
  comments: NoteComment[]
  downloads: number
  tags: string[]
  createdAt: string
  updatedAt?: string
}

interface CreateNotePayload {
  title: string
  description?: string
  subject?: string
  tags: string[]
  type: 'note' | 'project'
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

interface CommentResponse {
  success: boolean
  comments: NoteComment[]
}

interface DownloadResponse {
  success: boolean
  downloads: number
}

export const noteService = {
  async getNotes(params?: { subject?: string; search?: string; type?: string }): Promise<Note[]> {
    const { data } = await api.get('/notes', { params })
    if (Array.isArray(data)) return data
    if (data.notes) return data.notes
    if (data.data) return data.data
    return []
  },

  async getNote(noteId: string): Promise<Note> {
    const { data } = await api.get(`/notes/${noteId}`)
    return data.note || data
  },

  async createNote(payload: CreateNotePayload): Promise<NoteResponse> {
    const formData = new FormData()
    formData.append('note', payload.file)
    formData.append('title', payload.title)
    formData.append('type', payload.type)
    if (payload.description) formData.append('description', payload.description)
    if (payload.subject) formData.append('subject', payload.subject)
    if (payload.tags.length > 0) formData.append('tags', payload.tags.join(','))

    const { data } = await api.post('/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return {
      success: data.success,
      note: data.note,
    }
  },

  async updateNote(noteId: string, payload: { title?: string; subject?: string; tags?: string[] }): Promise<NoteResponse> {
    const { data } = await api.put(`/notes/${noteId}`, payload)
    return {
      success: data.success,
      note: data.data?.note || data.note,
    }
  },

  async deleteNote(noteId: string): Promise<{ success: boolean }> {
    const { data } = await api.delete(`/notes/${noteId}`)
    return { success: data.success }
  },

  async likeNote(noteId: string): Promise<LikeResponse> {
    const { data } = await api.post(`/notes/${noteId}/like`)
    return {
      success: data.success,
      likes: data.likes,
    }
  },

  async addComment(noteId: string, text: string): Promise<CommentResponse> {
    const { data } = await api.post(`/notes/${noteId}/comment`, { text })
    return {
      success: data.success,
      comments: data.comments,
    }
  },

  async downloadNote(noteId: string): Promise<DownloadResponse> {
    const { data } = await api.post(`/notes/${noteId}/download`)
    return {
      success: data.success,
      downloads: data.downloads,
    }
  },
}
