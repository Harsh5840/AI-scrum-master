import { apiSlice } from './apiSlice'

export interface AIQueryResponse {
  success: boolean
  response: string
  context: Array<{
    content: string
    metadata: any
    score: number
  }>
  generatedAt: string
}

export const aiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Ask AI with natural language query
    askAI: builder.mutation<AIQueryResponse, {
      query: string
      sprintId?: number
      includeTypes?: Array<'standup' | 'sprint' | 'blocker' | 'backlog'>
    }>({
      query: (params) => ({
        url: '/ai/ask',
        method: 'POST',
        body: params,
      }),
    }),

    // Get AI-powered sprint insights
    getAISprintInsights: builder.query<{
      success: boolean
      insights: Array<{
        type: string
        description: string
        confidence: number
        actionItems: string[]
      }>
      generatedAt: string
    }, number>({
      query: (sprintId) => `/ai/sprint/${sprintId}/insights`,
      providesTags: (result, error, sprintId) => [
        { type: 'AIInsight', id: sprintId },
      ],
    }),

    // Get general AI insights
    getAIInsights: builder.query<Array<{
      id: number
      type: string
      title: string
      description: string
      confidence: number
      priority: 'high' | 'medium' | 'low'
      createdAt: string
    }>, void>({
      query: () => '/ai/insights',
      providesTags: ['AIInsight'],
    }),

    // Generate new AI insights
    generateInsights: builder.mutation<{
      insights: Array<{
        type: string
        description: string
        confidence: number
        actionItems: string[]
      }>
      message: string
    }, void>({
      query: () => ({
        url: '/ai/generate-insights',
        method: 'POST',
      }),
      invalidatesTags: ['AIInsight'],
    }),

    // Get risk assessment
    getRiskAssessment: builder.query<{
      overallRisk: 'low' | 'medium' | 'high' | 'critical'
      riskFactors: Array<{
        factor: string
        severity: 'low' | 'medium' | 'high'
        impact: string
      }>
      recommendations: string[]
    }, { sprintId?: number }>({
      query: ({ sprintId } = {}) => ({
        url: '/ai/risk-assessment',
        params: sprintId ? { sprintId } : undefined,
      }),
      providesTags: ['AIInsight'],
    }),

    // Get sprint planning suggestions
    getSprintPlanningAssistance: builder.query<{
      suggestedCapacity: number
      recommendedTasks: Array<{
        title: string
        estimatedPoints: number
        priority: 'high' | 'medium' | 'low'
        reasoning: string
      }>
      warnings: string[]
    }, { teamSize: number; sprintDuration: number }>({
      query: ({ teamSize, sprintDuration }) => ({
        url: '/ai/sprint-planning',
        params: { teamSize, sprintDuration },
      }),
      providesTags: ['AIInsight'],
    }),

    // Get task prioritization suggestions
    getTaskPrioritization: builder.query<Array<{
      taskId: number
      title: string
      currentPriority: 'high' | 'medium' | 'low'
      suggestedPriority: 'high' | 'medium' | 'low'
      reasoning: string
      confidence: number
    }>, { sprintId?: number }>({
      query: ({ sprintId } = {}) => ({
        url: '/ai/task-prioritization',
        params: sprintId ? { sprintId } : undefined,
      }),
      providesTags: ['AIInsight'],
    }),

    // Get team productivity insights
    getTeamProductivityInsights: builder.query<{
      productivityScore: number
      trends: Array<{
        metric: string
        trend: 'improving' | 'declining' | 'stable'
        change: number
        recommendation: string
      }>
      optimization: string[]
    }, void>({
      query: () => '/ai/team-productivity',
      providesTags: ['AIInsight'],
    }),
  }),
})

export const {
  useAskAIMutation,
  useGetAISprintInsightsQuery,
  useGetAIInsightsQuery,
  useGenerateInsightsMutation,
  useGetRiskAssessmentQuery,
  useGetSprintPlanningAssistanceQuery,
  useGetTaskPrioritizationQuery,
  useGetTeamProductivityInsightsQuery,
} = aiApi