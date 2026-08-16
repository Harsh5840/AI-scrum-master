'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ChatBubbleIcon, ExclamationTriangleIcon, LightningBoltIcon } from '@radix-ui/react-icons'

const steps = [
  {
    title: 'Standup in',
    body: 'Engineers paste yesterday / today / blockers. No ceremony theater.',
  },
  {
    title: 'Detect',
    body: 'Regex + Gemini extract typed blockers (severity, type) and summarize progress.',
  },
  {
    title: 'Act',
    body: 'Dashboard and grounded Q&A surface risk the same day — queryable team state.',
  },
]

const caps = [
  {
    icon: ChatBubbleIcon,
    title: 'Standup signal',
    body: 'Messy updates become summaries stored in Postgres, optionally embedded in Pinecone.',
  },
  {
    icon: ExclamationTriangleIcon,
    title: 'Structured blockers',
    body: 'Dependency, technical, resource, external — with severity so PMs can triage fast.',
  },
  {
    icon: LightningBoltIcon,
    title: 'Grounded answers',
    body: 'Ask “what’s blocking Sprint 24?” and get Gemini answers with source citations.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground brand-wash">
      <header className="flex items-center justify-between px-6 lg:px-10 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display text-sm">
            S
          </div>
          <span className="font-display text-lg tracking-tight">Signal</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Hero — brand first, one job */}
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 surface-grid rounded-3xl border border-border/60 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background pointer-events-none" />
          <div className="relative text-center max-w-3xl mx-auto px-4">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-primary text-sm tracking-[0.2em] uppercase mb-4"
            >
              Signal
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-5"
            >
              Standup in.
              <br />
              Blockers out.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="text-muted-foreground text-lg max-w-xl mx-auto mb-8"
            >
              An AI scrum signal pipeline — not a chat toy. Turn messy updates into typed team
              state your PM can act on today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90"
              >
                Start free
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card/50 hover:bg-card text-sm"
              >
                Demo login
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 lg:py-28">
          <h2 className="font-display text-3xl mb-3 text-center">How it works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            One loop. Three steps. BullMQ keeps the API snappy while Gemini and Pinecone do the heavy lift.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="text-xs font-mono text-primary mb-3">0{i + 1}</div>
                <h3 className="font-display text-xl mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="pb-20 lg:pb-28">
          <h2 className="font-display text-3xl mb-3 text-center">Capabilities</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            Built for the interview demo: submit a standup, see a blocker card, ask a grounded question.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {caps.map((cap, i) => {
              const Icon = cap.icon
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card/80 p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg mb-2">{cap.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cap.body}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <div className="rounded-3xl border border-border bg-card px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 surface-grid opacity-40 pointer-events-none" />
            <div className="relative">
              <h2 className="font-display text-3xl mb-3">Ship the signal, not the slide deck</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Sign up, seed a sprint, and run the standup → blocker → AI ask loop in under two minutes.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                Create account
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Signal · AI Scrum Master · JWT · Prisma · BullMQ · Gemini
      </footer>
    </div>
  )
}
