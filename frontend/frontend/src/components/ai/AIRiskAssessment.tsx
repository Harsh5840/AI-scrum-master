'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetRiskAssessmentQuery } from '@/store/api/aiApi'
import { 
  ExclamationTriangleIcon,
  CheckCircledIcon,
  UpdateIcon 
} from '@radix-ui/react-icons'

export function AIRiskAssessment() {
  const { data: riskData, isLoading, refetch } = useGetRiskAssessmentQuery({})

  // Mock data when API is not available
  const mockRiskData = {
    overallRisk: 'medium' as const,
    riskFactors: [
      {
        factor: 'Velocity Decline',
        severity: 'high' as const,
        impact: 'Sprint goals may not be achieved'
      },
      {
        factor: 'Unresolved Blockers',
        severity: 'medium' as const,
        impact: 'Some tasks may experience delays'
      },
      {
        factor: 'Team Capacity',
        severity: 'low' as const,
        impact: 'Team is operating at 85% capacity'
      }
    ],
    recommendations: [
      'Address high-priority blockers immediately',
      'Redistribute workload among team members',
      'Consider scope reduction for current sprint'
    ]
  }

  const risk = riskData || mockRiskData

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getRiskIcon = (level: string) => {
    return level === 'low' ? CheckCircledIcon : ExclamationTriangleIcon
  }

  const RiskIcon = getRiskIcon(risk.overallRisk)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RiskIcon className="h-5 w-5" />
          <span>Risk Assessment</span>
        </CardTitle>
        <CardDescription>
          AI-powered analysis of potential sprint risks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <UpdateIcon className="h-6 w-6 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Analyzing risks...</p>
          </div>
        ) : (
          <>
            {/* Overall Risk */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Risk Level</span>
              <Badge variant={getRiskColor(risk.overallRisk) as any}>
                {risk.overallRisk.toUpperCase()}
              </Badge>
            </div>

            {/* Risk Factors */}
            <div>
              <h4 className="font-medium mb-3">Risk Factors</h4>
              <div className="space-y-2">
                {risk.riskFactors.map((factor: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{factor.factor}</span>
                      <Badge variant={getRiskColor(factor.severity) as any} className="text-xs">
                        {factor.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{factor.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-3">AI Recommendations</h4>
              <ul className="space-y-1">
                {risk.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-muted-foreground">•</span>
                    <span>{rec}</span>
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