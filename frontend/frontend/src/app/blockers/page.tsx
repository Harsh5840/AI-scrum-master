'use client'

import { useMemo, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetBlockersQuery, useResolveBlockerMutation } from '@/store/api/blockersApi'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

const severityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export default function BlockersPage() {
  const { data: blockers, isLoading, refetch } = useGetBlockersQuery()
  const [resolveBlocker, { isLoading: resolving }] = useResolveBlockerMutation()
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')

  const sorted = useMemo(() => {
    const list = [...(blockers || [])].filter((b: any) => b.status !== 'resolved')
    list.sort(
      (a: any, b: any) =>
        (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9)
    )
    if (filter === 'all') return list
    return list.filter((b: any) => b.severity === filter)
  }, [blockers, filter])

  const handleResolve = async (id: number) => {
    await resolveBlocker(id)
    refetch()
  }

  return (
    <MainLayout title="Blockers">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Structured blockers</h2>
            <p className="text-sm text-muted-foreground">
              Extracted from standups — typed, severity-ranked, org-scoped
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/standups">Log standup with a blocker</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors ${
                filter === f
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {!isLoading && sorted.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center space-y-2">
              <ExclamationTriangleIcon className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                No open blockers. Submit a standup mentioning “blocked waiting on…” to demo detection.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {sorted.map((b: any, i: number) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                className={`border-l-4 ${
                  b.severity === 'critical'
                    ? 'border-l-red-500'
                    : b.severity === 'high'
                      ? 'border-l-orange-500'
                      : b.severity === 'medium'
                        ? 'border-l-amber-500'
                        : 'border-l-border'
                }`}
              >
                <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-md border border-border capitalize">
                        {b.severity}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary capitalize">
                        {b.type}
                      </span>
                    </div>
                    <CardTitle className="text-base font-medium leading-snug">
                      {b.description}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(b.detectedAt || b.createdAt), {
                      addSuffix: true,
                    })}
                    {b.standup?.user?.name ? ` · ${b.standup.user.name}` : ''}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={resolving}
                    onClick={() => handleResolve(b.id)}
                  >
                    <CheckCircledIcon className="mr-1.5 h-3.5 w-3.5" />
                    Resolve
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
