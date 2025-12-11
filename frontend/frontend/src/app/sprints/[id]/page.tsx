'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
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
import { useGetSprintQuery } from '@/store/api/sprintsApi'
import { useGetBacklogItemsQuery, useCreateBacklogItemMutation } from '@/store/api/backlogApi'
import { format } from 'date-fns'
import { 
  ArrowLeftIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  PersonIcon,
  ChatBubbleIcon,
  StarIcon
} from '@radix-ui/react-icons'

export default function SprintDetailPage() {
  const params = useParams()
  const sprintId = parseInt(params.id as string)
  const { data: sprintData, isLoading, error } = useGetSprintQuery(sprintId)
  const sprint = sprintData?.sprint
  
  // Fetch backlog items for this sprint
  const { data: backlogItems = [], isLoading: backlogLoading } = useGetBacklogItemsQuery({ sprintId })
  const [createBacklogItem] = useCreateBacklogItemMutation()
  
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    storyPoints: 0,
    assignee: '',
    tags: [] as string[]
  })

  const handleAddItem = async () => {
    try {
      await createBacklogItem({
        title: newItem.title,
        description: newItem.description,
        priority: newItem.priority,
        storyPoints: newItem.storyPoints,
        assignee: newItem.assignee || undefined,
        tags: newItem.tags,
        sprintId,
        status: 'todo'
      }).unwrap()
      
      setIsAddItemDialogOpen(false)
      setNewItem({ title: '', description: '', priority: 'medium', storyPoints: 0, assignee: '', tags: [] })
    } catch (err) {
      console.error('Failed to create backlog item:', err)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'outline'
      case 'in-progress': return 'default'
      case 'done': return 'secondary'
      default: return 'outline'
    }
  }

  if (isLoading) {
    return (
      <MainLayout title="Sprint Details">
        <div className="text-center">Loading sprint details...</div>
      </MainLayout>
    )
  }

  if (error || !sprint) {
    return (
      <MainLayout title="Sprint Details">
        <div className="text-center text-red-500">Error loading sprint details</div>
      </MainLayout>
    )
  }

  const { status, color } = getSprintStatus(sprint)
  const startDate = new Date(sprint.startDate)
  const endDate = new Date(sprint.endDate)
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  const completedItems = backlogItems.filter(item => item.status === 'done').length
  const totalItems = backlogItems.length
  const totalStoryPoints = backlogItems.reduce((sum, item) => sum + (item.storyPoints || 0), 0)
  const completedStoryPoints = backlogItems
    .filter(item => item.status === 'done')
    .reduce((sum, item) => sum + (item.storyPoints || 0), 0)

  return (
    <MainLayout title={sprint.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">{sprint.name}</h1>
              <Badge variant={color as any}>{status}</Badge>
            </div>
            <p className="text-muted-foreground">
              {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
            </p>
          </div>
          
          <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Backlog Item</DialogTitle>
                <DialogDescription>
                  Add a new item to the sprint backlog.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Feature or task title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Brief description of the work"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select 
                      id="priority"
                      value={newItem.priority}
                      onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })}
                      className="px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="storyPoints">Story Points</Label>
                    <Input
                      id="storyPoints"
                      type="number"
                      value={newItem.storyPoints}
                      onChange={(e) => setNewItem({ ...newItem, storyPoints: parseInt(e.target.value) || 0 })}
                      min="0"
                      max="20"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddItemDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sprint metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDays}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysRemaining}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Completed</CardTitle>
              <TargetIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedItems}/{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedItems / totalItems) * 100)}% complete
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Story Points</CardTitle>
              <StarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedStoryPoints}/{totalStoryPoints}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedStoryPoints / totalStoryPoints) * 100)}% burned
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Backlog items */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Backlog</CardTitle>
            <CardDescription>
              All items planned for this sprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Story Points</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backlogItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(item.priority || 'medium') as any}>
                        {item.priority || 'medium'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(item.status || 'todo') as any}>
                        {(item.status || 'todo').replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <PersonIcon className="h-4 w-4" />
                        <span>{item.assignee}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.storyPoints}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {(item.tags || []).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}