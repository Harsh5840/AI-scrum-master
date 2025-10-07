import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('auth_token')
      Cookies.remove('refresh_token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
    createdAt: string
  }
  token: string
  refreshToken?: string
}

export const authService = {
  // Login with email/password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials)
    const { user, token, refreshToken } = response.data
    
    // Store tokens in cookies
    Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' })
    if (refreshToken) {
      Cookies.set('refresh_token', refreshToken, { expires: 30, secure: true, sameSite: 'strict' })
    }
    
    return response.data
  },

  // Register new user
  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData)
    const { user, token, refreshToken } = response.data
    
    // Store tokens in cookies
    Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' })
    if (refreshToken) {
      Cookies.set('refresh_token', refreshToken, { expires: 30, secure: true, sameSite: 'strict' })
    }
    
    return response.data
  },

  // Google OAuth login
  async googleLogin(): Promise<string> {
    // Return the Google OAuth URL from your backend
    const response = await apiClient.get('/auth/google/url')
    return response.data.url
  },

  // Handle OAuth callback
  async handleOAuthCallback(code: string, state?: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/google/callback', { code, state })
    const { user, token, refreshToken } = response.data
    
    // Store tokens in cookies
    Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' })
    if (refreshToken) {
      Cookies.set('refresh_token', refreshToken, { expires: 30, secure: true, sameSite: 'strict' })
    }
    
    return response.data
  },

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = Cookies.get('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    const { user, token: newToken, refreshToken: newRefreshToken } = response.data
    
    // Update tokens
    Cookies.set('auth_token', newToken, { expires: 7, secure: true, sameSite: 'strict' })
    if (newRefreshToken) {
      Cookies.set('refresh_token', newRefreshToken, { expires: 30, secure: true, sameSite: 'strict' })
    }
    
    return response.data
  },

  // Get current user
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error)
    } finally {
      // Remove tokens from cookies
      Cookies.remove('auth_token')
      Cookies.remove('refresh_token')
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!Cookies.get('auth_token')
  },

  // Get stored token
  getToken(): string | undefined {
    return Cookies.get('auth_token')
  }
}

export default apiClient