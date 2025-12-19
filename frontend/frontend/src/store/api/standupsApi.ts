import { apiSlice, type Standup } from './apiSlice'

export const standupsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get standups with optional sprint filter
    getStandups: builder.query<Standup[], { sprintId?: number }>({
      query: ({ sprintId } = {}) => ({
        url: '/standups',
        params: sprintId ? { sprintId } : undefined,
      }),
      providesTags: ['Standup'],
    }),

    // Get single standup
    getStandup: builder.query<Standup, number>({
      query: (id) => `/standups/${id}`,
      providesTags: (result, error, id) => [{ type: 'Standup', id }],
    }),

    // Create new standup
    createStandup: builder.mutation<Standup, {
      userId?: number
      sprintId?: number
      summary?: string
      description?: string
      yesterday?: string
      today?: string
      blockers?: string
    }>({
      query: (newStandup) => ({
        url: '/standups',
        method: 'POST',
        body: newStandup,
      }),
      invalidatesTags: ['Standup', 'Blocker'],
    }),

    // Update standup
    updateStandup: builder.mutation<Standup, {
      id: number
      summary?: string
    }>({
      query: ({ id, ...patch }) => ({
        url: `/standups/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Standup', id }],
    }),

    // Delete standup
    deleteStandup: builder.mutation<void, number>({
      query: (id) => ({
        url: `/standups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Standup'],
    }),
  }),
})

export const {
  useGetStandupsQuery,
  useGetStandupQuery,
  useCreateStandupMutation,
  useUpdateStandupMutation,
  useDeleteStandupMutation,
} = standupsApi