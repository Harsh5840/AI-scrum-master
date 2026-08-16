'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useGetStandupsQuery, useCreateStandupMutation } from '@/store/api/standupsApi'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useAppSelector } from '@/store/hooks'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { PageEnter } from '@/components/brand/PageEnter'

export default function CapturePage() {
  const { user } = useAppSelector((state) => state.auth)
  const { toast } = useToast()
  const { data: standups, isLoading, refetch } = useGetStandupsQuery({})
  const { data: sprints } = useGetSprintsQuery({})
  const [createStandup, { isLoading: isSubmitting }] = useCreateStandupMutation()
  const [formData, setFormData] = useState({
    yesterday: '',
    today: '',
    blockers: '',
  })

  const activeSprint = useMemo(() => {
    const now = Date.now()
    return sprints?.find(
      (s: { startDate: string; endDate: string }) =>
        new Date(s.startDate).getTime() <= now && new Date(s.endDate).getTime() >= now
    )
  }, [sprints])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.yesterday && !formData.today && !formData.blockers) {
      toast({ title: 'Add at least one section', description: 'Yesterday, today, or blockers' })
      return
    }

    try {
      const result = await createStandup({
        userId: user?.id,
        sprintId: activeSprint?.id,
        yesterday: formData.yesterday,
        today: formData.today,
        blockers: formData.blockers,
      }).unwrap()

      setFormData({ yesterday: '', today: '', blockers: '' })
      refetch()

      const detected = (result as { blockers?: unknown[] })?.blockers?.length || 0
      toast({
        title: detected > 0 ? 'Update captured — risk extracted' : 'Update captured',
        description:
          detected > 0
            ? `${detected} item(s) landed in Inbox.`
            : 'Saved. Mention blocked or waiting to extract risk.',
      })
    } catch (err: any) {
      toast({
        title: 'Could not save',
        description: err?.data?.error || 'Try again',
      })
    }
  }

  return (
    <MainLayout title="Capture">
      <PageEnter className="grid lg:grid-cols-[minmax(0,22rem)_1fr] gap-10 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5 lg:sticky lg:top-2 self-start">
          <div>
            <h2 className="font-display text-3xl">Capture</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              {activeSprint
                ? `Scoped to ${activeSprint.name}`
                : 'Paste the update. Risk phrases become inbox items.'}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yesterday">Yesterday</Label>
            <Textarea
              id="yesterday"
              value={formData.yesterday}
              onChange={(e) => setFormData((f) => ({ ...f, yesterday: e.target.value }))}
              placeholder="Shipped the ingest path…"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="today">Today</Label>
            <Textarea
              id="today"
              value={formData.today}
              onChange={(e) => setFormData((f) => ({ ...f, today: e.target.value }))}
              placeholder="Extraction + inbox polish…"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blockers">Stuck on</Label>
            <Textarea
              id="blockers"
              value={formData.blockers}
              onChange={(e) => setFormData((f) => ({ ...f, blockers: e.target.value }))}
              placeholder="Blocked waiting on staging credentials from platform…"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              “Blocked”, “waiting”, or “stuck” extracts a typed inbox row.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Send to inbox'}
          </Button>
        </form>

        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">Feed</p>
          {isLoading && <p className="text-sm text-muted-foreground">Loading updates…</p>}
          {!isLoading && (!standups || standups.length === 0) && (
            <p className="text-sm text-muted-foreground">No captures yet.</p>
          )}
          <ul className="divide-y divide-border">
            {(standups || []).map((s: any) => (
              <li key={s.id} className="py-5 first:pt-0">
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="text-sm font-medium">{s.user?.name || 'Teammate'}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {s.summary}
                </p>
                {s.blockers?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.blockers.map((b: any) => (
                      <Link
                        key={b.id}
                        href="/blockers"
                        className="text-xs text-primary hover:underline"
                      >
                        {b.severity}: {b.description.slice(0, 48)}
                        {b.description.length > 48 ? '…' : ''}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </PageEnter>
    </MainLayout>
  )
}
