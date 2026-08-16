'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-4 text-center border border-border rounded-2xl p-8 bg-card">
        <h1 className="text-2xl font-semibold tracking-tight">Password reset</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Self-serve password reset is not shipped yet. Contact your org admin or create a new
          account if you are evaluating the demo.
        </p>
        <Button asChild className="w-full">
          <Link href="/auth/login">Back to login</Link>
        </Button>
      </div>
    </div>
  )
}
