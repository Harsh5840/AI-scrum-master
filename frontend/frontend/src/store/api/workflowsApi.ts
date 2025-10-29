import { apiSlice, type AIInsight } from './apiSlice'

export interface SprintInsightsResponse {
  success: boolean
  insights: {
    sprint: {
      name: string
      startDate: string
      endDate: string
      daysRemaining: number
    }
    metrics: {
      riskScore: number
      velocityTrend: number
      completionProbability: number
    }
    insights: AIInsight[]
    recommendations: AIInsight[]
    risks: AIInsight[]
    team: {
      standupCount: number
      blockerCount: number
      uniqueContributors: number
    }
    backlog: {
      total: number
      completed: number
      completionRate: number
    }
  }
  generatedAt: string
}

export interface TeamInsightsResponse {
  success: boolean
  insights: {
    period: {
      days: number
      startDate: string
      endDate: string
    }
    team: {
      activeMembers: number
      totalStandups: number
      averageStandupsPerMember: number
      totalBlockers: number
      averageBlockersPerStandup: number
    }
    sprints: {
      total: number
      completed: number
      totalBacklogItems: number
      completedBacklogItems: number
    }
    recommendations: string[]
  }
  generatedAt: string
}

export interface QueueStatusResponse {
  success: boolean
  queues: {
    aiWorkflows: {
      waiting?: number
      active?: number
      completed?: number
      failed?: number
      delayed?: number
    }
    notifications: {
      waiting?: number
      active?: number
      completed?: number
      failed?: number
      delayed?: number
    }
    analytics: {
      waiting?: number
      active?: number
      completed?: number
      failed?: number
      delayed?: number
    }
  }
  waiting?: number
  active?: number
  completed?: number
  failed?: number
  delayed?: number
  timestamp: string
}

export const workflowsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Trigger sprint analysis
    triggerSprintAnalysis: builder.mutation<{
      success: boolean
      jobId: string
      sprintId: number
      analysisType: string
    }, {
      sprintId: number
      analysisType: 'health' | 'completion' | 'risk'
    }>({
      query: ({ sprintId, analysisType }) => ({
        url: `/workflows/sprint/${sprintId}/analysis`,
        method: 'POST',
        body: { analysisType },
      }),
      invalidatesTags: ['Workflow'],
    }),

    // Trigger standup analysis
    triggerStandupAnalysis: builder.mutation<{
      success: boolean
      jobId: string
      standupId: number
      analysisType: string
    }, {
      standupId: number
      analysisType: 'sentiment' | 'blockers' | 'velocity'
    }>({
      query: ({ standupId, analysisType }) => ({
        url: `/workflows/standup/${standupId}/analysis`,
        method: 'POST',
        body: { analysisType },
      }),
      invalidatesTags: ['Workflow'],
    }),

    // Get sprint insights
    getSprintInsights: builder.query<SprintInsightsResponse, {
      sprintId: number
      days?: number
    }>({
      query: ({ sprintId, days = 7 }) => ({
        url: `/workflows/sprint/${sprintId}/insights`,
        params: { days },
      }),
      providesTags: (result, error, { sprintId }) => [
        { type: 'AIInsight', id: sprintId },
      ],
    }),

    // Get team insights
    getTeamInsights: builder.query<TeamInsightsResponse, { days?: number }>({
      query: ({ days = 30 } = {}) => ({
        url: '/workflows/team/insights',
        params: { days },
      }),
      providesTags: ['AIInsight'],
    }),

    // Get queue status
    getQueueStatus: builder.query<QueueStatusResponse, void>({
      query: () => '/workflows/queue/status',
      providesTags: ['Workflow'],
    }),

    // Get job status
    getJobStatus: builder.query<{
      success: boolean
      jobId: string
      queue: string
    }, string>({
      query: (jobId) => `/workflows/job/${jobId}/status`,
      providesTags: (result, error, jobId) => [{ type: 'Workflow', id: jobId }],
    }),
  }),
})

export const {
  useTriggerSprintAnalysisMutation,
  useTriggerStandupAnalysisMutation,
  useGetSprintInsightsQuery,
  useGetTeamInsightsQuery,
  useGetQueueStatusQuery,
  useGetJobStatusQuery,
} = workflowsApi