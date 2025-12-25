'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, EnvelopeClosedIcon, CheckCircledIcon } from '@radix-ui/react-icons'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090B] relative overflow-hidden p-6">
            {/* Background effects */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] left-[20%] w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/15 to-violet-500/10 blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] right-[20%] w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/10 blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Back link */}
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors group"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to login
                </Link>

                {/* Card */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20 rounded-2xl blur-xl opacity-50" />

                    <div className="relative bg-[#0c0c10]/80 backdrop-blur-2xl rounded-2xl p-8 border border-white/[0.08] shadow-2xl">
                        {isSubmitted ? (
                            // Success state
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircledIcon className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
                                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                                    We've sent a password reset link to<br />
                                    <span className="text-white font-medium">{email}</span>
                                </p>
                                <p className="text-white/30 text-xs mb-6">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                >
                                    Try a different email
                                </button>
                            </motion.div>
                        ) : (
                            // Form state
                            <>
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/5 flex items-center justify-center mb-6 mx-auto">
                                    <EnvelopeClosedIcon className="w-7 h-7 text-purple-400" />
                                </div>

                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        No worries. Enter your email and we'll send you<br />a link to reset your password.
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-white/60 text-sm">
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <EnvelopeClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@company.com"
                                                className="w-full h-12 pl-11 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send reset link'
                                        )}
                                    </button>
                                </form>

                                {/* Footer */}
                                <p className="mt-8 text-center text-sm text-white/40">
                                    Remember your password?{' '}
                                    <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Logo at bottom */}
                <div className="mt-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/50 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/50 to-cyan-500/50 flex items-center justify-center text-white font-bold text-[10px]">
                            AI
                        </div>
                        <span className="text-xs">Scrum Master</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
