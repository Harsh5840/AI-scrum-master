'use client'

import { useMemo, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useGetStandupsQuery, useCreateStandupMutation } from '@/store/api/standupsApi'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useAppSelector } from '@/store/hooks'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { PaperPlaneIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useToast } from '@/hooks/use-toast'

export default function StandupsPage() {
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
      (s: any) =>
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

      const detected = (result as any)?.blockers?.length || 0
      toast({
        title: 'Standup logged',
        description:
          detected > 0
            ? `Detected ${detected} blocker(s). Check the Blockers page.`
            : 'Summary saved. AI jobs queued when Redis is available.',
      })
    } catch (err: any) {
      toast({
        title: 'Failed to save standup',
        description: err?.data?.error || 'Try again',
      })
    }
  }

  return (
    <MainLayout title="Standups">
      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Log standup</CardTitle>
              <CardDescription>
                {activeSprint
                  ? `Linked to ${activeSprint.name}`
                  : 'No active sprint — still saved to your org'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Yesterday</Label>
                  <Textarea
                    value={formData.yesterday}
                    onChange={(e) => setFormData((f) => ({ ...f, yesterday: e.target.value }))}
                    placeholder="Shipped standup ingest…"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Today</Label>
                  <Textarea
                    value={formData.today}
                    onChange={(e) => setFormData((f) => ({ ...f, today: e.target.value }))}
                    placeholder="Working on blocker extraction…"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-500" />
                    Blockers
                  </Label>
                  <Textarea
                    value={formData.blockers}
                    onChange={(e) => setFormData((f) => ({ ...f, blockers: e.target.value }))}
                    placeholder="Blocked waiting on API credentials from platform…"
                    rows={3}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Mentions of blocked/waiting/stuck trigger structured detection.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <PaperPlaneIcon className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving…' : 'Submit standup'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-3 space-y-3">
          <h3 className="font-display text-lg">Recent</h3>
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && (!standups || standups.length === 0) && (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground text-center">
                No standups yet. Submit one with a real blocker phrase to demo detection.
              </CardContent>
            </Card>
          )}
          {(standups || []).map((s: any, i: number) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{s.user?.name || 'Teammate'}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{s.summary}</p>
                  {s.blockers?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.blockers.map((b: any) => (
                        <span
                          key={b.id}
                          className="text-[10px] px-2 py-0.5 rounded-md border border-amber-500/30 text-amber-500"
                        >
                          {b.severity}: {b.description.slice(0, 40)}
                          {b.description.length > 40 ? '…' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
