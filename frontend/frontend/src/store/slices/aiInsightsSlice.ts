import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AIInsight, WorkflowJob } from '../api/apiSlice'

interface SprintInsights {
  sprintId: number
  healthScore: number
  riskScore: number
  velocityTrend: number
  completionProbability: number
  insights: AIInsight[]
  lastUpdated: string
}

interface TeamInsights {
  activeMembers: number
  totalStandups: number
  totalBlockers: number
  averageVelocity: number
  insights: AIInsight[]
  lastUpdated: string
}

interface AIInsightsState {
  sprintInsights: Record<number, SprintInsights>
  teamInsights: TeamInsights | null
  workflowJobs: WorkflowJob[]
  queueStatus: {
    aiWorkflows: number
    notifications: number
    analytics: number
  }
  isLoading: boolean
  error: string | null
}

const initialState: AIInsightsState = {
  sprintInsights: {},
  teamInsights: null,
  workflowJobs: [],
  queueStatus: {
    aiWorkflows: 0,
    notifications: 0,
    analytics: 0,
  },
  isLoading: false,
  error: null,
}

const aiInsightsSlice = createSlice({
  name: 'aiInsights',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setSprintInsights: (state, action: PayloadAction<SprintInsights>) => {
      state.sprintInsights[action.payload.sprintId] = action.payload
      state.error = null
    },
    setTeamInsights: (state, action: PayloadAction<TeamInsights>) => {
      state.teamInsights = action.payload
      state.error = null
    },
    addWorkflowJob: (state, action: PayloadAction<WorkflowJob>) => {
      state.workflowJobs.unshift(action.payload)
    },
    updateWorkflowJob: (state, action: PayloadAction<WorkflowJob>) => {
      const index = state.workflowJobs.findIndex(job => job.id === action.payload.id)
      if (index !== -1) {
        state.workflowJobs[index] = action.payload
      }
    },
    setQueueStatus: (state, action: PayloadAction<typeof initialState.queueStatus>) => {
      state.queueStatus = action.payload
    },
    addInsightToSprint: (state, action: PayloadAction<{ sprintId: number; insight: AIInsight }>) => {
      const { sprintId, insight } = action.payload
      if (state.sprintInsights[sprintId]) {
        state.sprintInsights[sprintId].insights.push(insight)
        state.sprintInsights[sprintId].lastUpdated = new Date().toISOString()
      }
    },
    clearSprintInsights: (state, action: PayloadAction<number>) => {
      delete state.sprintInsights[action.payload]
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setSprintInsights,
  setTeamInsights,
  addWorkflowJob,
  updateWorkflowJob,
  setQueueStatus,
  addInsightToSprint,
  clearSprintInsights,
  setError,
  clearError,
} = aiInsightsSlice.actions

export default aiInsightsSlice.reducer