'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { signupUser, clearError } from '@/store/slices/authSlice'
import { ArrowRightIcon, EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { SignalWave } from '@/components/brand/SignalWave'
import { GoogleButton } from '@/components/brand/GoogleButton'

export default function SignupPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    setValidationError('')

    if (!formData.name || !formData.email || !formData.password) {
      setValidationError('Please fill in all fields')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return
    }

    const result = await dispatch(
      signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    )
    if (signupUser.fulfilled.match(result)) {
      router.push('/blockers')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border brand-wash brand-grain relative overflow-hidden">
        <div className="aurora-orb pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display">
            S
          </div>
          <span className="font-display text-xl">Signal</span>
        </Link>
        <div className="relative z-10 space-y-8">
          <div className="max-w-md">
            <h2 className="font-display text-4xl leading-tight mb-4">
              Your org starts with the first standup.
            </h2>
            <p className="text-muted-foreground">
              Signup creates a personal organization so sprints, standups, and blockers stay tenant-scoped.
            </p>
          </div>
          <SignalWave className="h-40 rounded-xl border border-primary/20 bg-background/40" />
        </div>
        <div />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h1 className="font-display text-3xl mb-2">Create account</h1>
            <p className="text-sm text-muted-foreground">Google or email — then the standup loop</p>
          </div>

          <GoogleButton label="Sign up with Google" />

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || validationError) && (
              <div role="alert" className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {validationError || error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                placeholder="Alex Chen"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                placeholder="alex@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData((f) => ({ ...f, password: e.target.value }))}
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
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData((f) => ({ ...f, confirmPassword: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating…' : 'Create account'}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
