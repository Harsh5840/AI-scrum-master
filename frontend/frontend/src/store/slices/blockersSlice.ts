import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Blocker } from '../api/apiSlice'

interface BlockersState {
  blockers: Blocker[]
  isLoading: boolean
  error: string | null
  filter: 'all' | 'unresolved' | 'resolved'
  severityFilter: 'all' | 'low' | 'medium' | 'high'
}

const initialState: BlockersState = {
  blockers: [],
  isLoading: false,
  error: null,
  filter: 'all',
  severityFilter: 'all',
}

const blockersSlice = createSlice({
  name: 'blockers',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setBlockers: (state, action: PayloadAction<Blocker[]>) => {
      state.blockers = action.payload
      state.error = null
    },
    addBlocker: (state, action: PayloadAction<Blocker>) => {
      state.blockers.unshift(action.payload)
    },
    updateBlocker: (state, action: PayloadAction<Blocker>) => {
      const index = state.blockers.findIndex(blocker => blocker.id === action.payload.id)
      if (index !== -1) {
        state.blockers[index] = action.payload
      }
    },
    markBlockerResolved: (state, action: PayloadAction<number>) => {
      const blocker = state.blockers.find(b => b.id === action.payload)
      if (blocker) {
        blocker.resolved = true
      }
    },
    deleteBlocker: (state, action: PayloadAction<number>) => {
      state.blockers = state.blockers.filter(blocker => blocker.id !== action.payload)
    },
    setFilter: (state, action: PayloadAction<'all' | 'unresolved' | 'resolved'>) => {
      state.filter = action.payload
    },
    setSeverityFilter: (state, action: PayloadAction<'all' | 'low' | 'medium' | 'high'>) => {
      state.severityFilter = action.payload
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
  setBlockers,
  addBlocker,
  updateBlocker,
  markBlockerResolved,
  deleteBlocker,
  setFilter,
  setSeverityFilter,
  setError,
  clearError,
} = blockersSlice.actions

export default blockersSlice.reducer