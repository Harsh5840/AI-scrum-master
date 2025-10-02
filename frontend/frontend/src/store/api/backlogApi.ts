import { apiSlice, type BacklogItem } from './apiSlice'

export const backlogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get backlog items
    getBacklogItems: builder.query<BacklogItem[], { sprintId?: number }>({
      query: ({ sprintId } = {}) => ({
        url: '/backlog',
        params: sprintId ? { sprintId } : undefined,
      }),
      providesTags: ['BacklogItem'],
    }),

    // Create backlog item
    createBacklogItem: builder.mutation<BacklogItem, {
      title: string
      description?: string
      sprintId?: number
    }>({
      query: (newItem) => ({
        url: '/backlog',
        method: 'POST',
        body: newItem,
      }),
      invalidatesTags: ['BacklogItem'],
    }),

    // Update backlog item
    updateBacklogItem: builder.mutation<BacklogItem, {
      id: number
      title?: string
      description?: string
      completed?: boolean
      sprintId?: number
    }>({
      query: ({ id, ...patch }) => ({
        url: `/backlog/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['BacklogItem'],
    }),

    // Delete backlog item
    deleteBacklogItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/backlog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BacklogItem'],
    }),
  }),
})

export const {
  useGetBacklogItemsQuery,
  useCreateBacklogItemMutation,
  useUpdateBacklogItemMutation,
  useDeleteBacklogItemMutation,
} = backlogApi