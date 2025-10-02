import { apiSlice, type Sprint } from './apiSlice'

export const sprintsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all sprints with optional filter
    getSprints: builder.query<Sprint[], { filter?: 'active' | 'completed' }>({
      query: ({ filter } = {}) => ({
        url: '/sprints',
        params: filter ? { filter } : undefined,
      }),
      providesTags: ['Sprint'],
    }),

    // Get single sprint with details
    getSprint: builder.query<{
      sprint: Sprint
      burndown: { completed: number; total: number }
      velocity: number
    }, number>({
      query: (id) => `/sprints/${id}/summary`,
      providesTags: (result, error, id) => [{ type: 'Sprint', id }],
    }),

    // Create new sprint
    createSprint: builder.mutation<Sprint, {
      name: string
      startDate: string
      endDate: string
    }>({
      query: (newSprint) => ({
        url: '/sprints',
        method: 'POST',
        body: newSprint,
      }),
      invalidatesTags: ['Sprint'],
    }),

    // Update sprint
    updateSprint: builder.mutation<Sprint, {
      id: number
      endDate?: string
    }>({
      query: ({ id, ...patch }) => ({
        url: `/sprints/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Sprint', id }],
    }),

    // Delete sprint
    deleteSprint: builder.mutation<void, number>({
      query: (id) => ({
        url: `/sprints/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sprint'],
    }),
  }),
})

export const {
  useGetSprintsQuery,
  useGetSprintQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsApi