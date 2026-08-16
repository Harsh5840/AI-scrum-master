'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetBlockersQuery } from '@/store/api/blockersApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { useAppSelector } from '@/store/hooks'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRightIcon } from '@radix-ui/react-icons'

export default function Dashboard() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery(
    {},
    { skip: !isAuthenticated }
  )
  const { data: blockers, isLoading: blockersLoading } = useGetBlockersQuery(undefined, {
    skip: !isAuthenticated,
  })
  const { data: standups, isLoading: standupsLoading } = useGetStandupsQuery(
    {},
    { skip: !isAuthenticated }
  )

  const activeSprint = useMemo(() => {
    const now = Date.now()
    return sprints?.find(
      (s: any) =>
        new Date(s.startDate).getTime() <= now && new Date(s.endDate).getTime() >= now
    )
  }, [sprints])

  const daysRemaining = useMemo(() => {
    if (!activeSprint) return 0
    return Math.max(
      0,
      Math.ceil(
        (new Date(activeSprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    )
  }, [activeSprint])

  const activeBlockers = useMemo(
    () => (blockers || []).filter((b: any) => b.status !== 'resolved'),
    [blockers]
  )
  const criticalCount = activeBlockers.filter(
    (b: any) => b.severity === 'critical' || b.severity === 'high'
  ).length

  const recentStandups = useMemo(() => [...(standups || [])].slice(0, 5), [standups])
  const firstName = user?.name?.split(' ')[0] || 'Team'
  const loading = sprintsLoading || blockersLoading || standupsLoading

  return (
    <ProtectedRoute>
      <MainLayout title="Dashboard">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl">{firstName}, here&apos;s the signal</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                {loading
                  ? 'Loading your org…'
                  : activeSprint
                    ? `${activeSprint.name} · ${daysRemaining} days left · ${activeBlockers.length} open blockers`
                    : 'No active sprint — create one to start the loop'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/standups">Log standup</Link>
              </Button>
              <Button asChild>
                <Link href="/ai-insights">
                  Ask AI <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-display">Open blockers</CardTitle>
                <Link href="/blockers" className="text-xs text-primary hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {blockersLoading && (
                  <p className="text-sm text-muted-foreground">Loading blockers…</p>
                )}
                {!blockersLoading && activeBlockers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    None open.{' '}
                    <Link href="/standups" className="text-primary hover:underline">
                      Log a standup
                    </Link>{' '}
                    that mentions a wait or block.
                  </p>
                )}
                {activeBlockers.slice(0, 5).map((b: any) => (
                  <div
                    key={b.id}
                    className="rounded-xl border border-border p-3 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{b.description}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {b.type} · {b.severity}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md border shrink-0 capitalize ${
                        b.severity === 'critical' || b.severity === 'high'
                          ? 'border-destructive/40 text-destructive'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {b.severity}
                    </span>
                  </div>
                ))}
                {!blockersLoading && criticalCount > 0 && (
                  <p className="text-xs text-destructive pt-1">
                    {criticalCount} high or critical need a look
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-display">Recent standups</CardTitle>
                <Link href="/standups" className="text-xs text-primary hover:underline">
                  Log one
                </Link>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {standupsLoading && (
                  <p className="text-sm text-muted-foreground">Loading standups…</p>
                )}
                {!standupsLoading && recentStandups.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No standups yet.{' '}
                    <Link href="/standups" className="text-primary hover:underline">
                      Log the first one
                    </Link>
                  </p>
                )}
                {recentStandups.map((s: any) => (
                  <div key={s.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium">{s.user?.name || 'Teammate'}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{s.summary}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
