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
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border brand-wash">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display">
            S
          </div>
          <span className="font-display text-xl">Signal</span>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-4xl leading-tight mb-4">
            Your org starts with the first standup.
          </h2>
          <p className="text-muted-foreground">
            Signup creates a personal organization so sprints, standups, and blockers stay tenant-scoped.
          </p>
        </div>
        <div />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h1 className="font-display text-3xl mb-2">Create account</h1>
            <p className="text-sm text-muted-foreground">Start the standup → blocker loop</p>
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
