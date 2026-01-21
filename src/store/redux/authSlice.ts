import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

export interface User {
  id: string
  _id?: string
  email: string
  name: string
  avatar?: string
  role: 'student' | 'admin'
  college?: string
  branch?: string
  year?: number
  isVerified: boolean
  createdAt?: string
}

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
}

const COOKIE_NAME = 'notexia-auth'
const COOKIE_EXPIRES = 7

const loadFromCookie = (): { token: string | null; user: User | null } => {
  if (typeof window === 'undefined') return { token: null, user: null }
  const cookieValue = Cookies.get(COOKIE_NAME)
  if (cookieValue) {
    try {
      const parsed = JSON.parse(cookieValue)
      return { token: parsed.token || null, user: parsed.user || null }
    } catch {
      return { token: null, user: null }
    }
  }
  return { token: null, user: null }
}

const saveToCookie = (token: string | null, user: User | null) => {
  if (typeof window === 'undefined') return
  if (token && user) {
    Cookies.set(COOKIE_NAME, JSON.stringify({ token, user }), {
      expires: COOKIE_EXPIRES,
      sameSite: 'Lax',
      path: '/',
    })
  } else {
    Cookies.remove(COOKIE_NAME, { path: '/' })
  }
}

const initialState: AuthState = {
  ...loadFromCookie(),
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isLoading = false
      saveToCookie(action.payload.token, action.payload.user)
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      saveToCookie(state.token, action.payload)
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isLoading = false
      saveToCookie(null, null)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    hydrateFromCookie: (state) => {
      const { token, user } = loadFromCookie()
      state.token = token
      state.user = user
      state.isLoading = false
    },
  },
})

export const { setCredentials, setUser, logout, setLoading, hydrateFromCookie } = authSlice.actions
export default authSlice.reducer
