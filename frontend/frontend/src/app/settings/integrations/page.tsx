'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircledIcon, LinkBreak2Icon, RocketIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { apiUrl, authHeaders } from '@/lib/session'

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
            const orgId = localStorage.getItem('currentOrgId')

            if (!orgId) {
                setIsLoading(false)
                return
            }

            const res = await fetch(apiUrl(`/slack/status?orgId=${orgId}`), {
                headers: authHeaders(),
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

    const handleConnectSlack = async () => {
        const orgId = localStorage.getItem('currentOrgId')
        if (!orgId) {
            setMessage('Please select an organization first')
            return
        }

        setIsConnecting(true)
        try {
            const res = await fetch(apiUrl(`/slack/oauth/install?orgId=${orgId}`), {
                headers: authHeaders(),
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
                return
            }
            setMessage(data.message || data.error || 'Could not start Slack OAuth')
        } catch {
            setMessage('Could not start Slack OAuth')
        } finally {
            setIsConnecting(false)
        }
    }

    const handleDisconnectSlack = async () => {
        if (!confirm('Disconnect Slack integration?')) return

        try {
            const orgId = localStorage.getItem('currentOrgId')

            const res = await fetch(apiUrl('/slack/disconnect'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders(),
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
            const orgId = localStorage.getItem('currentOrgId')

            const res = await fetch(apiUrl('/slack/test'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders(),
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
                <h2 className="font-display text-2xl">Slack</h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    The only connector with a live OAuth status check.
                </p>
            </div>

            {message && (
                <p
                    role="status"
                    className={`text-sm ${
                        message.toLowerCase().includes('fail')
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                    }`}
                >
                    {message}
                </p>
            )}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base font-display">Workspace</CardTitle>
                            <CardDescription>Standups and blocker alerts via Slack OAuth</CardDescription>
                        </div>
                        {!isLoading && slackStatus?.connected && (
                            <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                                <CheckCircledIcon className="h-4 w-4" />
                                Connected
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">Checking Slack status…</p>
                    ) : slackStatus?.connected ? (
                        <div className="rounded-xl border border-border p-4 space-y-3">
                            <div>
                                <p className="font-medium">{slackStatus.teamName}</p>
                                <p className="text-sm text-muted-foreground">#{slackStatus.channel}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                <ChatBubbleIcon className="inline h-3.5 w-3.5 mr-1" />
                                /standup posts updates. <RocketIcon className="inline h-3.5 w-3.5 mx-1" />
                                Notifications cover blockers and sprint events.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline" onClick={handleTestSlack} disabled={isTesting}>
                                    {isTesting ? 'Sending…' : 'Send test'}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleDisconnectSlack}>
                                    <LinkBreak2Icon className="h-4 w-4" />
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Connect Slack to post standups from the workspace and receive blocker alerts.
                            </p>
                            <Button onClick={handleConnectSlack} disabled={isConnecting}>
                                {isConnecting ? 'Redirecting…' : 'Add to Slack'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default function IntegrationsPage() {
    return (
        <MainLayout title="Integrations">
            <Suspense fallback={<p className="text-sm text-muted-foreground">Loading integrations…</p>}>
                <IntegrationsContent />
            </Suspense>
        </MainLayout>
    )
}
