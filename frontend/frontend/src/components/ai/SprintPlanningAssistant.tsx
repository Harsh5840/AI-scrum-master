'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useGetSprintPlanningAssistanceQuery } from '@/store/api/aiApi'
import { 
  RocketIcon,
  MagicWandIcon,
  UpdateIcon 
} from '@radix-ui/react-icons'

export function SprintPlanningAssistant() {
  const [teamSize, setTeamSize] = useState(5)
  const [sprintDuration, setSprintDuration] = useState(14)
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const { data: planningData, isLoading, refetch } = useGetSprintPlanningAssistanceQuery(
    { teamSize, sprintDuration },
    { skip: !showSuggestions }
  )

  // Mock data when API is not available
  const mockPlanningData = {
    suggestedCapacity: teamSize * 8, // 8 points per person
    recommendedTasks: [
      {
        title: 'User Authentication System',
        estimatedPoints: 13,
        priority: 'high' as const,
        reasoning: 'Critical feature blocking other development'
      },
      {
        title: 'Dashboard Analytics',
        estimatedPoints: 8,
        priority: 'medium' as const,
        reasoning: 'Important for user engagement metrics'
      },
      {
        title: 'Email Notifications',
        estimatedPoints: 5,
        priority: 'medium' as const,
        reasoning: 'Enhances user experience'
      },
      {
        title: 'Performance Optimization',
        estimatedPoints: 8,
        priority: 'low' as const,
        reasoning: 'Can be deferred if capacity is limited'
      }
    ],
    warnings: [
      'Suggested capacity is 15% higher than historical average',
      'Consider buffer time for unexpected issues'
    ]
  }

  const planning = planningData || mockPlanningData

  const handleGenerateSuggestions = () => {
    setShowSuggestions(true)
    if (planningData) {
      refetch()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RocketIcon className="h-5 w-5" />
          <span>Sprint Planning Assistant</span>
        </CardTitle>
        <CardDescription>
          AI-powered recommendations for optimal sprint planning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 5)}
              min="1"
              max="20"
            />
          </div>
          <div>
            <Label htmlFor="sprintDuration">Sprint Duration (days)</Label>
            <Input
              id="sprintDuration"
              type="number"
              value={sprintDuration}
              onChange={(e) => setSprintDuration(parseInt(e.target.value) || 14)}
              min="1"
              max="30"
            />
          </div>
        </div>

        <Button 
          onClick={handleGenerateSuggestions}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <UpdateIcon className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <MagicWandIcon className="h-4 w-4 mr-2" />
              Generate AI Suggestions
            </>
          )}
        </Button>

        {/* Results */}
        {showSuggestions && (
          <>
            {/* Capacity Suggestion */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <h4 className="font-medium mb-1">Suggested Sprint Capacity</h4>
              <p className="text-2xl font-bold text-blue-600">{planning.suggestedCapacity} story points</p>
              <p className="text-sm text-muted-foreground">Based on team size and sprint duration</p>
            </div>

            {/* Recommended Tasks */}
            <div>
              <h4 className="font-medium mb-3">Recommended Tasks</h4>
              <div className="space-y-2">
                {planning.recommendedTasks.map((task: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{task.title}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {task.estimatedPoints} pts
                        </Badge>
                        <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{task.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {planning.warnings.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">⚠️ Considerations</h4>
                <ul className="space-y-1">
                  {planning.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}