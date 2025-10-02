'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { 
  CalendarIcon,
  PersonIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  BarChartIcon,
  ClockIcon
} from '@radix-ui/react-icons'

export default function TeamDashboardPage() {
  const [selectedWeek, setSelectedWeek] = useState(format(new Date(), 'yyyy-MM-dd'))
  const { data: standups, isLoading: standupsLoading } = useGetStandupsQuery({})
  const { data: sprints, isLoading: sprintsLoading } = useGetSprintsQuery({})

  // Filter standups for selected week
  const weekStart = startOfWeek(parseISO(selectedWeek), { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(parseISO(selectedWeek), { weekStartsOn: 1 }) // Sunday
  
  const weeklyStandups = standups?.filter(standup => 
    isWithinInterval(parseISO(standup.createdAt), { start: weekStart, end: weekEnd })
  ) || []

  // Get unique team members from standups
  const teamMembers = Array.from(new Set(weeklyStandups.map(s => s.userId)))
    .map(userId => {
      const standup = weeklyStandups.find(s => s.userId === userId)
      return {
        id: userId,
        name: standup?.user?.name || `User ${userId}`,
        standups: weeklyStandups.filter(s => s.userId === userId),
        blockers: weeklyStandups.filter(s => s.userId === userId && s.blockers && s.blockers.length > 0)
      }
    })

  // Calculate team metrics
  const totalStandups = weeklyStandups.length
  const activeBlockers = weeklyStandups.filter(s => s.blockers && s.blockers.some(b => !b.resolved)).length
  const participationRate = teamMembers.length > 0 ? Math.round((totalStandups / (teamMembers.length * 5)) * 100) : 0 // Assuming 5 working days
  const avgStandupsPerMember = teamMembers.length > 0 ? Math.round(totalStandups / teamMembers.length) : 0

  // Current sprint info
  const activeSprint = sprints?.find(sprint => {
    const now = new Date()
    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    return now >= startDate && now <= endDate
  })

  if (standupsLoading || sprintsLoading) {
    return (
      <MainLayout title="Team Dashboard">
        <div className="text-center">Loading team dashboard...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Team Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Team Dashboard</h1>
            <p className="text-muted-foreground">
              Weekly overview of team standup participation and progress
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Label htmlFor="weekSelect">Week of:</Label>
            <Input
              id="weekSelect"
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>

        {/* Current Sprint Info */}
        {activeSprint && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{activeSprint.name}</CardTitle>
                  <CardDescription>
                    {format(new Date(activeSprint.startDate), 'MMM dd')} - {format(new Date(activeSprint.endDate), 'MMM dd, yyyy')}
                  </CardDescription>
                </div>
                <Badge variant="default">Active Sprint</Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Team Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Standups</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStandups}</div>
              <p className="text-xs text-muted-foreground">
                this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <PersonIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                participated
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Blockers</CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBlockers}</div>
              <p className="text-xs text-muted-foreground">
                need attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participation</CardTitle>
              <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{participationRate}%</div>
              <p className="text-xs text-muted-foreground">
                target rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Member Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamMembers.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No standups this week</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Team members haven't submitted any standups for the selected week.
                </p>
              </CardContent>
            </Card>
          ) : (
            teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PersonIcon className="h-5 w-5" />
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        {member.standups.length} updates
                      </Badge>
                      {member.blockers.length > 0 && (
                        <Badge variant="destructive">
                          {member.blockers.length} blockers
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Recent Standups */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recent Updates</h4>
                    {member.standups.slice(0, 3).map((standup) => (
                      <div key={standup.id} className="border rounded p-3 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(standup.createdAt), 'MMM dd, h:mm a')}
                          </span>
                          {standup.blockers && standup.blockers.length > 0 && (
                            <ExclamationTriangleIcon className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm">{standup.summary}</p>
                      </div>
                    ))}
                    {member.standups.length === 0 && (
                      <p className="text-sm text-muted-foreground">No updates this week</p>
                    )}
                  </div>

                  {/* Active Blockers */}
                  {member.blockers.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-red-600">Active Blockers</h4>
                      {member.blockers.slice(0, 2).map((standup) => (
                        <div key={standup.id}>
                          {standup.blockers?.filter(b => !b.resolved).map((blocker) => (
                            <div key={blocker.id} className="bg-red-50 dark:bg-red-950/20 rounded p-2 mb-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge 
                                  variant={blocker.severity === 'high' ? 'destructive' : 
                                         blocker.severity === 'medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {blocker.severity}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(blocker.createdAt), 'MMM dd')}
                                </span>
                              </div>
                              <p className="text-sm text-red-700 dark:text-red-300">
                                {blocker.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Weekly Activity */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Weekly Activity</h4>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, i) => {
                        const dayDate = new Date(weekStart)
                        dayDate.setDate(dayDate.getDate() + i)
                        const hasStandup = member.standups.some(s => 
                          format(parseISO(s.createdAt), 'yyyy-MM-dd') === format(dayDate, 'yyyy-MM-dd')
                        )
                        
                        return (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded flex items-center justify-center text-xs ${
                              hasStandup 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                            }`}
                            title={format(dayDate, 'EEE MMM dd')}
                          >
                            {hasStandup ? <CheckCircledIcon className="h-3 w-3" /> : <ClockIcon className="h-3 w-3" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  )
}