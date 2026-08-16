'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetQueueStatusQuery } from '@/store/api/workflowsApi'

export default function WorkflowsPage() {
  const { data, isLoading, refetch, isFetching } = useGetQueueStatusQuery(undefined, {
    pollingInterval: 10000,
  })

  const ai = data?.queues?.aiWorkflows
  const notifications = data?.queues?.notifications

  const cards = [
    { label: 'Waiting', value: ai?.waiting ?? data?.waiting ?? 0 },
    { label: 'Active', value: ai?.active ?? data?.active ?? 0 },
    { label: 'Completed', value: ai?.completed ?? data?.completed ?? 0 },
    { label: 'Failed', value: ai?.failed ?? data?.failed ?? 0 },
  ]

  return (
    <MainLayout title="Jobs">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl">BullMQ job status</h2>
            <p className="text-sm text-muted-foreground">
              Standup sentiment, blocker patterns, and sprint health run on Redis-backed workers
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardHeader className="pb-2">
                <CardDescription>{c.label}</CardDescription>
                <CardTitle className="font-display text-3xl">
                  {isLoading ? '…' : c.value}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display">Queues</CardTitle>
            <CardDescription>Raw counts from the backend queue manager</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border border-border p-4 font-mono text-xs space-y-1">
              <div>ai-workflows: {JSON.stringify(ai || {})}</div>
              <div>notifications: {JSON.stringify(notifications || {})}</div>
            </div>
            <p className="text-muted-foreground text-xs">
              If REDIS_URL is unset, jobs run inline and counts may stay at zero. Set REDIS_URL
              (or docker-compose redis) for real BullMQ workers.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
