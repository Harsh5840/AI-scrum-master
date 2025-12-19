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

    // Create new blocker
    createBlocker: builder.mutation<Blocker, Partial<Blocker>>({
      query: (body) => ({
        url: '/blockers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Blocker'],
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

    // Update blocker status
    updateBlocker: builder.mutation<Blocker, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/blockers/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Blocker'],
    }),
  }),
})

export const {
  useGetBlockersQuery,
  useGetBlockerPatternsQuery,
  useCreateBlockerMutation,
  useResolveBlockerMutation,
  useDeleteBlockerMutation,
  useUpdateBlockerMutation,
} = blockersApi