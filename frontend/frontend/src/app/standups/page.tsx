'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  CrossCircledIcon,
  QuestionMarkCircledIcon
} from '@radix-ui/react-icons'

export default function StandupsPage() {
  const dispatch = useAppDispatch()
  const { dateFilter } = useAppSelector((state) => state.standups)
  const { data: standups, isLoading, error } = useGetStandupsQuery({ 
    date: dateFilter || format(new Date(), 'yyyy-MM-dd') 
  })
  const [createStandup] = useCreateStandupMutation()
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    yesterday: '',
    today: '',
    blockers: '',
    teamMember: ''
  })

  const handleCreateStandup = async () => {
    try {
      await createStandup({
        date: formData.date,
        yesterday: formData.yesterday,
        today: formData.today,
        blockers: formData.blockers || null,
        teamMember: formData.teamMember,
      }).unwrap()
      setIsCreateDialogOpen(false)
      setFormData({ 
        date: format(new Date(), 'yyyy-MM-dd'),
        yesterday: '', 
        today: '', 
        blockers: '', 
        teamMember: '' 
      })
    } catch (error) {
      console.error('Failed to create standup:', error)
    }
  }

  const getStandupStatus = (standup: any) => {
    const standupDate = parseISO(standup.date)
    if (isToday(standupDate)) return { status: 'today', color: 'default', icon: CheckCircledIcon }
    if (isYesterday(standupDate)) return { status: 'yesterday', color: 'secondary', icon: ClockIcon }
    return { status: 'past', color: 'outline', icon: QuestionMarkCircledIcon }
  }

  const hasBlockers = (standup: any) => {
    return standup.blockers && standup.blockers.trim().length > 0
  }

  const getDateDisplayText = (date: string) => {
    const standupDate = parseISO(date)
    if (isToday(standupDate)) return 'Today'
    if (isYesterday(standupDate)) return 'Yesterday'
    return format(standupDate, 'MMM dd, yyyy')
  }

  if (error) {
    return (
      <MainLayout title="Daily Standups">
        <div className="text-center text-red-500">Error loading standups</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Daily Standups">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Daily Standups</h1>
            <p className="text-muted-foreground">
              Track daily progress and identify blockers
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Standup
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Daily Standup Update</DialogTitle>
                <DialogDescription>
                  Share what you worked on yesterday, plan for today, and note any blockers.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="teamMember">Team Member</Label>
                    <Input
                      id="teamMember"
                      value={formData.teamMember}
                      onChange={(e) => setFormData({ ...formData, teamMember: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="yesterday">What did you work on yesterday?</Label>
                  <textarea
                    id="yesterday"
                    value={formData.yesterday}
                    onChange={(e) => setFormData({ ...formData, yesterday: e.target.value })}
                    placeholder="Describe your completed work..."
                    className="min-h-[80px] px-3 py-2 border border-input bg-background rounded-md resize-none"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="today">What will you work on today?</Label>
                  <textarea
                    id="today"
                    value={formData.today}
                    onChange={(e) => setFormData({ ...formData, today: e.target.value })}
                    placeholder="Describe your planned work..."
                    className="min-h-[80px] px-3 py-2 border border-input bg-background rounded-md resize-none"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="blockers">Any blockers? (Optional)</Label>
                  <textarea
                    id="blockers"
                    value={formData.blockers}
                    onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
                    placeholder="Describe any issues blocking your progress..."
                    className="min-h-[60px] px-3 py-2 border border-input bg-background rounded-md resize-none"
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
                <Button onClick={handleCreateStandup}>
                  Submit Standup
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Date filter */}
        <div className="flex items-center space-x-4">
          <Label htmlFor="dateFilter">Filter by date:</Label>
          <Input
            id="dateFilter"
            type="date"
            value={dateFilter || format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => dispatch(setDateFilter(e.target.value))}
            className="w-auto"
          />
          <Button
            variant="outline"
            onClick={() => dispatch(setDateFilter(format(new Date(), 'yyyy-MM-dd')))}
          >
            Today
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Updates</CardTitle>
              <PersonIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{standups?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                for {getDateDisplayText(dateFilter || format(new Date(), 'yyyy-MM-dd'))}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Blockers</CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {standups?.filter(s => hasBlockers(s)).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                need attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Participation</CardTitle>
              <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {standups ? Math.round((standups.length / 5) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                of expected updates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Standups list */}
        <Card>
          <CardHeader>
            <CardTitle>Standup Updates</CardTitle>
            <CardDescription>
              Daily progress updates from the team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading standups...</div>
            ) : !standups || standups.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No standups for this date</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to share your daily update.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {standups.map((standup) => {
                  const { status, color, icon: StatusIcon } = getStandupStatus(standup)
                  
                  return (
                    <div key={standup.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PersonIcon className="h-4 w-4" />
                          <span className="font-medium">{standup.teamMember}</span>
                          <StatusIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {hasBlockers(standup) && (
                          <Badge variant="destructive">
                            <ExclamationTriangleIcon className="mr-1 h-3 w-3" />
                            Blocked
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-green-600 mb-1">✅ Yesterday</h4>
                          <p className="text-muted-foreground">{standup.yesterday}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-600 mb-1">🎯 Today</h4>
                          <p className="text-muted-foreground">{standup.today}</p>
                        </div>
                      </div>
                      
                      {hasBlockers(standup) && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md">
                          <h4 className="font-medium text-red-600 mb-1">🚫 Blockers</h4>
                          <p className="text-sm text-red-700 dark:text-red-300">{standup.blockers}</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Updated {format(parseISO(standup.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}