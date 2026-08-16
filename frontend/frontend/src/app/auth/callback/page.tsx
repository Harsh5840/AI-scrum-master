'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch } from '@/store/hooks'
import { setCredentials } from '@/store/slices/authSlice'
import { apiUrl, persistSession } from '@/lib/session'
import { SignalWave } from '@/components/brand/SignalWave'
import { Button } from '@/components/ui/button'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      const token = searchParams.get('token')
      const refreshToken = searchParams.get('refreshToken')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        setStatus('error')
        setError('Google sign-in was cancelled or failed.')
        return
      }

      if (!token) {
        setStatus('error')
        setError('No auth token returned from Google. Check GOOGLE_CLIENT_ID on the backend.')
        return
      }

      try {
        persistSession(token, refreshToken || undefined)
        const response = await fetch(apiUrl('/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const user = await response.json()
        if (user.currentOrgId) {
          persistSession(token, refreshToken || undefined, user.currentOrgId)
        }
        dispatch(setCredentials({ user, token }))
        setStatus('success')
        router.replace('/blockers')
      } catch {
        setStatus('error')
        setError('Could not finish Google sign-in. Try email login or check the backend.')
      }
    }

    run()
  }, [searchParams, dispatch, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background brand-wash px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="font-display text-2xl">Signal</h1>
        <SignalWave className="h-28 rounded-xl border border-primary/20 bg-card/60" />
        {status === 'loading' && <p className="text-sm text-muted-foreground">Finishing Google sign-in…</p>}
        {status === 'success' && <p className="text-sm text-primary">Signed in. Opening the dashboard…</p>}
        {status === 'error' && (
          <div className="space-y-4">
            <p role="alert" className="text-sm text-destructive">{error}</p>
            <Button asChild>
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  )
}
