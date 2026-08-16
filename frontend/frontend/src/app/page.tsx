'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { SignalWave } from '@/components/brand/SignalWave'
import { GoogleButton } from '@/components/brand/GoogleButton'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground brand-wash relative overflow-hidden">
      <div className="aurora-orb pointer-events-none absolute -top-20 right-[-6%] h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-6 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-display text-sm">
            S
          </div>
          <span className="font-display text-lg tracking-tight">Signal</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="text-sm px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground min-h-10 inline-flex items-center"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium min-h-10 inline-flex items-center"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] leading-[0.98] mb-6">
            Risk inbox
            <br />
            for engineering teams.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
            Paste a standup. Signal extracts typed blockers — severity, type, owner — and lets
            you ask the inbox a grounded question.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium min-h-11"
            >
              Open the demo
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-sm min-h-11"
            >
              Create account
            </Link>
          </div>
          <div className="max-w-xs">
            <GoogleButton />
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Demo · demo@scrum.signal / demo1234 after seed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-16 rounded-2xl border border-border overflow-hidden"
        >
          <SignalWave className="h-44 sm:h-56 bg-card/50" />
        </motion.div>
      </main>
    </div>
  )
}
