'use client'

import { useState, useRef, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useAskAIMutation } from '@/store/api/aiApi'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperPlaneIcon,
  LightningBoltIcon,
  PersonIcon,
  RocketIcon,
  ExclamationTriangleIcon,
  BarChartIcon,
  ReloadIcon,
  CopyIcon,
  MagicWandIcon,
} from '@radix-ui/react-icons'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Array<{ type: string; id: number; relevanceScore: number }>
}

const suggestions = [
  { icon: <RocketIcon className="h-4 w-4" />, text: 'How is the current sprint progressing?', category: 'Sprint' },
  { icon: <PersonIcon className="h-4 w-4" />, text: 'What blockers need attention?', category: 'Team' },
  { icon: <BarChartIcon className="h-4 w-4" />, text: 'Predict if we will meet our deadline', category: 'Forecast' },
  { icon: <LightningBoltIcon className="h-4 w-4" />, text: 'Summarize team velocity trends', category: 'Analytics' },
]

const TypingIndicator = () => (
  <div className="flex items-center gap-1">
    {[0, 0.2, 0.4].map((delay) => (
      <motion.div
        key={delay}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay }}
        className="w-2 h-2 bg-primary rounded-full"
      />
    ))}
  </div>
)

export default function AIInsightsPage() {
  const { data: sprints } = useGetSprintsQuery({})
  const [askAI] = useAskAIMutation()

  const activeSprint = sprints?.find((s: any) => {
    const now = Date.now()
    return new Date(s.startDate).getTime() <= now && new Date(s.endDate).getTime() >= now
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "I'm your AI Scrum Master. Ask about sprint progress, blockers, or risks — answers are grounded in your standup history when RAG is configured.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const question = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result = await askAI({
        query: question,
        sprintId: activeSprint?.id,
        includeTypes: ['standup', 'sprint', 'blocker', 'backlog'],
      }).unwrap()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response || result.answer || 'No response generated.',
        timestamp: new Date(),
        sources: result.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            error?.data?.message ||
            error?.data?.error ||
            'Could not reach the AI service. Check that the backend is running and GEMINI_API_KEY is set.',
          timestamp: new Date(),
        },
      ])
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

  return (
    <MainLayout title="AI Insights">
      <div className="flex gap-6 h-[calc(100vh-140px)]">
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col bg-card/80 border-border overflow-hidden">
            <CardHeader className="border-b border-border py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <MagicWandIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Grounded Q&amp;A</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      Gemini + optional Pinecone RAG
                      {activeSprint ? ` · ${activeSprint.name}` : ''}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMessages([messages[0]])}
                  className="text-muted-foreground"
                >
                  <ReloadIcon className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground border border-border'
                      }`}
                    >
                      {message.content}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-border/50 flex flex-wrap gap-1.5">
                          {message.sources.map((s, i) => (
                            <span
                              key={`${s.type}-${s.id}-${i}`}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-background/50 text-muted-foreground"
                            >
                              {s.type} #{s.id}
                            </span>
                          ))}
                        </div>
                      )}
                      {message.role === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(message.content)}
                          className="mt-2 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[10px]"
                        >
                          <CopyIcon className="h-3 w-3" /> Copy
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-secondary border border-border">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-4 border-t border-border space-y-3">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.text}
                    type="button"
                    onClick={() => handleSuggestionClick(s.text)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                  >
                    {s.icon}
                    {s.category}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about blockers, sprint risk, velocity…"
                  className="min-h-[48px] max-h-32 resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="self-end"
                >
                  <PaperPlaneIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="hidden lg:block w-72 space-y-4">
          <Card className="border-border bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
                How this works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>1. Standups land in Postgres and optionally Pinecone.</p>
              <p>2. Your question retrieves similar history.</p>
              <p>3. Gemini answers with that context — not a keyword script.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
