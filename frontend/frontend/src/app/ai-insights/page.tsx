'use client'

import { useState, useRef, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useGetStandupsQuery } from '@/store/api/standupsApi'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperPlaneIcon,
  LightningBoltIcon,
  PersonIcon,
  RocketIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  BarChartIcon,
  ChatBubbleIcon,
  ReloadIcon,
  CopyIcon,
  MagicWandIcon,
  ClockIcon,
} from '@radix-ui/react-icons'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: string[]
}

// Suggestion prompts
const suggestions = [
  { icon: <RocketIcon className="h-4 w-4" />, text: "How is the current sprint progressing?", category: "Sprint" },
  { icon: <PersonIcon className="h-4 w-4" />, text: "What blockers need attention?", category: "Team" },
  { icon: <BarChartIcon className="h-4 w-4" />, text: "Predict if we'll meet our deadline", category: "Forecast" },
  { icon: <LightningBoltIcon className="h-4 w-4" />, text: "Summarize team velocity trends", category: "Analytics" },
]

// Typing indicator
const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0 }}
      className="w-2 h-2 bg-purple-400 rounded-full"
    />
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
      className="w-2 h-2 bg-purple-400 rounded-full"
    />
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
      className="w-2 h-2 bg-purple-400 rounded-full"
    />
  </div>
)

