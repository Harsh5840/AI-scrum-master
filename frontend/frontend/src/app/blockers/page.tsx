'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { useGetBlockersQuery, useResolveBlockerMutation } from '@/store/api/blockersApi'
import { formatDistanceToNow } from 'date-fns'
import { PageEnter } from '@/components/brand/PageEnter'

const severityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const filters = ['all', 'critical', 'high', 'medium', 'low'] as const

function severityDot(severity: string) {
  if (severity === 'critical') return 'bg-destructive'
  if (severity === 'high') return 'bg-destructive/70'
  if (severity === 'medium') return 'bg-[hsl(var(--warning))]'
  return 'bg-muted-foreground/50'
}

export default function InboxPage() {
  const { data: blockers, isLoading, refetch } = useGetBlockersQuery()
  const [resolveBlocker, { isLoading: resolving }] = useResolveBlockerMutation()
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [resolvingId, setResolvingId] = useState<number | null>(null)

  const open = useMemo(
    () => (blockers || []).filter((b: { status?: string }) => b.status !== 'resolved'),
    [blockers]
  )

  const sorted = useMemo(() => {
    const list = [...open].sort(
      (a: { severity?: string }, b: { severity?: string }) =>
        (severityOrder[a.severity || ''] ?? 9) - (severityOrder[b.severity || ''] ?? 9)
    )
    if (filter === 'all') return list
    return list.filter((b: { severity?: string }) => b.severity === filter)
  }, [open, filter])

  const hot = open.filter((b: { severity?: string }) => b.severity === 'critical' || b.severity === 'high').length

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
    <MainLayout title="Inbox">
      <PageEnter className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground tabular-nums">
              {isLoading ? 'Loading…' : `${open.length} open · ${hot} high or critical`}
            </p>
            <h2 className="font-display text-3xl mt-1">Risk inbox</h2>
          </div>
          <Button asChild>
            <Link href="/standups">Capture an update</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by severity">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 min-h-9 rounded-full capitalize ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {!isLoading && sorted.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              Inbox is clear{filter !== 'all' ? ` for ${filter}` : ''}. Capture an update that
              mentions waiting, blocked, or stuck.
            </p>
            <Button asChild variant="outline">
              <Link href="/standups">Open Capture</Link>
            </Button>
          </div>
        )}

        <ul className="divide-y divide-border">
          {sorted.map((b: any) => (
            <li key={b.id} className="py-5 first:pt-0 flex items-start gap-4">
              <span className={`mt-2 h-2 w-2 rounded-full shrink-0 ${severityDot(b.severity)}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] leading-snug">{b.description}</p>
                <p className="text-xs text-muted-foreground mt-1.5 capitalize">
                  {b.severity} · {b.type}
                  {b.standup?.user?.name ? ` · ${b.standup.user.name}` : ''}
                  {' · '}
                  {formatDistanceToNow(new Date(b.detectedAt || b.createdAt), { addSuffix: true })}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                disabled={resolving}
                onClick={() => handleResolve(b.id)}
              >
                {resolvingId === b.id ? 'Resolving…' : 'Resolve'}
              </Button>
            </li>
          ))}
        </ul>
      </PageEnter>
    </MainLayout>
  )
}
