'use client'

import { useState, useRef, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { PageEnter } from '@/components/brand/PageEnter'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useGetSprintsQuery } from '@/store/api/sprintsApi'
import { useAskAIMutation } from '@/store/api/aiApi'
import { PaperPlaneIcon, ReloadIcon, CopyIcon } from '@radix-ui/react-icons'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ type: string; id: number; relevanceScore: number }>
}

const suggestions = [
  'What blockers need attention?',
  'What is blocking staging?',
  'Summarize open risk this week',
]

export default function AskPage() {
  const { data: sprints } = useGetSprintsQuery({})
  const [askAI] = useAskAIMutation()
  const activeSprint = sprints?.find((s: { startDate: string; endDate: string }) => {
    const now = Date.now()
    return new Date(s.startDate).getTime() <= now && new Date(s.endDate).getTime() >= now
  })

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Ask the inbox. Answers use standup history — Gemini plus optional Pinecone, not a keyword script.',
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
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: question }])
    setInput('')
    setIsLoading(true)

    try {
      const result = await askAI({
        query: question,
        sprintId: activeSprint?.id,
        includeTypes: ['standup', 'sprint', 'blocker', 'backlog'],
      }).unwrap()

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response || result.answer || 'No response generated.',
          sources: result.sources,
        },
      ])
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            error?.data?.message ||
            error?.data?.error ||
            'Could not reach the AI service. Check the backend and GEMINI_API_KEY.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout title="Ask">
      <PageEnter className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-140px)]">
        <div className="flex items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="font-display text-3xl">Ask the inbox</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Grounded in captured updates{activeSprint ? ` · ${activeSprint.name}` : ''}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMessages([messages[0]])}>
            <ReloadIcon className="h-4 w-4" />
            Clear
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {messages.map((message) => (
            <div key={message.id} className={message.role === 'user' ? 'text-right' : ''}>
              <div
                className={`inline-block max-w-[90%] text-left text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === 'user' ? 'text-primary' : 'text-foreground'
                }`}
              >
                {message.content}
              </div>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {message.sources.map((s, i) => (
                    <span key={`${s.type}-${s.id}-${i}`} className="text-[11px] text-muted-foreground">
                      {s.type} #{s.id}
                    </span>
                  ))}
                </div>
              )}
              {message.role === 'assistant' && message.id !== '1' && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(message.content)}
                  aria-label="Copy answer"
                  className="mt-2 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs min-h-8"
                >
                  <CopyIcon className="h-3 w-3" /> Copy
                </button>
              )}
            </div>
          ))}
          {isLoading && <p className="text-sm text-muted-foreground">Retrieving standup context…</p>}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => {
                  setInput(text)
                  inputRef.current?.focus()
                }}
                className="text-xs px-3 min-h-8 rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                {text}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <label htmlFor="ai-question" className="sr-only">
              Question for the inbox
            </label>
            <Textarea
              id="ai-question"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="What’s blocking staging?"
              className="min-h-12 max-h-32 resize-none"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="self-end"
              aria-label="Send question"
            >
              <PaperPlaneIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PageEnter>
    </MainLayout>
  )
}
