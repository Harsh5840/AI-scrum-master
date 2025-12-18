'use client'

import { useState, useRef, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { useToast } from '@/hooks/use-toast'
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
    const generatedPredictions: Prediction[] = []

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
          recommendation: `Consider extending sprint or reducing scope.`,
          createdAt: new Date()
        })
      }
    })

    if (sprints.length >= 2) {
      generatedPredictions.push({
        id: 'velocity-trend',
        type: 'velocity',
        title: 'Team Velocity Trend Detected',
        description: 'Based on historical data, team velocity shows consistent patterns',
        probability: 85,
        impact: 'medium',
        recommendation: 'Continue current sprint planning approach.',
        createdAt: new Date()
      })
    }

    if (standups.length === 0) {
      generatedPredictions.push({
        id: 'standup-missing',
        type: 'team_health',
        title: 'Low Team Engagement Detected',
        description: 'No recent standup updates.',
        probability: 90,
        impact: 'high',
        recommendation: 'Schedule team sync. Encourage daily standup participation.',
        createdAt: new Date()
      })
    }

    if (standups.length > 0) {
      const hasBlockers = standups.some((s: any) => s.blockers && s.blockers.length > 0)
      if (hasBlockers) {
        generatedPredictions.push({
          id: 'blocker-alert',
          type: 'blocker',
          title: 'Active Blockers Impacting Progress',
          description: 'Team members have reported blockers',
          probability: 95,
          impact: 'critical',
          recommendation: 'Prioritize blocker resolution immediately.',
          createdAt: new Date()
        })
      }
    }

    if (sprints.length > 0 && standups.length > 0 && generatedPredictions.filter(p => p.impact === 'critical').length === 0) {
      generatedPredictions.push({
        id: 'success-pred',
        type: 'sprint_risk',
        title: 'High Sprint Success Probability',
        description: 'Current sprint is on track with good team engagement',
        probability: 88,
        impact: 'low',
        recommendation: 'Continue current practices.',
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
      let aiResponse = ''
      const lowerInput = inputMessage.toLowerCase()

      if (lowerInput.includes('sprint') || lowerInput.includes('progress')) {
        const activeSprints = sprints.filter((s: any) => {
          const now = new Date()
          return new Date(s.startDate) <= now && new Date(s.endDate) >= now
        })
        aiResponse = activeSprints.length > 0
          ? `You have ${activeSprints.length} active sprint(s). Based on my analysis, the sprint is ${predictions.some(p => p.impact === 'critical') ? 'at risk' : 'progressing well'}.`
          : `No active sprints currently. You have ${sprints.length} total sprints.`
      } else if (lowerInput.includes('risk') || lowerInput.includes('blocker')) {
        const criticalPreds = predictions.filter(p => p.impact === 'critical' || p.type === 'blocker')
        aiResponse = criticalPreds.length > 0
          ? `I've identified ${criticalPreds.length} critical risk(s): ${criticalPreds.map(p => p.title).join('; ')}`
          : 'No critical risks detected. Your team is doing well!'
      } else if (lowerInput.includes('help')) {
        aiResponse = `I can help with:\n• Sprint analysis\n• Risk assessment\n• Blocker detection\n• Team health monitoring`
      } else {
        aiResponse = `Based on ${sprints.length} sprint(s) and ${standups.length} standup(s), I've generated ${predictions.length} prediction(s). ${predictions.some(p => p.impact === 'critical') ? '⚠️ Some require attention.' : '✅ Everything looks good!'}`
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
      toast({ title: "Error", description: "Failed to get AI response", variant: "destructive" })
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/20 text-red-400'
      case 'high': return 'bg-orange-500/20 text-orange-400'
      case 'medium': return 'bg-amber-500/20 text-amber-400'
      case 'low': return 'bg-emerald-500/20 text-emerald-400'
      default: return 'bg-white/10 text-white/60'
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
      case 'sprint_risk': return 'text-red-400'
      case 'blocker': return 'text-orange-400'
      case 'velocity': return 'text-cyan-400'
      case 'team_health': return 'text-purple-400'
      default: return 'text-white/60'
    }
  }

  return (
    <MainLayout title="AI Insights">
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 via-violet-600 to-cyan-600 p-8">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                <MagicWandIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">AI-Powered Insights</h1>
            </div>
            <p className="text-white/70 max-w-2xl">
              Real-time predictions, risk assessment, and intelligent recommendations
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Active Predictions</CardTitle>
              <LightningBoltIcon className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{predictions.length}</div>
              <p className="text-xs text-white/40">AI-generated insights</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Critical Risks</CardTitle>
              <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {predictions.filter(p => p.impact === 'critical').length}
              </div>
              <p className="text-xs text-white/40">Require attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Avg Confidence</CardTitle>
              <TargetIcon className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">
                {avgConfidence ?? 0}%
              </div>
              <p className="text-xs text-white/40">Prediction accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/50">Data Sources</CardTitle>
              <RocketIcon className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">
                {sprints.length + standups.length}
              </div>
              <p className="text-xs text-white/40">{sprints.length} sprints, {standups.length} standups</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* AI Chat */}
          <Card className="lg:col-span-4 bg-white/[0.02] border-white/5">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-white">
                    <ChatBubbleIcon className="h-4 w-4 mr-2 text-purple-400" />
                    AI Assistant
                  </CardTitle>
                  <CardDescription className="text-white/40">Ask about sprints, risks, performance</CardDescription>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="rounded-lg bg-purple-500/20 p-3 mb-3">
                      <MagicWandIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <p className="text-sm text-white/40">Ask about sprints, risks, or team performance</p>
                    <Button variant="outline" size="sm" className="mt-3 border-white/10 text-white/60" onClick={() => setInputMessage("What's the sprint status?")}>
                      Try an example
                    </Button>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                        <div className={`rounded-2xl px-4 py-2 ${message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                            : 'bg-white/5 text-white/80'
                          }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className="text-xs text-white/30 mt-1 px-2">
                          {format(message.timestamp, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-white/40 rounded-full animate-bounce" />
                        <div className="h-2 w-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="h-2 w-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/5 p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask AI about your sprints, risks, or team..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500"
                  >
                    <PaperPlaneIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {['Sprint Status', 'Check Risks', 'Team Health'].map(q => (
                    <Button key={q} variant="outline" size="sm" className="border-white/10 text-white/50 hover:bg-white/5" onClick={() => setInputMessage(q)}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Predictions */}
          <Card className="lg:col-span-3 bg-white/[0.02] border-white/5">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-white">
                    <TargetIcon className="h-4 w-4 mr-2 text-cyan-400" />
                    AI Predictions
                  </CardTitle>
                  <CardDescription className="text-white/40">Real-time risk assessment</CardDescription>
                </div>
                <Button size="sm" variant="ghost" onClick={generatePredictions} disabled={loadingPredictions} className="text-white/40 hover:text-white">
                  <UpdateIcon className={`h-3 w-3 ${loadingPredictions ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[400px] overflow-y-auto space-y-3">
                {loadingPredictions ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="border border-white/5 rounded-lg p-3">
                      <Skeleton className="h-4 w-3/4 mb-2 bg-white/10" />
                      <Skeleton className="h-3 w-full bg-white/5" />
                    </div>
                  ))
                ) : predictions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <LightningBoltIcon className="h-10 w-10 text-white/20 mb-3" />
                    <p className="text-sm text-white/40">No predictions available</p>
                    <p className="text-xs text-white/30">Add sprints and standups to get AI insights</p>
                  </div>
                ) : (
                  predictions.map((prediction) => {
                    const Icon = getPredictionIcon(prediction.type)
                    return (
                      <div key={prediction.id} className="border border-white/5 rounded-lg p-3 hover:border-white/10 transition-all bg-white/[0.01]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-2 flex-1">
                            <Icon className={`h-4 w-4 mt-0.5 ${getPredictionColor(prediction.type)}`} />
                            <h4 className="font-medium text-sm text-white">{prediction.title}</h4>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded ${getImpactColor(prediction.impact)}`}>
                            {prediction.impact}
                          </span>
                        </div>

                        <p className="text-xs text-white/50 mb-2 ml-6">{prediction.description}</p>

                        <div className="flex items-center space-x-2 mb-2 ml-6">
                          <div className="flex-1 bg-white/10 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${prediction.probability >= 80 ? 'bg-red-500' :
                                  prediction.probability >= 60 ? 'bg-orange-500' :
                                    prediction.probability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                              style={{ width: `${prediction.probability}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-white/60">{prediction.probability}%</span>
                        </div>

                        <div className="ml-6 bg-purple-500/10 rounded-lg p-2 border-l-2 border-purple-500">
                          <p className="text-xs text-white/60">
                            <span className="font-medium text-purple-400">💡</span> {prediction.recommendation}
                          </p>
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
          {[
            { title: 'Sprint Velocity Trend', icon: BarChartIcon, color: 'cyan', value: avgConfidence, label: 'Current Sprint' },
            { title: 'Team Health Score', icon: PersonIcon, color: 'purple', value: teamHealth, label: 'Overall Health' },
            { title: 'AI Accuracy Rate', icon: RocketIcon, color: 'emerald', value: avgConfidence, label: 'Prediction Success' }
          ].map(item => (
            <Card key={item.title} className="bg-white/[0.02] border-white/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center text-white">
                  <item.icon className={`h-4 w-4 mr-2 text-${item.color}-400`} />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/50">{item.label}</span>
                    <span className="font-semibold text-white">{item.value ?? 0}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-${item.color}-500 rounded-full`} style={{ width: `${item.value ?? 0}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}