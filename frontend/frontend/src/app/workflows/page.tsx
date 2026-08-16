'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetQueueStatusQuery } from '@/store/api/workflowsApi'

export default function WorkflowsPage() {
  const { data, isLoading, refetch, isFetching } = useGetQueueStatusQuery(undefined, {
    pollingInterval: 10000,
  })

  const ai = data?.queues?.aiWorkflows
  const notifications = data?.queues?.notifications

  const waiting = ai?.waiting ?? data?.waiting ?? 0
  const active = ai?.active ?? data?.active ?? 0
  const completed = ai?.completed ?? data?.completed ?? 0
  const failed = ai?.failed ?? data?.failed ?? 0

  return (
    <MainLayout title="Jobs">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">BullMQ status</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Standup sentiment, blocker patterns, and sprint health on Redis-backed workers
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground tabular-nums">
          {isLoading
            ? 'Loading queue counts…'
            : `${waiting} waiting · ${active} active · ${completed} completed · ${failed} failed`}
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display">Queues</CardTitle>
            <CardDescription>Raw counts from the backend queue manager</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <pre className="rounded-xl border border-border p-4 font-mono text-xs overflow-x-auto">
              {`ai-workflows: ${JSON.stringify(ai || {}, null, 2)}\nnotifications: ${JSON.stringify(notifications || {}, null, 2)}`}
            </pre>
            <p className="text-muted-foreground text-sm">
              If REDIS_URL is unset, jobs run inline and counts may stay at zero. Set REDIS_URL
              (or docker-compose redis) for real BullMQ workers.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
