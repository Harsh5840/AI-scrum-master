'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import { format } from 'date-fns'
import {
  PlusIcon,
  CalendarIcon,
  TrashIcon,
  Pencil1Icon,
  PlayIcon,
  CheckCircledIcon
} from '@radix-ui/react-icons'

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

  const getSprintStatus = (sprint: any) => {
    const now = new Date()
    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)

    if (now < startDate) return { status: 'upcoming', color: 'bg-white/10 text-white/60' }
    if (now > endDate) return { status: 'completed', color: 'bg-emerald-500/20 text-emerald-400' }
    return { status: 'active', color: 'bg-purple-500/20 text-purple-400' }
  }

  if (error) {
    return (
      <MainLayout title="Sprints">
        <div className="text-center space-y-4 py-20">
          <div className="text-red-400">Error loading sprints</div>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Retry
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Sprints">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Sprints</h1>
            <p className="text-white/40 text-sm mt-1">
              Manage your development sprints and track progress
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Sprint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0f] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Sprint</DialogTitle>
                <DialogDescription className="text-white/50">
                  Set up a new development sprint with timeline and goals.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white/70">Sprint Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sprint 1 - Feature Development"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startDate" className="text-white/70">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate" className="text-white/70">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateSprint} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                  Create Sprint
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-2">
          {['all', 'active', 'completed'].map((f) => (
            <Button
              key={f}
              variant="outline"
              className={`border-white/10 ${filter === f ? 'bg-white/10 text-white' : 'bg-transparent text-white/50 hover:bg-white/5 hover:text-white'}`}
              onClick={() => dispatch(setFilter(f as any))}
            >
              {f === 'all' ? 'All Sprints' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Sprints table */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Sprint Overview</CardTitle>
            <CardDescription className="text-white/40">
              Track all your development sprints and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px] bg-white/10" />
                      <Skeleton className="h-4 w-[200px] bg-white/5" />
                    </div>
                    <Skeleton className="h-8 w-20 bg-white/10" />
                  </div>
                ))}
              </div>
            ) : !sprints || sprints.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-white/20" />
                <h3 className="mt-4 text-sm font-medium text-white">No sprints</h3>
                <p className="mt-1 text-sm text-white/40">
                  Get started by creating your first sprint.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-white/50">Sprint Name</TableHead>
                    <TableHead className="text-white/50">Status</TableHead>
                    <TableHead className="text-white/50">Start Date</TableHead>
                    <TableHead className="text-white/50">End Date</TableHead>
                    <TableHead className="text-white/50">Duration</TableHead>
                    <TableHead className="text-right text-white/50">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sprints.map((sprint) => {
                    const { status, color } = getSprintStatus(sprint)
                    const startDate = new Date(sprint.startDate)
                    const endDate = new Date(sprint.endDate)
                    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

                    return (
                      <TableRow key={sprint.id} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell className="font-medium text-white">{sprint.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
                            {status === 'active' && <PlayIcon className="h-3 w-3" />}
                            {status === 'completed' && <CheckCircledIcon className="h-3 w-3" />}
                            {status}
                          </span>
                        </TableCell>
                        <TableCell className="text-white/60">{format(startDate, 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-white/60">{format(endDate, 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-white/60">{duration} days</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/5">
                              <Pencil1Icon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSprint(sprint.id)}
                              className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10"
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
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}