'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { BurndownChart } from '@/components/charts/BurndownChart'
import { VelocityChart } from '@/components/charts/VelocityChart'
import { TeamPerformanceChart } from '@/components/charts/TeamPerformanceChart'
import { format, parseISO, differenceInDays } from 'date-fns'
import { 
  BarChartIcon,
  CalendarIcon,
  PersonIcon,
  RocketIcon,
  ActivityLogIcon,
  PieChartIcon
} from '@radix-ui/react-icons'

export default function AnalyticsPage() {
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null)
  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery({})
  const { data: standups } = useGetStandupsQuery({})

  // Find active sprint or use most recent
  const activeSprint = sprints?.find(sprint => {
    const now = new Date()
    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    return now >= startDate && now <= endDate
  }) || sprints?.[0]

  const currentSprint = selectedSprintId 
    ? sprints?.find(s => s.id === selectedSprintId) 
    : activeSprint

  // Calculate sprint metrics
  const calculateSprintMetrics = (sprint: any) => {
    if (!sprint) return null

    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    const today = new Date()
    
    const totalDays = differenceInDays(endDate, startDate)
    const elapsedDays = Math.min(differenceInDays(today, startDate), totalDays)
    const remainingDays = Math.max(totalDays - elapsedDays, 0)
    
    // Mock story points data - in real app, this would come from API
    const totalStoryPoints = 100
    const completedStoryPoints = Math.floor((elapsedDays / totalDays) * 80) // 80% completion rate
    const idealBurndownLine = Array.from({ length: totalDays + 1 }, (_, i) => 
      totalStoryPoints - (totalStoryPoints * i / totalDays)
    )
    const actualBurndownLine = Array.from({ length: elapsedDays + 1 }, (_, i) => 
      totalStoryPoints - (completedStoryPoints * i / elapsedDays)
    )

    return {
      totalDays,
      elapsedDays,
      remainingDays,
      totalStoryPoints,
      completedStoryPoints,
      remainingStoryPoints: totalStoryPoints - completedStoryPoints,
      completionRate: Math.round((completedStoryPoints / totalStoryPoints) * 100),
      velocity: Math.round(completedStoryPoints / Math.max(elapsedDays / 7, 1)), // points per week
      idealBurndownLine,
      actualBurndownLine
    }
  }

  const sprintMetrics = calculateSprintMetrics(currentSprint)

  // Calculate team velocity over last 5 sprints
  const calculateVelocityTrend = () => {
    if (!sprints) return []
    
    return sprints.slice(0, 5).map((sprint, index) => ({
      sprintName: sprint.name,
      planned: 100 - (index * 5), // Mock data
      completed: 85 - (index * 8),
      velocity: 85 - (index * 8)
    })).reverse()
  }

  const velocityData = calculateVelocityTrend()

  // Calculate team performance metrics
  const calculateTeamMetrics = () => {
    if (!standups) return null

    const totalStandups = standups.length
    const standupsWithBlockers = standups.filter(s => s.blockers && s.blockers.length > 0).length
    const uniqueMembers = new Set(standups.map(s => s.userId)).size
    
    return {
      totalStandups,
      standupsWithBlockers,
      uniqueMembers,
      blockerRate: Math.round((standupsWithBlockers / totalStandups) * 100),
      participationRate: Math.round((totalStandups / (uniqueMembers * 5)) * 100) // Assuming 5 working days
    }
  }

  const teamMetrics = calculateTeamMetrics()

  if (sprintsLoading) {
    return (
      <MainLayout title="Analytics Dashboard">
        <div className="text-center">Loading analytics...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Analytics Dashboard">
      <div className="space-y-6">
        {/* Header with sprint selector */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track team performance and sprint progress
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Label htmlFor="sprintSelect">Sprint:</Label>
            <select
              id="sprintSelect"
              value={selectedSprintId || ''}
              onChange={(e) => setSelectedSprintId(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">Current Sprint</option>
              {sprints?.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Sprint Overview */}
        {currentSprint && sprintMetrics && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentSprint.name}</CardTitle>
                  <CardDescription>
                    {format(new Date(currentSprint.startDate), 'MMM dd')} - {format(new Date(currentSprint.endDate), 'MMM dd, yyyy')}
                  </CardDescription>
                </div>
                <Badge variant={sprintMetrics.remainingDays > 0 ? 'default' : 'secondary'}>
                  {sprintMetrics.remainingDays > 0 ? 'Active' : 'Completed'}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Key Metrics */}
        {sprintMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Story Points</CardTitle>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sprintMetrics.completedStoryPoints}/{sprintMetrics.totalStoryPoints}
                </div>
                <p className="text-xs text-muted-foreground">
                  {sprintMetrics.completionRate}% complete
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sprintMetrics.remainingDays}</div>
                <p className="text-xs text-muted-foreground">
                  of {sprintMetrics.totalDays} total days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Velocity</CardTitle>
                <ActivityLogIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sprintMetrics.velocity}</div>
                <p className="text-xs text-muted-foreground">
                  points per week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <PersonIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMetrics?.uniqueMembers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  active contributors
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Burndown Chart */}
          {sprintMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Sprint Burndown</span>
                </CardTitle>
                <CardDescription>
                  Story points remaining over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BurndownChart
                  idealLine={sprintMetrics.idealBurndownLine}
                  actualLine={sprintMetrics.actualBurndownLine}
                  totalDays={sprintMetrics.totalDays}
                  elapsedDays={sprintMetrics.elapsedDays}
                />
              </CardContent>
            </Card>
          )}

          {/* Velocity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RocketIcon className="h-5 w-5" />
                <span>Team Velocity</span>
              </CardTitle>
              <CardDescription>
                Story points completed per sprint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VelocityChart data={velocityData} />
            </CardContent>
          </Card>
        </div>

        {/* Team Performance */}
        {teamMetrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Metrics</CardTitle>
                <CardDescription>
                  Overall team health and participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamPerformanceChart
                  participationRate={teamMetrics.participationRate}
                  blockerRate={teamMetrics.blockerRate}
                  totalStandups={teamMetrics.totalStandups}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sprint Health Indicators</CardTitle>
                <CardDescription>
                  Key metrics for sprint success
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Scope Creep</span>
                  <Badge variant="secondary">Low</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Level</span>
                  <Badge variant="default">Moderate</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">On Track</span>
                  <Badge variant={sprintMetrics && sprintMetrics.completionRate >= 70 ? 'default' : 'destructive'}>
                    {sprintMetrics && sprintMetrics.completionRate >= 70 ? 'Yes' : 'At Risk'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Blockers</span>
                  <Badge variant={teamMetrics.blockerRate < 20 ? 'secondary' : 'destructive'}>
                    {teamMetrics.blockerRate}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}