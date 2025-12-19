'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircledIcon, LinkBreak2Icon, RocketIcon, ChatBubbleIcon } from '@radix-ui/react-icons'

interface SlackStatus {
    connected: boolean
    teamName?: string
    channel?: string
}

function IntegrationsContent() {
    const searchParams = useSearchParams()
    const [slackStatus, setSlackStatus] = useState<SlackStatus | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isTesting, setIsTesting] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        checkSlackStatus()

        const slackConnected = searchParams.get('slack_connected')
        const slackError = searchParams.get('slack_error')

        if (slackConnected === 'true') {
            setMessage('Slack connected successfully!')
        } else if (slackError) {
            setMessage(`Slack connection failed: ${slackError}`)
        }
    }, [searchParams])

    const checkSlackStatus = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            const orgId = localStorage.getItem('currentOrgId')

            if (!orgId) {
                setIsLoading(false)
                return
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slack/status?orgId=${orgId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                const data = await res.json()
                setSlackStatus(data)
            }
        } catch (error) {
            console.error('Error checking Slack status:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConnectSlack = () => {
        const orgId = localStorage.getItem('currentOrgId')
        if (!orgId) {
            setMessage('Please select an organization first')
            return
        }

        setIsConnecting(true)
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/slack/oauth/install?orgId=${orgId}`
    }

    const handleDisconnectSlack = async () => {
        if (!confirm('Disconnect Slack integration?')) return

        try {
            const token = localStorage.getItem('accessToken')
            const orgId = localStorage.getItem('currentOrgId')

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slack/disconnect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ orgId: parseInt(orgId || '0') }),
            })

            if (res.ok) {
                setSlackStatus({ connected: false })
                setMessage('Slack disconnected')
            }
        } catch (error) {
            setMessage('Failed to disconnect Slack')
        }
    }

    const handleTestSlack = async () => {
        setIsTesting(true)
        try {
            const token = localStorage.getItem('accessToken')
            const orgId = localStorage.getItem('currentOrgId')

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slack/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ orgId: parseInt(orgId || '0') }),
            })

            if (res.ok) {
                setMessage('Test message sent to Slack!')
            } else {
                setMessage('Failed to send test message')
            }
        } catch (error) {
            setMessage('Failed to send test message')
        } finally {
            setIsTesting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-white">Integrations</h2>
                <p className="text-white/40 text-sm mt-1">Connect your favorite tools</p>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.includes('success') || message.includes('sent') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'}`}>
                    {message}
                </div>
            )}

            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A154B] to-[#611f69] flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-white">Slack</CardTitle>
                                <CardDescription className="text-white/40">Automated standups and notifications</CardDescription>
                            </div>
                        </div>
                        {!isLoading && slackStatus?.connected && (
                            <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                                <CheckCircledIcon className="h-4 w-4" />
                                Connected
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                    ) : slackStatus?.connected ? (
                        <>
                            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">{slackStatus.teamName}</p>
                                        <p className="text-white/40 text-sm">Channel: #{slackStatus.channel}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={handleTestSlack} disabled={isTesting} className="border-white/10 text-white hover:bg-white/5">
                                            {isTesting ? '...' : 'Test'}
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={handleDisconnectSlack} className="text-red-400 hover:bg-red-500/10">
                                            <LinkBreak2Icon className="h-4 w-4 mr-1" />
                                            Disconnect
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-2 text-white mb-1">
                                        <ChatBubbleIcon className="h-4 w-4 text-purple-400" />
                                        <span className="font-medium text-sm">/standup Command</span>
                                    </div>
                                    <p className="text-white/40 text-xs">Team members can post standups from Slack</p>
                                </div>
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-2 text-white mb-1">
                                        <RocketIcon className="h-4 w-4 text-cyan-400" />
                                        <span className="font-medium text-sm">Notifications</span>
                                    </div>
                                    <p className="text-white/40 text-xs">Blocker alerts and sprint updates</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-white/40 text-sm mb-4">Connect Slack to enable automated standups and team notifications</p>
                            <Button onClick={handleConnectSlack} disabled={isConnecting} className="bg-gradient-to-r from-[#4A154B] to-[#611f69] hover:from-[#611f69] hover:to-[#4A154B] text-white">
                                {isConnecting ? 'Connecting...' : 'Add to Slack'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-white/[0.02] border-white/5 opacity-60">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <span className="text-blue-400 font-bold">J</span>
                            </div>
                            <div>
                                <CardTitle className="text-white text-base">Jira</CardTitle>
                                <CardDescription className="text-white/40 text-xs">Coming Soon</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
                <Card className="bg-white/[0.02] border-white/5 opacity-60">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                                <span className="text-white font-bold">G</span>
                            </div>
                            <div>
                                <CardTitle className="text-white text-base">GitHub</CardTitle>
                                <CardDescription className="text-white/40 text-xs">Coming Soon</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default function IntegrationsPage() {
    return (
        <MainLayout title="Integrations">
            <Suspense fallback={<div className="h-40 bg-white/5 rounded-lg animate-pulse" />}>
                <IntegrationsContent />
            </Suspense>
        </MainLayout>
    )
}
