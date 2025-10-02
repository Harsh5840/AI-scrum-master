import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Sprint } from '../api/apiSlice'

interface SprintsState {
  sprints: Sprint[]
  currentSprint: Sprint | null
  isLoading: boolean
  error: string | null
  filter: 'all' | 'active' | 'completed'
}

const initialState: SprintsState = {
  sprints: [],
  currentSprint: null,
  isLoading: false,
  error: null,
  filter: 'all',
}

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setSprints: (state, action: PayloadAction<Sprint[]>) => {
      state.sprints = action.payload
      state.error = null
    },
    setCurrentSprint: (state, action: PayloadAction<Sprint | null>) => {
      state.currentSprint = action.payload
    },
    addSprint: (state, action: PayloadAction<Sprint>) => {
      state.sprints.unshift(action.payload)
    },
    updateSprint: (state, action: PayloadAction<Sprint>) => {
      const index = state.sprints.findIndex(sprint => sprint.id === action.payload.id)
      if (index !== -1) {
        state.sprints[index] = action.payload
      }
      if (state.currentSprint?.id === action.payload.id) {
        state.currentSprint = action.payload
      }
    },
    deleteSprint: (state, action: PayloadAction<number>) => {
      state.sprints = state.sprints.filter(sprint => sprint.id !== action.payload)
      if (state.currentSprint?.id === action.payload) {
        state.currentSprint = null
      }
    },
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload
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
  setSprints,
  setCurrentSprint,
  addSprint,
  updateSprint,
  deleteSprint,
  setFilter,
  setError,
  clearError,
} = sprintsSlice.actions

export default sprintsSlice.reducer