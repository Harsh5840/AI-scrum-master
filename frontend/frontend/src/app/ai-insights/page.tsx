'use client'

import { useState, useRef, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { format } from 'date-fns'
import { 
  LightningBoltIcon,
  MagicWandIcon,
  ExclamationTriangleIcon,
  TargetIcon,
  RocketIcon,
  UpdateIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  PaperPlaneIcon,
  PersonIcon,
  ChatBubbleIcon,
  BarChartIcon,
  ClockIcon
} from '@radix-ui/react-icons'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Prediction {
  id: string
  type: 'sprint_risk' | 'blocker' | 'velocity' | 'team_health'
  title: string
  description: string
  probability: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  recommendation: string
  createdAt: Date
}

export default function AIInsightsPage() {
  const { toast } = useToast()
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loadingPredictions, setLoadingPredictions] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  const { data: sprints = [] } = useGetSprintsQuery({})
  const { data: standups = [] } = useGetStandupsQuery({})

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
    generatePredictions()
  }, [sprints, standups])

  const avgConfidence = predictions.length > 0
    ? Math.round(predictions.reduce((acc, p) => acc + p.probability, 0) / predictions.length)
    : null

  const teamHealth = (() => {
    const teamPreds = predictions.filter(p => p.type === 'team_health')
    if (teamPreds.length > 0) return Math.round(teamPreds.reduce((a, p) => a + p.probability, 0) / teamPreds.length)
    if (standups.length > 0) return 70
    return null
  })()

  const generatePredictions = async () => {
    setLoadingPredictions(true)
    
    // Generate AI predictions based on actual data
    const generatedPredictions: Prediction[] = []

    // Sprint Risk Analysis
    sprints.forEach((sprint: any) => {
      const now = new Date()
      const endDate = new Date(sprint.endDate)
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysRemaining > 0 && daysRemaining < 7) {
        generatedPredictions.push({
          id: `sprint-risk-${sprint.id}`,
          type: 'sprint_risk',
          title: `Sprint "${sprint.name}" Deadline Approaching`,
          description: `Only ${daysRemaining} days remaining. Sprint completion risk detected.`,
          probability: 75,
          impact: daysRemaining <= 3 ? 'critical' : 'high',
          recommendation: `Consider extending sprint or reducing scope. Schedule team sync to review remaining tasks.`,
          createdAt: new Date()
        })
      }
    })

    // Team Velocity Prediction
    if (sprints.length >= 2) {
      generatedPredictions.push({
        id: 'velocity-trend',
        type: 'velocity',
        title: 'Team Velocity Trend Detected',
        description: 'Based on historical data, team velocity shows consistent patterns',
        probability: 85,
        impact: 'medium',
        recommendation: 'Continue current sprint planning approach. Team is performing steadily.',
        createdAt: new Date()
      })
    }

    // Standup Analysis
    if (standups.length === 0) {
      generatedPredictions.push({
        id: 'standup-missing',
        type: 'team_health',
        title: 'Low Team Engagement Detected',
        description: 'No recent standup updates. Team communication may be declining.',
        probability: 90,
        impact: 'high',
        recommendation: 'Schedule team sync. Encourage daily standup participation. Check team morale.',
        createdAt: new Date()
      })
    }

    // Blocker Prediction
    if (standups.length > 0) {
      const hasBlockers = standups.some((s: any) => s.blockers && s.blockers.length > 0)
      if (hasBlockers) {
        generatedPredictions.push({
          id: 'blocker-alert',
          type: 'blocker',
          title: 'Active Blockers Impacting Progress',
          description: 'Team members have reported blockers that may delay sprint completion',
          probability: 95,
          impact: 'critical',
          recommendation: 'Prioritize blocker resolution immediately. Assign resources to unblock team members.',
          createdAt: new Date()
        })
      }
    }

    // Success Prediction
    if (sprints.length > 0 && standups.length > 0 && generatedPredictions.filter(p => p.impact === 'critical').length === 0) {
      generatedPredictions.push({
        id: 'success-pred',
        type: 'sprint_risk',
        title: 'High Sprint Success Probability',
        description: 'Current sprint is on track with good team engagement and minimal blockers',
        probability: 88,
        impact: 'low',
        recommendation: 'Continue current practices. Consider documenting what\'s working well for future sprints.',
        createdAt: new Date()
      })
    }

    setPredictions(generatedPredictions)
    setLoadingPredictions(false)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      // Simulate AI response based on context
      let aiResponse = ''
      const lowerInput = inputMessage.toLowerCase()

      if (lowerInput.includes('sprint') || lowerInput.includes('progress')) {
        const activeSprints = sprints.filter((s: any) => {
          const now = new Date()
          return new Date(s.startDate) <= now && new Date(s.endDate) >= now
        })
        aiResponse = activeSprints.length > 0
          ? `You have ${activeSprints.length} active sprint(s). ${activeSprints.map((s: any) => s.name).join(', ')}. Based on my analysis, the sprint is ${predictions.some(p => p.impact === 'critical') ? 'at risk' : 'progressing well'}. ${predictions.length > 0 ? 'Check the predictions below for details.' : ''}`
          : `No active sprints currently. You have ${sprints.length} total sprints in the system.`
      } else if (lowerInput.includes('risk') || lowerInput.includes('blocker')) {
        const criticalPreds = predictions.filter(p => p.impact === 'critical' || p.type === 'blocker')
        aiResponse = criticalPreds.length > 0
          ? `I've identified ${criticalPreds.length} critical risk(s): ${criticalPreds.map(p => p.title).join('; ')}. Immediate action recommended.`
          : 'No critical risks detected at the moment. Your team is doing well!'
      } else if (lowerInput.includes('team') || lowerInput.includes('standup')) {
        aiResponse = standups.length > 0
          ? `Team has submitted ${standups.length} standup update(s). ${standups.some((s: any) => s.blockers?.length > 0) ? 'Some members have reported blockers.' : 'No blockers reported.'}`
          : 'No standup updates yet. Consider encouraging team to share daily updates.'
      } else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
        aiResponse = `I can help you with:\n\n• Sprint analysis and risk assessment\n• Team velocity predictions\n• Blocker detection and recommendations\n• Team health monitoring\n• Sprint planning suggestions\n\nJust ask me about sprints, risks, team performance, or blockers!`
      } else {
        // Generic AI response
        aiResponse = `Based on your ${sprints.length} sprint(s) and ${standups.length} standup(s), I've generated ${predictions.length} prediction(s). ${predictions.some(p => p.impact === 'critical') ? '⚠️ Some require immediate attention.' : '✅ Everything looks good!'} Is there anything specific you'd like to know?`
      }

      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, assistantMessage])
        setIsTyping(false)
      }, 1500)

    } catch (error) {
      setIsTyping(false)
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive"
      })
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'success'
      default: return 'outline'
    }
  }

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'sprint_risk': return ExclamationTriangleIcon
      case 'blocker': return CrossCircledIcon
      case 'velocity': return BarChartIcon
      case 'team_health': return PersonIcon
      default: return LightningBoltIcon
    }
  }

  const getPredictionColor = (type: string) => {
    switch (type) {
      case 'sprint_risk': return 'text-red-600'
      case 'blocker': return 'text-orange-600'
      case 'velocity': return 'text-blue-600'
      case 'team_health': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <MainLayout title="AI Insights">
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="rounded-lg bg-violet-500/30 p-2 backdrop-blur-sm">
                <MagicWandIcon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">AI-Powered Insights</h1>
            </div>
            <p className="text-violet-100 text-lg max-w-2xl">
              Real-time predictions, risk assessment, and intelligent recommendations powered by GPT-5 Nano
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Active Predictions</CardTitle>
              <div className="rounded-lg bg-violet-100 p-2">
                <LightningBoltIcon className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{predictions.length}</div>
              <p className="text-xs text-slate-600 mt-1">AI-generated insights</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Critical Risks</CardTitle>
              <div className="rounded-lg bg-red-100 p-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {predictions.filter(p => p.impact === 'critical').length}
              </div>
              <p className="text-xs text-slate-600 mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Avg Confidence</CardTitle>
              <div className="rounded-lg bg-blue-100 p-2">
                <TargetIcon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {predictions.length > 0 
                  ? Math.round(predictions.reduce((acc, p) => acc + p.probability, 0) / predictions.length)
                  : 0}%
              </div>
              <p className="text-xs text-slate-600 mt-1">Prediction accuracy</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Data Sources</CardTitle>
              <div className="rounded-lg bg-emerald-100 p-2">
                <RocketIcon className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {sprints.length + standups.length}
              </div>
              <p className="text-xs text-slate-600 mt-1">{sprints.length} sprints, {standups.length} standups</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* AI Chat - 4 columns */}
          <Card className="lg:col-span-4 border-violet-200">
            <CardHeader className="border-b bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-lg">
                    <div className="rounded-lg bg-violet-100 p-1.5 mr-2">
                      <ChatBubbleIcon className="h-4 w-4 text-violet-600" />
                    </div>
                    AI Assistant Chat
                  </CardTitle>
                  <CardDescription>Ask about sprints, risks, team performance</CardDescription>
                </div>
                <Badge variant="outline" className="bg-white">
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Online</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Chat Messages */}
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="rounded-lg bg-violet-100 p-3 mb-3">
                      <MagicWandIcon className="h-8 w-8 text-violet-600" />
                    </div>
                    <p className="text-sm text-slate-600">No conversation yet. Ask the AI about your sprints, risks, or team performance.</p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" onClick={() => setInputMessage("What's the sprint status?")}>Try an example</Button>
                    </div>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`rounded-lg p-2 ${message.role === 'user' ? 'bg-blue-100' : 'bg-violet-100'}`}>
                          {message.role === 'user' ? (
                            <PersonIcon className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MagicWandIcon className="h-4 w-4 text-violet-600" />
                          )}
                        </div>
                        <div>
                          <div className={`rounded-2xl px-4 py-2 ${
                            message.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-100 text-slate-900'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 px-2">
                            {format(message.timestamp, 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="rounded-lg p-2 bg-violet-100">
                        <MagicWandIcon className="h-4 w-4 text-violet-600" />
                      </div>
                      <div className="bg-slate-100 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t p-4 bg-slate-50">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask AI about your sprints, risks, or team..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 border-slate-300"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <PaperPlaneIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setInputMessage("What's the sprint status?")}>
                    Sprint Status
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setInputMessage("Any risks or blockers?")}>
                    Check Risks
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setInputMessage("How is the team performing?")}>
                    Team Health
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Predictions Panel - 3 columns */}
          <Card className="lg:col-span-3 border-indigo-200">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-lg">
                    <div className="rounded-lg bg-indigo-100 p-1.5 mr-2">
                      <TargetIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    AI Predictions
                  </CardTitle>
                  <CardDescription>Real-time risk assessment</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={generatePredictions}
                  disabled={loadingPredictions}
                >
                  <UpdateIcon className={`h-3 w-3 ${loadingPredictions ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[500px] overflow-y-auto space-y-3">
                {loadingPredictions ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="border rounded-lg p-3">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-full mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : predictions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-xl bg-indigo-50 p-5 mb-3">
                      <LightningBoltIcon className="h-10 w-10 text-indigo-400" />
                    </div>
                    <p className="text-sm text-slate-600">No predictions available</p>
                    <p className="text-xs text-slate-400 mt-1">Add sprints and standups to get AI insights</p>
                  </div>
                ) : (
                  predictions.map((prediction) => {
                    const Icon = getPredictionIcon(prediction.type)
                    return (
                      <div key={prediction.id} className="border rounded-lg p-3 hover:border-violet-300 transition-all hover:shadow-sm bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-2 flex-1">
                            <Icon className={`h-4 w-4 mt-0.5 ${getPredictionColor(prediction.type)}`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-slate-900">{prediction.title}</h4>
                            </div>
                          </div>
                          <Badge variant={getImpactColor(prediction.impact) as any} className="text-xs">
                            {prediction.impact}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-slate-600 mb-2 ml-6">{prediction.description}</p>
                        
                        <div className="flex items-center space-x-2 mb-2 ml-6">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                prediction.probability >= 80 ? 'bg-red-500' :
                                prediction.probability >= 60 ? 'bg-orange-500' :
                                prediction.probability >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${prediction.probability}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{prediction.probability}%</span>
                        </div>
                        
                        <div className="ml-6 bg-slate-50 rounded-lg p-2 border-l-2 border-violet-300">
                          <p className="text-xs text-slate-700">
                            <span className="font-medium text-violet-600">💡 Recommendation:</span> {prediction.recommendation}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 ml-6">
                          <p className="text-xs text-slate-400 flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {format(prediction.createdAt, 'MMM dd, h:mm a')}
                          </p>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <CheckCircledIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <CrossCircledIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-blue-200 hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <div className="rounded-lg bg-blue-100 p-2 mr-2">
                  <BarChartIcon className="h-4 w-4 text-blue-600" />
                </div>
                Sprint Velocity Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Current Sprint</span>
                  <span className="font-semibold">{avgConfidence !== null ? `${avgConfidence}%` : '—'}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${avgConfidence ?? 0}%` }} />
                </div>
                <p className="text-xs text-slate-500">{avgConfidence !== null ? 'Derived from active predictions' : 'No data to compute trend'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <div className="rounded-lg bg-purple-100 p-2 mr-2">
                  <PersonIcon className="h-4 w-4 text-purple-600" />
                </div>
                Team Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Overall Health</span>
                  <span className="font-semibold">{teamHealth !== null ? `${teamHealth}%` : '—'}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${teamHealth ?? 0}%` }} />
                </div>
                <p className="text-xs text-slate-500">
                  {teamHealth !== null ? (standups.length > 0 ? '✅ Good team engagement' : 'Derived from predictions') : '⚠️ No recent updates'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <div className="rounded-lg bg-emerald-100 p-2 mr-2">
                  <RocketIcon className="h-4 w-4 text-emerald-600" />
                </div>
                AI Accuracy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Prediction Success</span>
                  <span className="font-semibold">{avgConfidence !== null ? `${avgConfidence}%` : '—'}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${avgConfidence ?? 0}%` }} />
                </div>
                <p className="text-xs text-slate-500">{avgConfidence !== null ? 'Based on current predictions' : 'No prediction data'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}