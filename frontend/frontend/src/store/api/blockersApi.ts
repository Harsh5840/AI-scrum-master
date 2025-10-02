import { apiSlice, type Blocker } from './apiSlice'

export const blockersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all blockers
    getBlockers: builder.query<Blocker[], void>({
      query: () => '/blockers',
      providesTags: ['Blocker'],
    }),

    // Get blocker patterns and insights
    getBlockerPatterns: builder.query<{
      patterns: Array<{
        description: string
        frequency: number
        severity: string
      }>
      insights: string[]
      recommendations: string[]
    }, void>({
      query: () => '/blockers/patterns',
      providesTags: ['Blocker'],
    }),

    // Mark blocker as resolved
    resolveBlocker: builder.mutation<Blocker, number>({
      query: (id) => ({
        url: `/blockers/${id}/resolve`,
        method: 'POST',
      }),
      invalidatesTags: ['Blocker'],
    }),

    // Delete blocker
    deleteBlocker: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blockers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blocker'],
    }),
  }),
})

export const {
  useGetBlockersQuery,
  useGetBlockerPatternsQuery,
  useResolveBlockerMutation,
  useDeleteBlockerMutation,
} = blockersApi