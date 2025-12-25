'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons'

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090B] relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
                        backgroundSize: '64px 64px',
                    }}
                />
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 blur-[150px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Back to login */}
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to login
                </Link>

                {/* Card */}
                <div className="relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 via-white/5 to-white/10 rounded-2xl" />

                    <div className="relative bg-[#0a0a0f]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-6 mx-auto">
                            <EnvelopeClosedIcon className="w-6 h-6 text-purple-400" />
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
                            <p className="text-white/50 text-sm">
                                Enter your email and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-white/70 text-sm">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300"
                            >
                                Send reset link
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="mt-8 text-center text-sm text-white/40">
                            Remember your password?{' '}
                            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
