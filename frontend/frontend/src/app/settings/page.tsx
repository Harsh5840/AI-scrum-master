'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { useGetQueueStatusQuery } from '@/store/api/workflowsApi'
import { PageEnter } from '@/components/brand/PageEnter'

const tabs = [
  { id: 'account', label: 'Account' },
  { id: 'slack', label: 'Slack' },
  { id: 'workers', label: 'Workers' },
] as const

function SettingsBody() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const initial = (searchParams.get('tab') as (typeof tabs)[number]['id']) || 'account'
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>(
    tabs.some((t) => t.id === initial) ? initial : 'account'
  )

  const { data, isLoading, refetch, isFetching } = useGetQueueStatusQuery(undefined, {
    pollingInterval: tab === 'workers' ? 10000 : 0,
  })
  const ai = data?.queues?.aiWorkflows
  const waiting = ai?.waiting ?? data?.waiting ?? 0
  const active = ai?.active ?? data?.active ?? 0
  const completed = ai?.completed ?? data?.completed ?? 0
  const failed = ai?.failed ?? data?.failed ?? 0

  return (
    <MainLayout title="Settings">
      <PageEnter className="max-w-2xl mx-auto space-y-8">
        <h2 className="font-display text-3xl">Settings</h2>
        <div className="flex gap-1" role="tablist" aria-label="Settings">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`px-3 min-h-9 rounded-full text-sm ${
                tab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'account' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="mt-1">{user?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1">{user?.email || '—'}</p>
            </div>
            <Link href="/settings/team" className="text-sm text-primary hover:underline inline-block">
              Team members
            </Link>
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  dispatch(logout())
                  router.push('/')
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        )}

        {tab === 'slack' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Slack is the only connector with a live OAuth check.
            </p>
            <Link href="/settings/integrations" className="text-sm text-primary hover:underline">
              Open Slack connection
            </Link>
          </div>
        )}

        {tab === 'workers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground tabular-nums">
                {isLoading
                  ? 'Loading queue counts…'
                  : `${waiting} waiting · ${active} active · ${completed} completed · ${failed} failed`}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? 'Refreshing…' : 'Refresh'}
              </Button>
            </div>
            <pre className="rounded-xl border border-border p-4 font-mono text-xs overflow-x-auto">
              {`ai-workflows: ${JSON.stringify(ai || {}, null, 2)}`}
            </pre>
            <p className="text-sm text-muted-foreground">
              If REDIS_URL is unset, jobs run inline and counts may stay at zero.
            </p>
          </div>
        )}
      </PageEnter>
    </MainLayout>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<MainLayout title="Settings"><p className="text-sm text-muted-foreground">Loading…</p></MainLayout>}>
      <SettingsBody />
    </Suspense>
  )
}
