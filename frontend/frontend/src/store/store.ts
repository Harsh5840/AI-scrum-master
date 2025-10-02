import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './api/apiSlice'
import authReducer from './slices/authSlice.js'
import sprintsReducer from './slices/sprintsSlice.js'
import standupsReducer from './slices/standupsSlice.js'
import blockersReducer from './slices/blockersSlice.js'
import aiInsightsReducer from './slices/aiInsightsSlice.js'
import uiReducer from './slices/uiSlice.js'

export const store = configureStore({
  reducer: {
    // API slice
    api: apiSlice.reducer,
    
    // Feature slices
    auth: authReducer,
    sprints: sprintsReducer,
    standups: standupsReducer,
    blockers: blockersReducer,
    aiInsights: aiInsightsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Setup listeners for automatic refetching
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch