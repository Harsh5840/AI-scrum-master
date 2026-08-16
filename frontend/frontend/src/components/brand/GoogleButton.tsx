'use client'

import { useState } from 'react'
import { startGoogleAuth } from '@/lib/session'

export function GoogleButton({ label = 'Continue with Google' }: { label?: string }) {
  const [pending, setPending] = useState(false)

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true)
        startGoogleAuth()
      }}
      className="w-full min-h-11 inline-flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.82-.07-1.64-.23-2.43H12v4.6h6.46a5.52 5.52 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.55-5.17 3.55-8.8Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.95-2.93l-3.88-3c-1.08.72-2.47 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.25A7.2 7.2 0 0 1 4.89 12c0-.78.14-1.53.38-2.25V6.66H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.34l4-3.09Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.14 15.23 0 12 0 7.31 0 3.26 2.69 1.27 6.66l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
        />
      </svg>
      {pending ? 'Redirecting to Google…' : label}
    </button>
  )
}
