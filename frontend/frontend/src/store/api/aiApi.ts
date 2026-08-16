import { apiSlice } from './apiSlice'

export interface AISource {
  type: string
  id: number
  relevanceScore: number
}

export interface AIQueryResponse {
  success: boolean
  response: string
  answer?: string
  context?: string
  sources?: AISource[]
  generatedAt: string
}

export const aiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    askAI: builder.mutation<
      AIQueryResponse,
      {
        query: string
        sprintId?: number
        includeTypes?: Array<'standup' | 'sprint' | 'blocker' | 'backlog'>
      }
    >({
      query: ({ query, sprintId, includeTypes }) => ({
        url: '/ai/ask',
        method: 'POST',
        body: { question: query, query, sprintId, includeTypes },
      }),
    }),

    getAISprintInsights: builder.query<
      {
        insights: string | Array<{
          type?: string
          description?: string
          confidence?: number
          actionItems?: string[]
        }>
      },
      number
    >({
      query: (sprintId) => `/ai/sprint/${sprintId}/insights`,
      providesTags: (_result, _error, sprintId) => [
        { type: 'AIInsight', id: sprintId },
      ],
    }),
  }),
})

export const { useAskAIMutation, useGetAISprintInsightsQuery } = aiApi
