'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetTeamProductivityInsightsQuery } from '@/store/api/aiApi'
import { 
  ActivityLogIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  UpdateIcon 
} from '@radix-ui/react-icons'

export function TeamProductivityInsights() {
  const { data: productivityData, isLoading, refetch } = useGetTeamProductivityInsightsQuery()

  // Mock data when API is not available
  const mockProductivityData = {
    productivityScore: 78,
    trends: [
      {
        metric: 'Daily Standup Participation',
        trend: 'improving' as const,
        change: 12,
        recommendation: 'Continue current standup format and timing'
      },
      {
        metric: 'Story Point Completion Rate',
        trend: 'declining' as const,
        change: -8,
        recommendation: 'Review estimation accuracy and task complexity'
      },
      {
        metric: 'Blocker Resolution Time',
        trend: 'stable' as const,
        change: 2,
        recommendation: 'Maintain current escalation process'
      },
      {
        metric: 'Code Review Turnaround',
        trend: 'improving' as const,
        change: 15,
        recommendation: 'Great progress! Consider peer recognition program'
      }
    ],
    optimization: [
      'Schedule more pair programming sessions',
      'Implement automated testing to reduce manual QA time',
      'Consider breaking down large tasks into smaller chunks',
      'Set up dedicated focus time blocks for deep work'
    ]
  }

  const productivity = productivityData || mockProductivityData

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return ArrowUpIcon
      case 'declining': return ArrowDownIcon
      case 'stable': return MinusIcon
      default: return MinusIcon
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 dark:text-green-400'
      case 'declining': return 'text-red-600 dark:text-red-400'
      case 'stable': return 'text-gray-600 dark:text-gray-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getTrendBadgeColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'default'
      case 'declining': return 'destructive'
      case 'stable': return 'secondary'
      default: return 'outline'
    }
  }

  const getProductivityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ActivityLogIcon className="h-5 w-5" />
          <span>Team Productivity</span>
        </CardTitle>
        <CardDescription>
          AI analysis of team performance and optimization opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <UpdateIcon className="h-6 w-6 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Analyzing productivity...</p>
          </div>
        ) : (
          <>
            {/* Productivity Score */}
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-1">Overall Productivity Score</h4>
              <p className={`text-3xl font-bold ${getProductivityScoreColor(productivity.productivityScore)}`}>
                {productivity.productivityScore}/100
              </p>
              <p className="text-sm text-muted-foreground">Based on multiple performance metrics</p>
            </div>

            {/* Trends */}
            <div>
              <h4 className="font-medium mb-3">Performance Trends</h4>
              <div className="space-y-2">
                {productivity.trends.map((trend: any, index: number) => {
                  const TrendIcon = getTrendIcon(trend.trend)
                  const trendColor = getTrendColor(trend.trend)
                  
                  return (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{trend.metric}</span>
                        <div className="flex items-center space-x-2">
                          <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                          <Badge variant={getTrendBadgeColor(trend.trend) as any} className="text-xs">
                            {trend.change > 0 ? '+' : ''}{trend.change}%
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{trend.recommendation}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Optimization Suggestions */}
            <div>
              <h4 className="font-medium mb-3">AI Optimization Suggestions</h4>
              <ul className="space-y-1">
                {productivity.optimization.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-muted-foreground">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              <UpdateIcon className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}