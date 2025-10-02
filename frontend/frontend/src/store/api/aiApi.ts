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
  }),
})

export const {
  useAskAIMutation,
  useGetAISprintInsightsQuery,
} = aiApi