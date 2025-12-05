import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Forward declaration - will be properly imported from store
interface RootState {
  auth: {
    token: string | null
  }
}

// Define base types from your backend API
export interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface Sprint {
  id: number
  name: string
  startDate: string
  endDate: string
  backlogItems?: BacklogItem[]
  standups?: Standup[]
}

export interface Standup {
  id: number
  userId: number
  sprintId?: number
  summary: string
  createdAt: string
  user?: User
  blockers?: Blocker[]
}

export interface Blocker {
  id: number
  standupId: number
  description: string
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
  createdAt: string
}

export interface BacklogItem {
  id: number
  title: string
  description?: string
  completed: boolean
  sprintId?: number
  storyPoints?: number
  priority?: 'low' | 'medium' | 'high'
  status?: 'todo' | 'in-progress' | 'done'
  assignee?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface AIInsight {
  type: 'risk' | 'opportunity' | 'recommendation' | 'alert'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  actionItems?: string[]
  confidence: number
  metadata?: Record<string, any>
}

export interface WorkflowJob {
  id: string
  type: string
  status: 'waiting' | 'active' | 'completed' | 'failed'
  data?: any
  result?: any
}

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  credentials: 'include', // Important: send cookies for session-based auth
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    
    // Also check localStorage as fallback
    if (!token && typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        headers.set('authorization', `Bearer ${storedToken}`)
        return headers
      }
    }
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    
    return headers
  },
})

// Base query with error handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)
  
  // Log errors for debugging
  if (result.error) {
    console.error('API Error:', {
      endpoint: typeof args === 'string' ? args : args.url,
      status: result.error.status,
      data: result.error.data,
    })
  }
  
  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Sprint', 'Standup', 'Blocker', 'BacklogItem', 'AIInsight', 'Workflow'],
  endpoints: (builder) => ({}), // Individual endpoints will be injected
})

export const {} = apiSlice