'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useGetStandupsQuery, useCreateStandupMutation } from '@/store/api/standupsApi'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setDateFilter } from '@/store/slices/standupsSlice'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import {
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  PersonIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons'

export default function StandupsPage() {
  const dispatch = useAppDispatch()
  const { dateFilter } = useAppSelector((state) => state.standups)
  const { data: standups, isLoading, error } = useGetStandupsQuery({
    sprintId: dateFilter ? undefined : undefined
  })
  const [createStandup] = useCreateStandupMutation()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    userId: 1
  })

  const handleCreateStandup = async () => {
    try {
      await createStandup({
        userId: formData.userId,
        summary: formData.summary,
        description: formData.description || undefined,
      }).unwrap()
      setIsCreateDialogOpen(false)
      setFormData({ summary: '', description: '', userId: 1 })
    } catch (error) {
      console.error('Failed to create standup:', error)
    }
  }

  const hasBlockers = (standup: any) => {
    return standup.blockers && standup.blockers.length > 0
  }

  const getDateDisplayText = (dateString: string) => {
    const standupDate = parseISO(dateString)
    if (isToday(standupDate)) return 'Today'
    if (isYesterday(standupDate)) return 'Yesterday'
    return format(standupDate, 'MMM dd, yyyy')
  }

  if (error) {
    return (
      <MainLayout title="Daily Standups">
        <div className="text-center py-20">
          <div className="text-red-400">Error loading standups</div>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-white/10 text-white hover:bg-white/5">
            Retry
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Daily Standups">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Daily Standups</h1>
            <p className="text-white/40 text-sm mt-1">
              Track daily progress and identify blockers
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Standup
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#0a0a0f] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Daily Standup Update</DialogTitle>
                <DialogDescription className="text-white/50">
                  Share your progress summary and any additional details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="summary" className="text-white/70">Summary</Label>
                  <textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief summary of your progress and plans..."
                    className="min-h-[100px] px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 resize-none focus:border-purple-500/50 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-white/70">Additional Details (Optional)</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Any additional context, blockers, or notes..."
                    className="min-h-[80px] px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 resize-none focus:border-purple-500/50 focus:outline-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-white/10 text-white hover:bg-white/5">
                  Cancel
                </Button>
                <Button onClick={handleCreateStandup} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                  Submit Standup
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Date filter */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="dateFilter" className="text-white/60">Filter by date:</Label>
          <Input
            id="dateFilter"
            type="date"
            value={dateFilter || format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => dispatch(setDateFilter(e.target.value))}
            className="w-auto bg-white/5 border-white/10 text-white"
          />
          <Button
            variant="outline"
            onClick={() => dispatch(setDateFilter(format(new Date(), 'yyyy-MM-dd')))}
            className="border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
          >
            Today
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Total Updates</CardTitle>
              <PersonIcon className="h-4 w-4 text-white/30" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{standups?.length || 0}</div>
              <p className="text-xs text-white/40">
                for {getDateDisplayText(dateFilter || format(new Date(), 'yyyy-MM-dd'))}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Active Blockers</CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-amber-400/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {standups?.filter(s => hasBlockers(s)).length || 0}
              </div>
              <p className="text-xs text-white/40">need attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Team Participation</CardTitle>
              <CheckCircledIcon className="h-4 w-4 text-emerald-400/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {standups ? Math.round((standups.length / 5) * 100) : 0}%
              </div>
              <p className="text-xs text-white/40">of expected updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Standups list */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Standup Updates</CardTitle>
            <CardDescription className="text-white/40">
              Daily progress updates from the team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-white/5 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32 bg-white/10" />
                      <Skeleton className="h-6 w-16 bg-white/10" />
                    </div>
                    <Skeleton className="h-4 w-full bg-white/5" />
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                  </div>
                ))}
              </div>
            ) : !standups || standups.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-white/20" />
                <h3 className="mt-4 text-sm font-medium text-white">No standups for this date</h3>
                <p className="mt-1 text-sm text-white/40">
                  Be the first to share your daily update.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {standups.map((standup) => (
                  <div key={standup.id} className="border border-white/5 rounded-lg p-4 space-y-3 hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
                          <PersonIcon className="h-4 w-4 text-white/70" />
                        </div>
                        <span className="font-medium text-white">
                          {standup.user?.name || `User ${standup.userId}`}
                        </span>
                      </div>
                      {hasBlockers(standup) && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          Blocked
                        </span>
                      )}
                    </div>

                    <div className="text-sm space-y-3">
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <h4 className="font-medium text-cyan-400 text-xs mb-1">📝 Summary</h4>
                        <p className="text-white/60">{standup.summary}</p>
                      </div>

                      {(standup as any).description && (
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <h4 className="font-medium text-emerald-400 text-xs mb-1">💡 Details</h4>
                          <p className="text-white/60">{(standup as any).description}</p>
                        </div>
                      )}
                    </div>

                    {hasBlockers(standup) && (
                      <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                        <h4 className="font-medium text-red-400 text-xs mb-2">🚫 Blockers</h4>
                        <div className="space-y-2">
                          {standup.blockers?.map((blocker) => (
                            <div key={blocker.id} className="text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${blocker.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                    blocker.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                      'bg-white/10 text-white/60'
                                  }`}>
                                  {blocker.severity}
                                </span>
                                {blocker.resolved && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                    Resolved
                                  </span>
                                )}
                              </div>
                              <p className="text-white/60 mt-1">{blocker.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-white/30 flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {format(parseISO(standup.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}