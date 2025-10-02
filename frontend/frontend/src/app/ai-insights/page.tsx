'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGetAIInsightsQuery, useGenerateInsightsMutation } from '@/store/api/aiApi'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { AIRiskAssessment } from '@/components/ai/AIRiskAssessment'
import { SprintPlanningAssistant } from '@/components/ai/SprintPlanningAssistant'
import { TaskPrioritization } from '@/components/ai/TaskPrioritization'
import { TeamProductivityInsights } from '@/components/ai/TeamProductivityInsights'
import { format } from 'date-fns'
import { 
  LightningBoltIcon,
  MagicWandIcon,
  ExclamationTriangleIcon,
  TargetIcon,
  RocketIcon,
  UpdateIcon,
  CheckCircledIcon,
  CrossCircledIcon
} from '@radix-ui/react-icons'

type InsightType = 'risk' | 'opportunity' | 'recommendation' | 'alert'
type InsightPriority = 'low' | 'medium' | 'high' | 'critical'

interface AIInsight {
  id: string
  type: InsightType
  priority: InsightPriority
  title: string
  description: string
  actionItems?: string[]
  confidence: number
  createdAt: string
  category: 'sprint' | 'team' | 'productivity' | 'planning'
}

export default function AIInsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sprint' | 'team' | 'productivity' | 'planning'>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { data: insights, isLoading: insightsLoading, refetch } = useGetAIInsightsQuery()
  const { data: sprints } = useGetSprintsQuery({})
  const { data: standups } = useGetStandupsQuery({})
  const [generateInsights] = useGenerateInsightsMutation()

  // Mock AI insights - in real app, these would come from your AI service
  const mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'risk',
      priority: 'high',
      title: 'Sprint Velocity Declining',
      description: 'Team velocity has decreased by 23% over the last 3 sprints. Current trajectory suggests missing sprint goals.',
      actionItems: [
        'Review team capacity and workload distribution',
        'Identify and address potential blockers',
        'Consider scope reduction for current sprint'
      ],
      confidence: 87,
      createdAt: new Date().toISOString(),
      category: 'sprint'
    },
    {
      id: '2',
      type: 'opportunity',
      priority: 'medium',
      title: 'Optimal Sprint Planning Window',
      description: 'Based on team patterns, scheduling sprint planning on Tuesday afternoons shows 34% better engagement.',
      actionItems: [
        'Schedule next sprint planning for Tuesday 2-4 PM',
        'Send calendar invites with agenda 24h in advance'
      ],
      confidence: 72,
      createdAt: new Date().toISOString(),
      category: 'planning'
    },
    {
      id: '3',
      type: 'recommendation',
      priority: 'medium',
      title: 'Task Redistribution Needed',
      description: 'John Doe has 40% more story points than team average. Sarah Smith has capacity for 2-3 additional tasks.',
      actionItems: [
        'Move 2 medium tasks from John to Sarah',
        'Review workload distribution in next standup',
        'Update capacity planning for remaining sprint'
      ],
      confidence: 91,
      createdAt: new Date().toISOString(),
      category: 'team'
    },
    {
      id: '4',
      type: 'alert',
      priority: 'critical',
      title: 'Blocker Escalation Required',
      description: 'API integration blocker has been unresolved for 3 days, affecting 4 dependent tasks.',
      actionItems: [
        'Escalate to senior developer immediately',
        'Prepare alternative implementation approach',
        'Notify stakeholders of potential delay'
      ],
      confidence: 95,
      createdAt: new Date().toISOString(),
      category: 'sprint'
    },
    {
      id: '5',
      type: 'opportunity',
      priority: 'low',
      title: 'Team Collaboration Peak',
      description: 'Morning standups (9-10 AM) show 45% higher participation and engagement rates.',
      actionItems: [
        'Continue morning standup schedule',
        'Consider adding brief afternoon check-ins on complex days'
      ],
      confidence: 68,
      createdAt: new Date().toISOString(),
      category: 'productivity'
    }
  ]

  const filteredInsights = selectedCategory === 'all' 
    ? mockInsights 
    : mockInsights.filter(insight => insight.category === selectedCategory)

  const handleGenerateInsights = async () => {
    setIsGenerating(true)
    try {
      // In real app, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate AI processing
      await refetch()
    } catch (error) {
      console.error('Failed to generate insights:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getPriorityColor = (priority: InsightPriority) => {
    switch (priority) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getTypeIcon = (type: InsightType) => {
    switch (type) {
      case 'risk': return ExclamationTriangleIcon
      case 'opportunity': return TargetIcon
      case 'recommendation': return LightningBoltIcon
      case 'alert': return ExclamationTriangleIcon
      default: return LightningBoltIcon
    }
  }

  const getTypeColor = (type: InsightType) => {
    switch (type) {
      case 'risk': return 'text-red-600 dark:text-red-400'
      case 'opportunity': return 'text-green-600 dark:text-green-400'
      case 'recommendation': return 'text-blue-600 dark:text-blue-400'
      case 'alert': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <MainLayout title="AI Insights">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI-Powered Insights</h1>
            <p className="text-muted-foreground">
              Intelligent recommendations and risk detection for your scrum process
            </p>
          </div>
          
          <Button
            onClick={handleGenerateInsights}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <UpdateIcon className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <MagicWandIcon className="h-4 w-4" />
                <span>Generate Insights</span>
              </>
            )}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
              <LightningBoltIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockInsights.length}</div>
              <p className="text-xs text-muted-foreground">
                AI-generated recommendations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mockInsights.filter(i => i.priority === 'critical').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
              <TargetIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockInsights.filter(i => i.type === 'opportunity').length}
              </div>
              <p className="text-xs text-muted-foreground">
                For optimization
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <RocketIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(mockInsights.reduce((acc, i) => acc + i.confidence, 0) / mockInsights.length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                AI prediction accuracy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Insights' },
            { key: 'sprint', label: 'Sprint' },
            { key: 'team', label: 'Team' },
            { key: 'productivity', label: 'Productivity' },
            { key: 'planning', label: 'Planning' }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={selectedCategory === filter.key ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(filter.key as any)}
              size="sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRiskAssessment />
          <SprintPlanningAssistant />
          <TaskPrioritization />
          <TeamProductivityInsights />
        </div>

        {/* Insights List */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights & Recommendations</CardTitle>
            <CardDescription>
              Intelligent analysis based on your team's patterns and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <div className="text-center py-8">Loading insights...</div>
            ) : filteredInsights.length === 0 ? (
              <div className="text-center py-8">
                <LightningBoltIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No insights yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate AI insights to get intelligent recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInsights.map((insight) => {
                  const Icon = getTypeIcon(insight.type)
                  
                  return (
                    <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${getTypeColor(insight.type)}`} />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{insight.title}</h3>
                              <Badge variant={getPriorityColor(insight.priority) as any}>
                                {insight.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {insight.confidence}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <CheckCircledIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <CrossCircledIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {insight.actionItems && insight.actionItems.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                          <ul className="space-y-1">
                            {insight.actionItems.map((action, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <span className="text-muted-foreground">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Generated {format(new Date(insight.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
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