'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { useGetBlockersQuery } from '@/store/api/blockersApi'
import { format } from 'date-fns'

export default function AnalyticsPage() {
  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery({})
  const { data: standups, isLoading: standupsLoading } = useGetStandupsQuery({})
  const { data: blockers, isLoading: blockersLoading } = useGetBlockersQuery()

  const now = Date.now()
  const activeSprint = useMemo(
    () =>
      sprints?.find(
        (s: { startDate: string; endDate: string }) =>
          new Date(s.startDate).getTime() <= now && new Date(s.endDate).getTime() >= now
      ),
    [sprints, now]
  )

  const openBlockers = useMemo(
    () => (blockers || []).filter((b: { status?: string }) => b.status !== 'resolved'),
    [blockers]
  )

  const severityCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 }
    for (const b of openBlockers) {
      const key = (b.severity || 'medium') as keyof typeof counts
      if (key in counts) counts[key] += 1
    }
    return counts
  }, [openBlockers])

  const isLoading = sprintsLoading || standupsLoading || blockersLoading
  const maxSeverity = Math.max(...Object.values(severityCounts), 1)

  return (
    <MainLayout title="Analytics">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl">Org counts</h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Live totals from this org — not forecasted velocity or invented health scores.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {isLoading
            ? 'Loading org data…'
            : `${sprints?.length ?? 0} sprints · ${standups?.length ?? 0} standups · ${openBlockers.length} open blockers${
                activeSprint ? ` · ${activeSprint.name} is current` : ''
              }`}
        </p>

        <div className="grid lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">Open blockers by severity</CardTitle>
              <CardDescription>From extracted standup blockers still unresolved.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {blockersLoading && <p className="text-sm text-muted-foreground">Loading blockers…</p>}
              {!blockersLoading && openBlockers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  None open.{' '}
                  <Link href="/standups" className="text-primary hover:underline">
                    Log a standup
                  </Link>{' '}
                  that mentions a wait.
                </p>
              )}
              {!blockersLoading &&
                openBlockers.length > 0 &&
                (['critical', 'high', 'medium', 'low'] as const).map((level) => (
                  <div key={level} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{level}</span>
                      <span className="tabular-nums text-muted-foreground">{severityCounts[level]}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          level === 'critical' || level === 'high' ? 'bg-destructive' : 'bg-primary'
                        }`}
                        style={{ width: `${(severityCounts[level] / maxSeverity) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">Sprints</CardTitle>
              <CardDescription>Windows stored for this org.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {sprintsLoading && <p className="text-sm text-muted-foreground">Loading sprints…</p>}
              {!sprintsLoading && (!sprints || sprints.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No sprints yet.{' '}
                  <Link href="/sprints" className="text-primary hover:underline">
                    Create one
                  </Link>
                </p>
              )}
              {(sprints || []).slice(0, 8).map((sprint: { id: number; name: string; startDate: string; endDate: string }) => (
                <div key={sprint.id} className="rounded-xl border border-border p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{sprint.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(sprint.startDate), 'MMM d')} – {format(new Date(sprint.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Link href="/sprints" className="text-xs text-primary hover:underline shrink-0">
                    Open
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
