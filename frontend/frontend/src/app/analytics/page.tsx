'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { BurndownChart } from '@/components/charts/BurndownChart'
import { VelocityChart } from '@/components/charts/VelocityChart'
import { TeamPerformanceChart } from '@/components/charts/TeamPerformanceChart'
import { format, differenceInDays } from 'date-fns'
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

  const activeSprint = sprints?.find(sprint => {
    const now = new Date()
    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    return now >= startDate && now <= endDate
  }) || sprints?.[0]

  const currentSprint = selectedSprintId
    ? sprints?.find(s => s.id === selectedSprintId)
    : activeSprint

  const calculateSprintMetrics = (sprint: any) => {
    if (!sprint) return null

    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    const today = new Date()

    const totalDays = differenceInDays(endDate, startDate)
    const elapsedDays = Math.min(differenceInDays(today, startDate), totalDays)
    const remainingDays = Math.max(totalDays - elapsedDays, 0)

    const backlogItems = sprint.backlogItems || []
    const totalStoryPoints = backlogItems.reduce((sum: number, item: any) => sum + (item.storyPoints || 0), 0)
    const completedStoryPoints = backlogItems
      .filter((item: any) => item.completed || item.status === 'done')
      .reduce((sum: number, item: any) => sum + (item.storyPoints || 0), 0)

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
      completionRate: totalStoryPoints > 0 ? Math.round((completedStoryPoints / totalStoryPoints) * 100) : 0,
      velocity: Math.round(completedStoryPoints / Math.max(elapsedDays / 7, 1)),
      idealBurndownLine,
      actualBurndownLine
    }
  }

  const sprintMetrics = calculateSprintMetrics(currentSprint)

  const calculateVelocityTrend = () => {
    if (!sprints) return []

    return sprints.slice(0, 5).map((sprint) => {
      const backlogItems = sprint.backlogItems || []
      const planned = backlogItems.reduce((sum: number, item: any) => sum + (item.storyPoints || 0), 0)
      const completed = backlogItems
        .filter((item: any) => item.completed || item.status === 'done')
        .reduce((sum: number, item: any) => sum + (item.storyPoints || 0), 0)

      return {
        sprintName: sprint.name,
        planned,
        completed,
        velocity: completed
      }
    }).reverse()
  }

  const velocityData = calculateVelocityTrend()

  const calculateTeamMetrics = () => {
    if (!standups) return null

    const totalStandups = standups.length
    const standupsWithBlockers = standups.filter(s => s.blockers && s.blockers.length > 0).length
    const uniqueMembers = new Set(standups.map(s => s.userId)).size

    return {
      totalStandups,
      standupsWithBlockers,
      uniqueMembers,
      blockerRate: totalStandups > 0 ? Math.round((standupsWithBlockers / totalStandups) * 100) : 0,
      participationRate: uniqueMembers > 0 ? Math.round((totalStandups / (uniqueMembers * 5)) * 100) : 0
    }
  }

  const teamMetrics = calculateTeamMetrics()

  if (sprintsLoading) {
    return (
      <MainLayout title="Analytics Dashboard">
        <div className="text-center text-white/40 py-20">Loading analytics...</div>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Analytics Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Analytics Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">
              Track team performance and sprint progress
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Label htmlFor="sprintSelect" className="text-white/60">Sprint:</Label>
            <select
              id="sprintSelect"
              value={selectedSprintId || ''}
              onChange={(e) => setSelectedSprintId(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:border-purple-500/50 focus:outline-none"
            >
              <option value="" className="bg-[#0a0a0f]">Current Sprint</option>
              {sprints?.map((sprint) => (
                <option key={sprint.id} value={sprint.id} className="bg-[#0a0a0f]">
                  {sprint.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Sprint */}
        {currentSprint && sprintMetrics && (
          <Card className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-white/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{currentSprint.name}</CardTitle>
                  <CardDescription className="text-white/50">
                    {format(new Date(currentSprint.startDate), 'MMM dd')} - {format(new Date(currentSprint.endDate), 'MMM dd, yyyy')}
                  </CardDescription>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${sprintMetrics.remainingDays > 0 ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {sprintMetrics.remainingDays > 0 ? 'Active' : 'Completed'}
                </span>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Key Metrics */}
        {sprintMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/50">Story Points</CardTitle>
                <BarChartIcon className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {sprintMetrics.completedStoryPoints}/{sprintMetrics.totalStoryPoints}
                </div>
                <p className="text-xs text-white/40">
                  {sprintMetrics.completionRate}% complete
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/50">Days Remaining</CardTitle>
                <CalendarIcon className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{sprintMetrics.remainingDays}</div>
                <p className="text-xs text-white/40">
                  of {sprintMetrics.totalDays} total days
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/50">Velocity</CardTitle>
                <ActivityLogIcon className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{sprintMetrics.velocity}</div>
                <p className="text-xs text-white/40">points per week</p>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/50">Team Members</CardTitle>
                <PersonIcon className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{teamMetrics?.uniqueMembers || 0}</div>
                <p className="text-xs text-white/40">active contributors</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sprintMetrics && (
            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <PieChartIcon className="h-5 w-5 mr-2 text-purple-400" />
                  Sprint Burndown
                </CardTitle>
                <CardDescription className="text-white/40">
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

          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <RocketIcon className="h-5 w-5 mr-2 text-cyan-400" />
                Team Velocity
              </CardTitle>
              <CardDescription className="text-white/40">
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
            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Team Performance Metrics</CardTitle>
                <CardDescription className="text-white/40">
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

            <Card className="bg-white/[0.02] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Sprint Health Indicators</CardTitle>
                <CardDescription className="text-white/40">
                  Key metrics for sprint success
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-sm font-medium text-white">Scope Creep</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Low</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-sm font-medium text-white">Risk Level</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400">Moderate</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-sm font-medium text-white">On Track</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${sprintMetrics && sprintMetrics.completionRate >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {sprintMetrics && sprintMetrics.completionRate >= 70 ? 'Yes' : 'At Risk'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-sm font-medium text-white">Blockers</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${teamMetrics.blockerRate < 20 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {teamMetrics.blockerRate}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}