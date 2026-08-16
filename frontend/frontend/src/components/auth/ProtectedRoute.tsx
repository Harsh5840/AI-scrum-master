'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { getAuthToken } from '@/lib/session'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const hasToken = typeof window !== 'undefined' && !!getAuthToken()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasToken) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, hasToken, router])

  if (isLoading || (!isAuthenticated && hasToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Redirecting to login…</p>
      </div>
    )
  }

  return <>{children}</>
}

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
