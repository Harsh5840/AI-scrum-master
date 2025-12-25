'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser, clearError } from '@/store/slices/authSlice'
import {
  PersonIcon,
  LockClosedIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  ArrowRightIcon,
  RocketIcon,
  LightningBoltIcon,
  BarChartIcon,
} from '@radix-ui/react-icons'

// Animated floating shapes
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] right-[5%] w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] left-[20%] w-64 h-64 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/5 blur-3xl"
      />
    </div>
  )
}

// Feature highlight card
function FeatureCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-purple-400" />
      </div>
      <div>
        <h3 className="font-medium text-white text-sm mb-1">{title}</h3>
        <p className="text-white/40 text-xs leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())

    if (!formData.email || !formData.password) {
      return
    }

    try {
      const result = await dispatch(loginUser(formData))
      if (loginUser.fulfilled.match(result)) {
        router.push('/dashboard')
      }
    } catch (err) {
      // Error is handled by the slice
    }
  }

  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    window.location.href = `${backendUrl}/auth/google`
  }

  return (
    <div className="min-h-screen flex bg-[#09090B]">
      {/* Left side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        <FloatingShapes />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Ship faster with{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                intelligent sprints
              </span>
            </h1>
            <p className="text-lg text-white/50 mb-10 leading-relaxed">
              Join 500+ engineering teams using AI to automate standups, predict blockers, and accelerate velocity.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="space-y-4">
            <FeatureCard
              icon={LightningBoltIcon}
              title="AI-Powered Insights"
              description="Get real-time predictions on sprint health and team velocity"
              delay={0.4}
            />
            <FeatureCard
              icon={RocketIcon}
              title="Automated Standups"
              description="Save 30 minutes daily with async standup summaries"
              delay={0.5}
            />
            <FeatureCard
              icon={BarChartIcon}
              title="Predictive Analytics"
              description="Know about blockers before they impact your timeline"
              delay={0.6}
            />
          </div>
        </div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center gap-6"
        >
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#09090B] bg-gradient-to-br from-purple-400 to-cyan-400"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
          <p className="text-white/40 text-sm">
            <span className="text-white font-medium">2,500+</span> engineers trust us
          </p>
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile background */}
        <div className="lg:hidden absolute inset-0">
          <FloatingShapes />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <span className="text-xl font-semibold text-white">
                Scrum Master
              </span>
            </Link>
          </div>

          {/* Form card */}
          <div className="relative">
            {/* Subtle glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20 rounded-2xl blur-xl opacity-50" />

            <div className="relative bg-[#0c0c10]/80 backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.08] shadow-2xl">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-white/50 text-sm">
                  Sign in to continue shipping faster
                </p>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
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
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0c0c10] px-4 text-white/30">
                    or sign in with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/60 text-sm font-normal">Email</Label>
                  <div className="relative">
                    <PersonIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="pl-11 h-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/60 text-sm font-normal">Password</Label>
                    <Link href="/auth/forgot-password" className="text-xs text-purple-400/80 hover:text-purple-400 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="pl-11 pr-11 h-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                    >
                      {showPassword ? <EyeNoneIcon className="h-4 w-4" /> : <EyeOpenIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium transition-all duration-300 rounded-xl shadow-lg shadow-purple-500/20"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign in
                      <ArrowRightIcon className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="mt-8 text-center text-sm text-white/40">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign up free
                </Link>
              </p>
            </div>
          </div>

          {/* Demo hint */}
          <p className="mt-6 text-center text-xs text-white/20">
            Demo: Use any email/password combination
          </p>
        </motion.div>
      </div>
    </div>
  )
}