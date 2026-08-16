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
import { motion } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  ChatBubbleIcon,
  CalendarIcon,
  LightningBoltIcon,
  ArrowRightIcon,
} from '@radix-ui/react-icons'

export default function Dashboard() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const { data: sprints } = useGetSprintsQuery({}, { skip: !isAuthenticated })
  const { data: blockers } = useGetBlockersQuery(undefined, { skip: !isAuthenticated })
  const { data: standups } = useGetStandupsQuery({}, { skip: !isAuthenticated })

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

  const recentStandups = useMemo(
    () => [...(standups || [])].slice(0, 5),
    [standups]
  )

  return (
    <ProtectedRoute>
      <MainLayout title="Dashboard">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <h2 className="font-display text-2xl">
                {user?.name?.split(' ')[0] || 'Team'}, here&apos;s the signal
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {activeSprint
                  ? `${activeSprint.name} · ${daysRemaining} days left`
                  : 'No active sprint — create one to start the loop'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/standups">Log standup</Link>
              </Button>
              <Button asChild>
                <Link href="/ai-insights">
                  Ask AI <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Active sprint',
                value: activeSprint?.name || '—',
                sub: activeSprint ? `${daysRemaining}d remaining` : 'Create a sprint',
                icon: CalendarIcon,
                href: '/sprints',
              },
              {
                label: 'Standups',
                value: String(standups?.length || 0),
                sub: 'Logged this org',
                icon: ChatBubbleIcon,
                href: '/standups',
              },
              {
                label: 'Open blockers',
                value: String(activeBlockers.length),
                sub: `${criticalCount} high/critical`,
                icon: ExclamationTriangleIcon,
                href: '/blockers',
              },
              {
                label: 'Grounded Q&A',
                value: 'Ask',
                sub: 'Gemini + RAG',
                icon: LightningBoltIcon,
                href: '/ai-insights',
              },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={stat.href}>
                    <Card className="hover:border-primary/40 transition-colors h-full">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </CardTitle>
                        <Icon className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="font-display text-2xl truncate">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-display">Open blockers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeBlockers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No active blockers. Submit a standup that mentions a wait/block to detect one.
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
                      className={`text-[10px] px-2 py-0.5 rounded-md border shrink-0 ${
                        b.severity === 'critical' || b.severity === 'high'
                          ? 'border-destructive/40 text-destructive'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {b.severity}
                    </span>
                  </div>
                ))}
                {activeBlockers.length > 0 && (
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/blockers">View all blockers</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-display">Recent standups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentStandups.length === 0 && (
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
                      <span className="text-xs font-medium">
                        {s.user?.name || 'Teammate'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
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
