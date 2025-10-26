import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../api/apiSlice'
import { authService, type LoginCredentials, type SignupData } from '@/services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser()
      return { user, token: authService.getToken() }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user')
    }
  }
)

export const handleOAuthCallback = createAsyncThunk(
  'auth/oauthCallback',
  async ({ code, state }: { code: string; state?: string }, { rejectWithValue }) => {
    try {
      const response = await authService.handleOAuthCallback(code, state)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OAuth callback failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      // Call auth service logout
      authService.logout()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        // Also store in localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token)
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload as string
        // Clear any stored tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      })
    
    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        // Also store in localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token)
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload as string
        // Clear any stored tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      })
    
    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token || null
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
    
    // OAuth callback
    builder
      .addCase(handleOAuthCallback.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(handleOAuthCallback.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(handleOAuthCallback.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload as string
      })
  },
})

export const { setCredentials, logout, clearError } = authSlice.actions

export default authSlice.reducer