'use client'

import { useState } from 'react'
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
import { format } from 'date-fns'
import { 
  PlusIcon, 
  CalendarIcon, 
  TrashIcon,
  Pencil1Icon,
  PlayIcon,
  StopIcon 
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
    
    if (now < startDate) return { status: 'upcoming', color: 'secondary' }
    if (now > endDate) return { status: 'completed', color: 'outline' }
    return { status: 'active', color: 'default' }
  }

  if (error) {
    return (
      <MainLayout title="Sprints">
        <div className="text-center text-red-500">Error loading sprints</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Sprints">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sprints</h1>
            <p className="text-muted-foreground">
              Manage your development sprints and track progress
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                New Sprint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Sprint</DialogTitle>
                <DialogDescription>
                  Set up a new development sprint with timeline and goals.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Sprint Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sprint 1 - Feature Development"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateSprint}>
                  Create Sprint
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => dispatch(setFilter('all'))}
          >
            All Sprints
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => dispatch(setFilter('active'))}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => dispatch(setFilter('completed'))}
          >
            Completed
          </Button>
        </div>

        {/* Sprints table */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Overview</CardTitle>
            <CardDescription>
              Track all your development sprints and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading sprints...</div>
            ) : !sprints || sprints.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No sprints</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get started by creating your first sprint.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sprint Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sprints.map((sprint) => {
                    const { status, color } = getSprintStatus(sprint)
                    const startDate = new Date(sprint.startDate)
                    const endDate = new Date(sprint.endDate)
                    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
                    
                    return (
                      <TableRow key={sprint.id}>
                        <TableCell className="font-medium">{sprint.name}</TableCell>
                        <TableCell>
                          <Badge variant={color as any}>
                            {status === 'active' && <PlayIcon className="mr-1 h-3 w-3" />}
                            {status === 'completed' && <StopIcon className="mr-1 h-3 w-3" />}
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(startDate, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{format(endDate, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{duration} days</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Pencil1Icon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteSprint(sprint.id)}
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