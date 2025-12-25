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
import {
  PersonIcon,
  LockClosedIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  EnvelopeClosedIcon,
  ArrowRightIcon,
  CheckIcon,
  TimerIcon,
  MixIcon,
  TargetIcon,
} from '@radix-ui/react-icons'

// Animated floating shapes
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] right-[5%] w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/15 to-violet-500/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] left-[20%] w-64 h-64 rounded-full bg-gradient-to-br from-fuchsia-500/10 to-pink-500/5 blur-3xl"
      />
    </div>
  )
}

// Stats card
function StatCard({ value, label, delay }: { value: string, label: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
    >
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/40">{label}</div>
    </motion.div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    setValidationError('')

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
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

    if (!agreedToTerms) {
      setValidationError('Please agree to the terms')
      return
    }

    try {
      const result = await dispatch(signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }))
      if (signupUser.fulfilled.match(result)) {
        router.push('/dashboard')
      }
    } catch (err) {
      // Error is handled by the slice
    }
  }

  const handleGoogleSignup = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    window.location.href = `${backendUrl}/auth/google`
  }

  const benefits = [
    { icon: TimerIcon, text: "Save 30+ min daily on standups" },
    { icon: TargetIcon, text: "Predict blockers 2 days early" },
    { icon: MixIcon, text: "Increase velocity by 23%" },
  ]

  return (
    <div className="min-h-screen flex bg-[#09090B]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        <FloatingShapes />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/25">
              AI
            </div>
            <span className="text-xl font-semibold text-white group-hover:text-white/80 transition-colors">
              Scrum Master
            </span>
          </Link>
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              14-day free trial • No credit card
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Start building{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                better sprints
              </span>{' '}
              today
            </h1>
            <p className="text-lg text-white/50 mb-10 leading-relaxed">
              Join thousands of teams shipping faster with AI-powered agile management.
            </p>
          </motion.div>

          {/* Benefits list */}
          <div className="space-y-4 mb-10">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <benefit.icon className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-white/70 text-sm">{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard value="500+" label="Teams" delay={0.6} />
            <StatCard value="2.5k" label="Engineers" delay={0.7} />
            <StatCard value="23%" label="Faster" delay={0.8} />
          </div>
        </div>

        {/* Trust quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="relative z-10">
          <blockquote className="text-white/60 text-sm italic border-l-2 border-purple-500/50 pl-4">
            "Cut our standup time in half and caught blockers we never saw coming."
          </blockquote>
          <p className="text-white/40 text-xs mt-2">— Engineering Lead, Series B Startup</p>
        </motion.div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        <div className="lg:hidden absolute inset-0"><FloatingShapes /></div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">AI</div>
              <span className="text-xl font-semibold text-white">Scrum Master</span>
            </Link>
          </div>

          {/* Form card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 rounded-2xl blur-xl opacity-50" />

            <div className="relative bg-[#0c0c10]/80 backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.08] shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
                <p className="text-white/50 text-sm">Start your free trial. No credit card required.</p>
              </div>

              {/* Google Sign Up */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full h-12 bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20 transition-all mb-6"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0c0c10] px-4 text-white/30">or sign up with email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {(error || validationError) && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400">{error || validationError}</p>
                  </motion.div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/60 text-sm font-normal">Full name</Label>
                  <div className="relative">
                    <PersonIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input id="name" type="text" autoComplete="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="pl-11 h-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/60 text-sm font-normal">Work email</Label>
                  <div className="relative">
                    <EnvelopeClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input id="email" type="email" autoComplete="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" className="pl-11 h-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/60 text-sm font-normal">Password</Label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" className="pl-11 pr-11 h-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors">
                      {showPassword ? <EyeNoneIcon className="h-4 w-4" /> : <EyeOpenIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/60 text-sm font-normal">Confirm password</Label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm password" className="pl-11 pr-11 h-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-xl" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors">
                      {showConfirmPassword ? <EyeNoneIcon className="h-4 w-4" /> : <EyeOpenIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-2">
                  <button type="button" onClick={() => setAgreedToTerms(!agreedToTerms)} className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${agreedToTerms ? 'bg-purple-500 border-purple-500' : 'border-white/20 bg-white/5'}`}>
                    {agreedToTerms && <CheckIcon className="w-3 h-3 text-white" />}
                  </button>
                  <label className="text-sm text-white/50 leading-relaxed">
                    I agree to the <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms</Link> and <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
                  </label>
                </div>

                {/* Submit */}
                <Button type="submit" disabled={isLoading} className="w-full h-12 mt-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium transition-all duration-300 rounded-xl shadow-lg shadow-purple-500/20">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create account
                      <ArrowRightIcon className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="mt-6 text-center text-sm text-white/40">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}