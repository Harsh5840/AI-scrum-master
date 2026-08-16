'use client'

import { useMemo, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { PlusIcon, FileTextIcon, TrashIcon } from '@radix-ui/react-icons'

const filters = ['all', 'active', 'completed'] as const

function sprintStatus(sprint: { status?: string; startDate: string; endDate: string }) {
  const now = new Date()
  const startDate = new Date(sprint.startDate)
  const endDate = new Date(sprint.endDate)

  if (sprint.status === 'completed' || now > endDate) return 'completed'
  if (now < startDate) return 'upcoming'
  return 'active'
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'active'
      ? 'border-primary/40 text-primary'
      : status === 'completed'
        ? 'border-border text-muted-foreground'
        : 'border-border text-muted-foreground'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs capitalize border ${tone}`}>
      {status}
    </span>
  )
}

export default function SprintsPage() {
  const dispatch = useAppDispatch()
  const { filter } = useAppSelector((state) => state.sprints)
  const { data: sprints, isLoading, error } = useGetSprintsQuery({
    filter: filter === 'all' ? undefined : filter,
  })
  const [createSprint, { isLoading: creating }] = useCreateSprintMutation()
  const [deleteSprint, { isLoading: deleting }] = useDeleteSprintMutation()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  })

  const activeSprint = useMemo(
    () => sprints?.find((s) => sprintStatus(s) === 'active'),
    [sprints]
  )

  const handleCreateSprint = async () => {
    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      setFormError('Name, start date, and end date are required.')
      return
    }
    if (formData.endDate < formData.startDate) {
      setFormError('End date must be on or after the start date.')
      return
    }

    try {
      setFormError('')
      await createSprint({
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
      }).unwrap()
      setIsCreateDialogOpen(false)
      setFormData({ name: '', startDate: '', endDate: '' })
    } catch {
      setFormError('Could not create the sprint. Check the backend and try again.')
    }
  }

  const handleDeleteSprint = async (id: number) => {
    if (!confirm('Delete this sprint? Standups tied to it stay in the org.')) return
    try {
      await deleteSprint(id).unwrap()
    } catch {
      setFormError('Could not delete the sprint.')
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
    } catch (err) {
      console.error('Failed to generate report:', err)
    }
  }

  if (error) {
    return (
      <MainLayout title="Sprints">
        <div className="text-center space-y-4 py-20">
          <p role="alert" className="text-destructive">
            Could not load sprints.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Sprints">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Sprint windows</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              {activeSprint
                ? `${activeSprint.name} · ${Math.max(0, differenceInDays(new Date(activeSprint.endDate), new Date()))} days left`
                : 'No active sprint — create one to scope standups'}
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4" />
                New sprint
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create sprint</DialogTitle>
                <DialogDescription>Name and date range for this org.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                {formError && (
                  <p role="alert" className="text-sm text-destructive">
                    {formError}
                  </p>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="sprint-name">Sprint name</Label>
                  <Input
                    id="sprint-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sprint 12"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSprint} disabled={creating}>
                  {creating ? 'Creating…' : 'Create sprint'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter sprints">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`min-h-10 px-3 rounded-lg text-sm border ${
                filter === f
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => dispatch(setFilter(f))}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display">Overview</CardTitle>
            <CardDescription>Dates and status from Postgres — no invented velocity.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading sprints…</p>
            ) : sprints && sprints.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sprint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sprints.map((sprint) => {
                    const status = sprintStatus(sprint)
                    const startDate = new Date(sprint.startDate)
                    const endDate = new Date(sprint.endDate)
                    const duration = differenceInDays(endDate, startDate)
                    const hasPoints =
                      typeof sprint.completedPoints === 'number' &&
                      typeof sprint.totalPoints === 'number'

                    return (
                      <TableRow key={sprint.id}>
                        <TableCell>
                          <p className="font-medium">{sprint.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(startDate, 'MMM d')} – {format(endDate, 'MMM d, yyyy')}
                          </p>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={status} />
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {duration} days
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {hasPoints
                            ? `${sprint.completedPoints}/${sprint.totalPoints}`
                            : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleGenerateReport(sprint.id)}
                              aria-label={`Generate report for ${sprint.name}`}
                            >
                              <FileTextIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSprint(sprint.id)}
                              disabled={deleting}
                              aria-label={`Delete ${sprint.name}`}
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
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground mb-4">No sprints in this filter.</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <PlusIcon className="h-4 w-4" />
                  Create a sprint
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
