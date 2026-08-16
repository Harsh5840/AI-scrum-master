'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser, clearError } from '@/store/slices/authSlice'
import { EyeOpenIcon, EyeNoneIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import { SignalWave } from '@/components/brand/SignalWave'
import { GoogleButton } from '@/components/brand/GoogleButton'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(loginUser(formData))
    if (loginUser.fulfilled.match(result)) {
      router.push(searchParams.get('redirect') || '/blockers')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border brand-wash brand-grain relative overflow-hidden">
        <div className="aurora-orb pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display shadow-[0_0_24px_hsl(var(--primary)/0.4)]">
            S
          </div>
          <span className="font-display text-xl">Signal</span>
        </Link>
        <div className="relative z-10 space-y-8">
          <div className="max-w-md">
            <h2 className="font-display text-4xl leading-tight mb-4">
              Risk inbox from messy standups.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Sign in to run the loop: submit a standup, extract blockers, ask grounded questions.
            </p>
          </div>
          <SignalWave className="h-40 rounded-xl border border-primary/20 bg-background/40" />
        </div>
        <p className="text-xs text-muted-foreground relative z-10">
          Demo: demo@scrum.signal / demo1234 (after seed)
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h1 className="font-display text-3xl mb-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Google or your registered email</p>
          </div>

          <GoogleButton label="Continue with Google" />

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div role="alert" className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground min-h-10 min-w-10 inline-flex items-center justify-center"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            No account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  )
}
