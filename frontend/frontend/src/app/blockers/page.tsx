'use client'

import { useMemo, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetBlockersQuery, useResolveBlockerMutation } from '@/store/api/blockersApi'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

const severityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const filters = ['all', 'critical', 'high', 'medium', 'low'] as const

function severityClass(severity: string) {
  if (severity === 'critical' || severity === 'high') {
    return 'border-destructive/40 text-destructive'
  }
  if (severity === 'medium') {
    return 'border-[hsl(var(--warning))]/40 text-[hsl(var(--warning))]'
  }
  return 'border-border text-muted-foreground'
}

export default function BlockersPage() {
  const { data: blockers, isLoading, refetch } = useGetBlockersQuery()
  const [resolveBlocker, { isLoading: resolving }] = useResolveBlockerMutation()
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [resolvingId, setResolvingId] = useState<number | null>(null)

  const sorted = useMemo(() => {
    const list = [...(blockers || [])].filter((b: any) => b.status !== 'resolved')
    list.sort(
      (a: any, b: any) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9)
    )
    if (filter === 'all') return list
    return list.filter((b: any) => b.severity === filter)
  }, [blockers, filter])

  const handleResolve = async (id: number) => {
    setResolvingId(id)
    try {
      await resolveBlocker(id)
      refetch()
    } finally {
      setResolvingId(null)
    }
  }

  return (
    <MainLayout title="Blockers">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Structured blockers</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Extracted from standups — typed, severity-ranked, org-scoped
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/standups">Log standup with a blocker</Link>
          </Button>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter by severity"
        >
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 min-h-9 rounded-lg border capitalize transition-colors ${
                filter === f
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading blockers…</p>}

        {!isLoading && sorted.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                No open blockers
                {filter !== 'all' ? ` at ${filter} severity` : ''}. Submit a standup mentioning
                “blocked waiting on…” to demo detection.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/standups">Log a standup</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {sorted.map((b: any) => (
            <Card key={b.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md border capitalize ${severityClass(b.severity)}`}
                  >
                    {b.severity}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary capitalize">
                    {b.type}
                  </span>
                </div>
                <CardTitle className="text-base font-medium leading-snug font-sans tracking-normal">
                  {b.description}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground tabular-nums">
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
                  {resolvingId === b.id ? 'Resolving…' : 'Resolve'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
