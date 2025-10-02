'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getCurrentUser } from '@/store/slices/authSlice'
import { authService } from '@/services/authService'

interface AuthInitializerProps {
  children: React.ReactNode
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Check if user is authenticated on app load
    const initializeAuth = async () => {
      const token = authService.getToken()
      if (token && !isAuthenticated) {
        try {
          await dispatch(getCurrentUser())
        } catch (error) {
          // If getCurrentUser fails, the token is likely expired
          // The auth service will handle logout automatically via interceptor
          console.error('Failed to initialize auth:', error)
        }
      }
    }

    initializeAuth()
  }, [dispatch, isAuthenticated])

  // Show loading screen while checking authentication
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}