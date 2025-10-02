import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: string
    read: boolean
  }>
  activeView: string
  isLoading: boolean
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'system',
  notifications: [],
  activeView: 'dashboard',
  isLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info'
      title: string
      message: string
    }>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
        read: false,
      }
      state.notifications.unshift(notification)
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.notifications = []
    },
    setActiveView: (state, action: PayloadAction<string>) => {
      state.activeView = action.payload
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  markNotificationRead,
  removeNotification,
  clearAllNotifications,
  setActiveView,
  setGlobalLoading,
} = uiSlice.actions

export default uiSlice.reducer