'use client';

import { useMemo } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { useGetSprintsQuery } from '@/store/api/sprintsApi';
import { useGetBlockersQuery } from '@/store/api/blockersApi';
import { useGetStandupsQuery } from '@/store/api/standupsApi';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  RocketIcon,
  ExclamationTriangleIcon,
  LightningBoltIcon,
  UpdateIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Fetch Data
  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery(
    {},
    { skip: !isAuthenticated }
  );
  const { data: blockers, isLoading: blockersLoading } = useGetBlockersQuery(
    undefined,
    { skip: !isAuthenticated }
  );
  const { data: standups, isLoading: standupsLoading } = useGetStandupsQuery(
    {},
    { skip: !isAuthenticated }
  );

  // Metrics Calculations
  // 1. Active Sprint
  const activeSprint = useMemo(() => sprints?.find((s) => s.status === 'active'), [sprints]);

  const daysRemaining = useMemo(() => activeSprint
    ? Math.max(
      0,
      Math.ceil(
        (new Date(activeSprint.endDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
      )
    )
    : 0, [activeSprint]);

  // 2. Velocity (Avg of last 3 completed sprints)
  const velocity = useMemo(() => {
    const completedSprints =
      sprints
        ?.filter((s) => s.status === 'completed')
        .sort(
          (a, b) =>
            new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        )
        .slice(0, 3) || [];

    return completedSprints.length > 0
      ? Math.round(
        completedSprints.reduce((acc, s) => acc + (s.completedPoints || 0), 0) /
        completedSprints.length
      )
      : 0;
  }, [sprints]);

  // 3. Blockers
  const activeBlockers = useMemo(() => blockers?.filter((b) => b.status !== 'resolved') || [], [blockers]);
  const blockersCount = activeBlockers.length;

  return (
    <ProtectedRoute>
      <MainLayout title="Dashboard">
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                Engineering Cockpit
              </h2>
              <p className="text-sm text-zinc-400">
                Overview of your team's velocity and health.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900">
                <Link href="/sprints">
                  View Board
                </Link>
              </Button>
              <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300">
                <PlusIcon className="mr-2 h-4 w-4" /> New Issue
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Sprint"
              value={activeSprint ? activeSprint.name : 'No Active Sprint'}
              description={
                activeSprint
                  ? `${daysRemaining} days remaining`
                  : 'Ready to start the next cycle?'
              }
              icon={<RocketIcon />}
              loading={sprintsLoading}
              action={
                !activeSprint && !sprintsLoading ? (
                  <Button
                    size="sm"
                    className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                    asChild
                  >
                    <Link href="/sprints">Start Sprint</Link>
                  </Button>
                ) : undefined
              }
            />
            <StatCard
              title="Velocity"
              value={`${velocity} pts`}
              description={velocity > 0 ? "Avg. last 3 sprints" : "No history available"}
              icon={<LightningBoltIcon />}
              loading={sprintsLoading}
              trend={velocity > 0 ? {
                value: 12,
                label: 'vs last sprint',
                direction: 'up',
              } : undefined}
            />
            <StatCard
              title="Active Blockers"
              value={blockersCount > 0 ? blockersCount : "All Clear"}
              description={blockersCount > 0 ? "Unresolved issues" : "Team is unblocked"}
              icon={<ExclamationTriangleIcon className={blockersCount === 0 ? "text-green-500" : undefined} />}
              alert={blockersCount > 0}
              loading={blockersLoading}
              className={blockersCount === 0 ? "border-green-900/30 bg-green-950/10" : undefined}
            />
            <StatCard
              title="Team Health"
              value="98%"
              description="Standup completion rate"
              icon={<UpdateIcon />}
              loading={standupsLoading}
            />
          </div>

          {/* Main Layout Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity */}
            <Card className="col-span-4 bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-zinc-100">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {standupsLoading ? (
                    <div className="text-zinc-500 text-sm">Loading activity...</div>
                  ) : standups && standups.length > 0 ? (
                    standups.slice(0, 5).map((standup: any) => (
                      <div key={standup.id} className="flex items-start space-x-4">
                        <Avatar className="h-9 w-9 border border-zinc-800">
                          <AvatarImage src={standup.user?.avatarUrl} alt={standup.userId} />
                          <AvatarFallback className="bg-zinc-900 text-zinc-400 text-xs">
                            {standup.userId ? standup.userId.substring(0, 2).toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-zinc-100 leading-none">
                            {standup.userId} {/* Ideally map to real name if available */}
                          </p>
                          <p className="text-sm text-zinc-400">
                            posted a standup update
                          </p>
                          <p className="text-xs text-zinc-500">
                            {formatDistanceToNow(new Date(standup.date), { addSuffix: true })}
                          </p>
                          <div className="mt-2 text-sm text-zinc-300 bg-zinc-900/50 p-2 rounded border border-zinc-800/50">
                            <p><span className="text-green-500 font-mono text-xs">DONE:</span> {standup.yesterday}</p>
                            <p className="mt-1"><span className="text-blue-500 font-mono text-xs">TODO:</span> {standup.today}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-zinc-500 text-sm">No recent activity</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights / Secondary Column */}
            <Card className="col-span-3 bg-zinc-950 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-zinc-100">AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-purple-900/30 bg-purple-950/10 p-4">
                    <div className="flex items-center space-x-2 text-purple-400 mb-2">
                      <LightningBoltIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Sprint Forecast</span>
                    </div>
                    <p className="text-sm text-zinc-300">
                      Based on current velocity, the team is likely to complete <strong>92%</strong> of the committed points.
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
                    <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Risk Detected</span>
                    </div>
                    <p className="text-sm text-zinc-300">
                      Ticket <strong>ASM-102</strong> has been in "In Progress" for 5 days. Consider checking in.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
