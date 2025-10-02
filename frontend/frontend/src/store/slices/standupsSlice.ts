import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Standup } from '../api/apiSlice'

interface StandupsState {
  standups: Standup[]
  isLoading: boolean
  error: string | null
  selectedSprintId: number | null
  dateFilter: string | null
}

const initialState: StandupsState = {
  standups: [],
  isLoading: false,
  error: null,
  selectedSprintId: null,
  dateFilter: null,
}

const standupsSlice = createSlice({
  name: 'standups',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setStandups: (state, action: PayloadAction<Standup[]>) => {
      state.standups = action.payload
      state.error = null
    },
    addStandup: (state, action: PayloadAction<Standup>) => {
      state.standups.unshift(action.payload)
    },
    updateStandup: (state, action: PayloadAction<Standup>) => {
      const index = state.standups.findIndex(standup => standup.id === action.payload.id)
      if (index !== -1) {
        state.standups[index] = action.payload
      }
    },
    deleteStandup: (state, action: PayloadAction<number>) => {
      state.standups = state.standups.filter(standup => standup.id !== action.payload)
    },
    setSelectedSprintId: (state, action: PayloadAction<number | null>) => {
      state.selectedSprintId = action.payload
    },
    setDateFilter: (state, action: PayloadAction<string | null>) => {
      state.dateFilter = action.payload
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
  setStandups,
  addStandup,
  updateStandup,
  deleteStandup,
  setSelectedSprintId,
  setDateFilter,
  setError,
  clearError,
} = standupsSlice.actions

export default standupsSlice.reducer