export default function AIInsightsPage() {
  const { data: sprints } = useGetSprintsQuery({})
  const { data: standups } = useGetStandupsQuery({})

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Scrum Master assistant. I can help you analyze sprint performance, identify risks, and provide recommendations based on your team's data. What would you like to know?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Generate AI response (simulated)
  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const activeSprint = sprints?.find((s: any) => s.status === 'active')
    const totalStandups = standups?.length || 0

    // Simple response logic based on keywords
    if (userMessage.toLowerCase().includes('sprint') && userMessage.toLowerCase().includes('progress')) {
      return `Based on the current data, ${activeSprint ? `**${activeSprint.name}**` : 'your active sprint'} is progressing well. Here's a summary:\n\n• **Completion Rate**: ~65% of story points completed\n• **Days Remaining**: ${activeSprint ? Math.ceil((new Date(activeSprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 5} days\n• **Velocity Trend**: Slightly above average\n\n**Recommendation**: The team is on track. Consider checking in on any items that have been in progress for more than 2 days.`
    }

    if (userMessage.toLowerCase().includes('blocker')) {
      return `I've analyzed the current blockers:\n\n🔴 **High Priority**: 2 blockers require immediate attention\n🟡 **Medium Priority**: 1 blocker is being investigated\n\n**Top Blocker**: API integration dependency - Team is waiting on external API documentation.\n\n**AI Suggestion**: Consider scheduling a sync with the external team or implementing a mock API to unblock development.`
    }

    if (userMessage.toLowerCase().includes('deadline') || userMessage.toLowerCase().includes('predict')) {
      return `Based on historical velocity and current progress:\n\n📊 **Prediction**: Team will complete **~92%** of committed work by sprint end.\n\n**Confidence**: High (based on ${totalStandups} standups and velocity patterns)\n\n**Risk Factors**:\n- 2 active blockers may impact delivery\n- 1 story has been in progress for 4 days\n\n**Recommendation**: Consider reducing scope by ~3 story points or addressing blockers immediately to hit 100%.`
    }

    if (userMessage.toLowerCase().includes('velocity')) {
      return `📈 **Velocity Analysis**\n\nLast 5 sprints:\n- Sprint 19: 42 pts\n- Sprint 20: 38 pts\n- Sprint 21: 45 pts\n- Sprint 22: 41 pts\n- Sprint 23: 48 pts\n\n**Average**: 42.8 points/sprint\n**Trend**: ↗️ +12% improvement\n\nYour team's velocity is stable and improving. The slight dip in Sprint 20 correlates with holiday period.`
    }

    return `I understand you're asking about "${userMessage.substring(0, 50)}..."\n\nBased on your team's data:\n- Active sprint is progressing normally\n- ${totalStandups} standups logged this period\n- Team health indicators are positive\n\nWould you like me to dive deeper into any specific area? I can analyze sprints, blockers, team performance, or provide forecasts.`
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateResponse(input.trim())

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        sources: ['Sprint Data', 'Standup History'],
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (text: string) => {
    setInput(text)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <MainLayout title="AI Insights">
      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col bg-gradient-to-br from-white/[0.02] to-transparent border-white/5 overflow-hidden">
            {/* Header */}
            <CardHeader className="border-b border-white/5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <MagicWandIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">AI Scrum Master</CardTitle>
                    <CardDescription className="text-white/40 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Online • Powered by Gemini
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMessages([messages[0]])}
                  className="text-white/40 hover:text-white/60"
                >
                  <ReloadIcon className="h-4 w-4 mr-1" />
                  Clear Chat
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                            ? 'bg-white/10'
                            : 'bg-gradient-to-br from-purple-500/30 to-cyan-500/30'
                          }`}>
                          {message.role === 'user' ? (
                            <PersonIcon className="h-4 w-4 text-white/70" />
                          ) : (
                            <LightningBoltIcon className="h-4 w-4 text-purple-400" />
                          )}
                        </div>

                        <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                          {/* Message bubble */}
                          <div className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30'
                              : 'bg-white/[0.03] border border-white/5'
                            }`}>
                            <p className="text-sm text-white/90 whitespace-pre-wrap">
                              {message.content.split('**').map((part, i) =>
                                i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part
                              )}
                            </p>
                          </div>

                          {/* Metadata */}
                          <div className={`flex items-center gap-2 mt-1 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-white/30">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.role === 'assistant' && (
                              <button
                                onClick={() => copyMessage(message.content)}
                                className="text-white/20 hover:text-white/40 transition-colors"
                              >
                                <CopyIcon className="h-3 w-3" />
                              </button>
                            )}
                          </div>

                          {/* Sources */}
                          {message.sources && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] text-white/20">Sources:</span>
                              {message.sources.map((source, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">
                                  {source}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
                    <LightningBoltIcon className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-white/[0.03] border border-white/5">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t border-white/5 p-4">
              {messages.length === 1 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                        {suggestion.icon}
                      </div>
                      <div>
                        <p className="text-sm text-white/70 group-hover:text-white/90">{suggestion.text}</p>
                        <p className="text-[10px] text-white/30">{suggestion.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about sprints, blockers, or team performance..."
                  className="flex-1 bg-white/[0.02] border-white/10 text-white placeholder:text-white/30 resize-none min-h-[44px] max-h-[120px]"
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="h-11 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50"
                >
                  <PaperPlaneIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Insights Sidebar */}
        <div className="w-80 space-y-4">
          {/* Quick Predictions */}
          <Card className="bg-gradient-to-br from-purple-500/[0.05] to-cyan-500/[0.05] border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <BarChartIcon className="h-4 w-4 text-purple-400" />
                Quick Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">Sprint Completion</span>
                  <span className="text-sm font-bold text-white">92%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">Risk Level</span>
                  <span className="text-sm font-bold text-amber-400">Medium</span>
                </div>
                <p className="text-[10px] text-white/40">2 blockers may impact delivery</p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">Team Sentiment</span>
                  <span className="text-sm font-bold text-emerald-400">Positive</span>
                </div>
                <p className="text-[10px] text-white/40">Based on standup analysis</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Insights */}
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <LightningBoltIcon className="h-4 w-4 text-cyan-400" />
                Auto Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <CheckCircledIcon className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/70">Velocity trending up +12%</p>
                  <p className="text-[10px] text-white/30">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <ExclamationTriangleIcon className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/70">ASM-102 stalled for 4 days</p>
                  <p className="text-[10px] text-white/30">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <RocketIcon className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/70">Sprint 23 on track for goals</p>
                  <p className="text-[10px] text-white/30">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Status */}
          <Card className="bg-white/[0.02] border-white/5">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                    <MagicWandIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#09090B]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Gemini 2.0 Flash</p>
                  <p className="text-[10px] text-white/40 flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    Data synced 2 min ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}