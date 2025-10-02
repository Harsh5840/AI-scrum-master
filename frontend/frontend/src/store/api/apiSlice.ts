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
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    const token = state.auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Sprint', 'Standup', 'Blocker', 'BacklogItem', 'AIInsight', 'Workflow'],
  endpoints: (builder) => ({}), // Individual endpoints will be injected
})

export const {} = apiSlice