'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@radix-ui/react-icons'

const loop = [
  {
    title: 'Standup in',
    body: 'Engineers paste yesterday, today, and blockers. No ceremony theater.',
  },
  {
    title: 'Detect',
    body: 'Regex plus Gemini extract typed blockers and summarize progress.',
  },
  {
    title: 'Act',
    body: 'Dashboard and grounded Q&A surface risk the same day.',
  },
]

const capabilities = [
  {
    title: 'Standup signal',
    body: 'Messy updates become summaries in Postgres, optionally embedded in Pinecone.',
  },
  {
    title: 'Structured blockers',
    body: 'Dependency, technical, resource, or external — with severity so PMs can triage.',
  },
  {
    title: 'Grounded answers',
    body: 'Ask what is blocking the sprint and get Gemini answers with source citations.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground brand-wash">
      <header className="flex items-center justify-between px-6 lg:px-10 py-5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display text-sm">
            S
          </div>
          <span className="font-display text-lg">Signal</span>
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
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 min-h-10 inline-flex items-center"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-10">
        <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[4.25rem] leading-[1.04] mb-6">
              Standup in.
              <br />
              Blockers out.
            </h1>
            <p className="text-muted-foreground text-lg max-w-[38rem] mb-8 leading-relaxed">
              An AI scrum signal pipeline — not a chat toy. Turn messy updates into typed team
              state your PM can act on today.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 min-h-11"
              >
                Start free
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border hover:bg-secondary text-sm min-h-11"
              >
                Demo login
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="py-16 lg:py-24 border-t border-border">
          <h2 className="font-display text-3xl mb-2">How it works</h2>
          <p className="text-muted-foreground max-w-xl mb-10">
            One loop. BullMQ keeps the API snappy while Gemini and Pinecone do the heavy lift.
          </p>
          <ol className="grid md:grid-cols-3 gap-x-10 gap-y-8">
            {loop.map((step, i) => (
              <li key={step.title} className="relative">
                {i < loop.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden md:block absolute top-3 left-full w-10 h-px bg-border -translate-x-0"
                  />
                )}
                <h3 className="font-display text-xl mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-16 lg:py-24 border-t border-border">
          <div className="grid lg:grid-cols-[minmax(0,14rem)_1fr] gap-10 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl mb-3">What ships</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The interview demo is the product loop: submit a standup, see a blocker, ask a grounded question.
              </p>
            </div>
            <ul className="divide-y divide-border">
              {capabilities.map((cap) => (
                <li key={cap.title} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="font-display text-lg mb-1.5">{cap.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{cap.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 lg:py-20 border-t border-border mb-10">
          <h2 className="font-display text-3xl mb-3 max-w-xl">
            Ship the signal, not the slide deck
          </h2>
          <p className="text-muted-foreground mb-7 max-w-md">
            Sign up, seed a sprint, and run standup → blocker → AI ask in under two minutes.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 min-h-11"
          >
            Create account
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6 text-center text-xs text-muted-foreground">
        Signal · AI Scrum Master
      </footer>
    </div>
  )
}
