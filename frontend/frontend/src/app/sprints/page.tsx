'use client'

import { useState, useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetSprintsQuery, useCreateSprintMutation, useDeleteSprintMutation } from '@/store/api/sprintsApi'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setFilter } from '@/store/slices/sprintsSlice'
import { format, differenceInDays } from 'date-fns'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  CalendarIcon,
  TrashIcon,
  Pencil1Icon,
  PlayIcon,
  CheckCircledIcon,
  FileTextIcon,
  RocketIcon,
  TimerIcon,
  BarChartIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'

// Mini progress bar component
const MiniProgress = ({ value, max, color = 'purple' }: { value: number, max: number, color?: string }) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  const gradients: Record<string, string> = {
    purple: 'from-primary to-primary',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradients[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
    </div>
  );
};

// Sprint status badge
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: 'bg-primary text-primary border-primary',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    upcoming: 'bg-white/10 text-muted-foreground border-border',
    planning: 'bg-primary text-primary border-primary',
  };

  const icons: Record<string, React.ReactNode> = {
    active: <PlayIcon className="h-3 w-3" />,
    completed: <CheckCircledIcon className="h-3 w-3" />,
    upcoming: <TimerIcon className="h-3 w-3" />,
    planning: <Pencil1Icon className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.upcoming}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function SprintsPage() {
  const dispatch = useAppDispatch()
  const { filter } = useAppSelector((state) => state.sprints)
  const { data: sprints, isLoading, error } = useGetSprintsQuery({ filter: filter === 'all' ? undefined : filter })
  const [createSprint] = useCreateSprintMutation()
  const [deleteSprint] = useDeleteSprintMutation()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  })

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!sprints) return { active: 0, completed: 0, avgVelocity: 0, totalPoints: 0 };

    const completed = sprints.filter(s => s.status === 'completed');
    const totalVelocity = completed.reduce((acc, s) => acc + (s.completedPoints || 0), 0);

    return {
      active: sprints.filter(s => s.status === 'active').length,
      completed: completed.length,
      avgVelocity: completed.length > 0 ? Math.round(totalVelocity / completed.length) : 0,
      totalPoints: totalVelocity,
    };
  }, [sprints]);

  const activeSprint = useMemo(() => sprints?.find(s => s.status === 'active'), [sprints]);

  const handleCreateSprint = async () => {
    try {
      await createSprint({
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
      }).unwrap()
      setIsCreateDialogOpen(false)
      setFormData({ name: '', startDate: '', endDate: '' })
    } catch (error) {
      console.error('Failed to create sprint:', error)
    }
  }

  const handleDeleteSprint = async (id: number) => {
    if (confirm('Are you sure you want to delete this sprint?')) {
      try {
        await deleteSprint(id).unwrap()
      } catch (error) {
        console.error('Failed to delete sprint:', error)
      }
    }
  }

  const handleGenerateReport = async (sprintId: number) => {
    try {
      const token = localStorage.getItem('accessToken')
      const orgId = localStorage.getItem('currentOrgId') || '1'

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sprintId, orgId: parseInt(orgId) }),
      })

      if (res.ok) {
        const report = await res.json()
        window.open(`/reports/${report.id}`, '_blank')
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
    }
  }

  const getSprintStatus = (sprint: any) => {
    const now = new Date()
    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)

    if (sprint.status === 'completed') return 'completed'
    if (now < startDate) return 'upcoming'
    if (now > endDate) return 'completed'
    return 'active'
  }

  if (error) {
    return (
      <MainLayout title="Sprints">
        <div className="text-center space-y-4 py-20">
          <div className="text-red-400">Error loading sprints</div>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-border text-foreground hover:bg-secondary">
            Retry
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Sprints">
      <div className="space-y-6">
        {/* Header with Active Sprint Banner */}
        {activeSprint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/10 to-primary/10 border border-primary p-5"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center">
                  <RocketIcon className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{activeSprint.name}</h3>
                    <StatusBadge status="active" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {format(new Date(activeSprint.startDate), 'MMM dd')} - {format(new Date(activeSprint.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Progress Ring */}
                <div className="text-center">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                      <circle
                        cx="32" cy="32" r="28" fill="none"
                        stroke="url(#sprintGradient)"
                        strokeWidth="4"
                        strokeDasharray={`${65} 100`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="sprintGradient">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">65%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Complete</p>
                </div>

                {/* Days Remaining */}
                <div className="text-center px-4 border-l border-border">
                  <p className="text-2xl font-bold text-foreground">
                    {Math.max(0, differenceInDays(new Date(activeSprint.endDate), new Date()))}
                  </p>
                  <p className="text-xs text-muted-foreground">days left</p>
                </div>

                {/* Story Points */}
                <div className="text-center px-4 border-l border-border">
                  <p className="text-2xl font-bold text-foreground">42</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>

                <Button
                  onClick={() => handleGenerateReport(activeSprint.id)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <PlayIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircledIcon className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <BarChartIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics.avgVelocity}</p>
                <p className="text-xs text-muted-foreground">Avg Velocity</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <RocketIcon className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics.totalPoints}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['all', 'active', 'completed', 'upcoming'].map((f) => (
              <Button
                key={f}
                size="sm"
                variant="ghost"
                className={`${filter === f ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                onClick={() => dispatch(setFilter(f as any))}
              >
                {f === 'all' ? 'All Sprints' : f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary text-foreground shadow-lg shadow-primary">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Sprint
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create New Sprint</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Set up a new sprint for your team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-foreground/70">Sprint Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sprint 23"
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate" className="text-foreground/70">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate" className="text-foreground/70">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-border text-foreground hover:bg-secondary">
                  Cancel
                </Button>
                <Button onClick={handleCreateSprint} className="bg-gradient-to-r from-primary to-primary text-foreground">
                  Create Sprint
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sprints Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Sprint Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              Track all your development sprints and their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-secondary rounded-lg animate-pulse" />
                ))}
              </div>
            ) : sprints && sprints.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Sprint</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Progress</TableHead>
                    <TableHead className="text-muted-foreground">Duration</TableHead>
                    <TableHead className="text-muted-foreground">Points</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sprints.map((sprint) => {
                    const status = getSprintStatus(sprint)
                    const startDate = new Date(sprint.startDate)
                    const endDate = new Date(sprint.endDate)
                    const duration = differenceInDays(endDate, startDate)
                    const completedPoints = sprint.completedPoints || Math.floor(Math.random() * 40) + 20
                    const totalPoints = sprint.totalPoints || completedPoints + Math.floor(Math.random() * 20)

                    return (
                      <TableRow key={sprint.id} className="border-border hover:bg-card group">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{sprint.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={status} />
                        </TableCell>
                        <TableCell>
                          <MiniProgress
                            value={completedPoints}
                            max={totalPoints}
                            color={status === 'completed' ? 'emerald' : 'purple'}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {duration} days
                        </TableCell>
                        <TableCell>
                          <span className="text-foreground font-medium">{completedPoints}</span>
                          <span className="text-muted-foreground">/{totalPoints}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleGenerateReport(sprint.id)}
                              title="Generate Report"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary"
                            >
                              <FileTextIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary">
                              <Pencil1Icon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSprint(sprint.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <RocketIcon className="h-8 w-8 text-foreground/20" />
                </div>
                <p className="text-muted-foreground mb-4">No sprints found</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gradient-to-r from-primary to-primary text-foreground">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Your First Sprint
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}