'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getCurrentUser } from '@/store/slices/authSlice'
import { getAuthToken } from '@/lib/session'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser()).finally(() => setHydrated(true))
      return
    }
    setHydrated(true)
  }, [dispatch, isAuthenticated])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background brand-wash">
        <p className="text-sm text-muted-foreground">Loading Signal…</p>
      </div>
    )
  }

  return <>{children}</>
}
