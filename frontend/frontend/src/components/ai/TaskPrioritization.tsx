'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetTaskPrioritizationQuery } from '@/store/api/aiApi'
import { 
  TargetIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  UpdateIcon 
} from '@radix-ui/react-icons'

export function TaskPrioritization() {
  const { data: prioritizationData, isLoading, refetch } = useGetTaskPrioritizationQuery({})

  const tasks = prioritizationData

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getPriorityChangeIcon = (current: string, suggested: string) => {
    const priorityValue = { low: 1, medium: 2, high: 3 }
    const currentValue = priorityValue[current as keyof typeof priorityValue]
    const suggestedValue = priorityValue[suggested as keyof typeof priorityValue]
    
    if (suggestedValue > currentValue) return ArrowUpIcon
    if (suggestedValue < currentValue) return ArrowDownIcon
    return MinusIcon
  }

  const getPriorityChangeColor = (current: string, suggested: string) => {
    const priorityValue = { low: 1, medium: 2, high: 3 }
    const currentValue = priorityValue[current as keyof typeof priorityValue]
    const suggestedValue = priorityValue[suggested as keyof typeof priorityValue]
    
    if (suggestedValue > currentValue) return 'text-red-600 dark:text-red-400'
    if (suggestedValue < currentValue) return 'text-green-600 dark:text-green-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TargetIcon className="h-5 w-5" />
          <span>Task Prioritization</span>
        </CardTitle>
        <CardDescription>
          AI-driven task priority recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <UpdateIcon className="h-6 w-6 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Analyzing task priorities...</p>
          </div>
        ) : (
          tasks ? (
            <>
              <div className="space-y-3">
                {tasks.map((task: any) => {
                  const ChangeIcon = getPriorityChangeIcon(task.currentPriority, task.suggestedPriority)
                  const changeColor = getPriorityChangeColor(task.currentPriority, task.suggestedPriority)
                  
                  return (
                    <div key={task.taskId} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm flex-1">{task.title}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(task.currentPriority) as any} className="text-xs">
                            {task.currentPriority}
                          </Badge>
                          <ChangeIcon className={`h-4 w-4 ${changeColor}`} />
                          <Badge variant={getPriorityColor(task.suggestedPriority) as any} className="text-xs">
                            {task.suggestedPriority}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">{task.reasoning}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {task.confidence}% confidence
                        </Badge>
                        
                        {task.currentPriority !== task.suggestedPriority && (
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            Apply Change
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <UpdateIcon className="h-4 w-4 mr-2" />
                Refresh Recommendations
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-lg bg-gray-50 p-4 mb-3">
                <TargetIcon className="h-6 w-6 text-slate-600" />
              </div>
              <p className="text-sm text-slate-600">No prioritization recommendations available.</p>
              <p className="text-xs text-slate-400 mt-1">Run an analysis or ensure AI services are configured.</p>
              <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-3">Refresh Recommendations</Button>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}