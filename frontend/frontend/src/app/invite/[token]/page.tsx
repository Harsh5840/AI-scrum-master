'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckIcon, Cross2Icon, PersonIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

interface InviteData {
    id: number
    email: string
    role: string
    status: string
    expiresAt: string
    org: {
        id: number
        name: string
        slug: string
    }
    inviter: {
        name: string
        email: string
    }
}

export default function AcceptInvitePage() {
    const params = useParams()
    const router = useRouter()
    const token = params.token as string

    const [invite, setInvite] = useState<InviteData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAccepting, setIsAccepting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        fetchInvite()
    }, [token])

    const fetchInvite = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invites/${token}`)

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Invalid invite')
            }

            const data = await res.json()
            setInvite(data)
        } catch (err: any) {
            setError(err.message || 'Failed to load invite')
        } finally {
            setIsLoading(false)
        }
    }

    const handleAccept = async () => {
        const authToken = localStorage.getItem('accessToken')

        if (!authToken) {
            // Redirect to login with return URL
            router.push(`/auth/login?redirect=/invite/${token}`)
            return
        }

        setIsAccepting(true)
        setError('')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invites/${token}/accept`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to accept invite')
            }

            const { organization } = await res.json()
            localStorage.setItem('currentOrgId', organization.id.toString())
            setSuccess(true)

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to accept invite')
        } finally {
            setIsAccepting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#09090B] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }} />
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/15 blur-[150px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            AI
                        </div>
                        <span className="text-xl font-semibold text-white">Scrum Master</span>
                    </Link>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <Card className="bg-white/[0.02] border-white/10">
                        <CardContent className="py-12 text-center">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-white/40 mt-4">Loading invite...</p>
                        </CardContent>
                    </Card>
                )}

                {/* Error State */}
                {!isLoading && error && !invite && (
                    <Card className="bg-white/[0.02] border-white/10">
                        <CardContent className="py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Cross2Icon className="h-6 w-6 text-red-400" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Invalid Invite</h3>
                            <p className="text-white/40 text-sm mb-6">{error}</p>
                            <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
                                <Link href="/">Go Home</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Success State */}
                {success && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <Card className="bg-white/[0.02] border-white/10">
                            <CardContent className="py-12 text-center">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <CheckIcon className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h3 className="text-white font-semibold mb-2">Welcome to the team!</h3>
                                <p className="text-white/40 text-sm">Redirecting to dashboard...</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Invite Card */}
                {!isLoading && invite && !success && (
                    <Card className="bg-white/[0.02] border-white/10">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                                <PersonIcon className="h-8 w-8 text-purple-400" />
                            </div>
                            <CardTitle className="text-white">You're invited!</CardTitle>
                            <CardDescription className="text-white/40">
                                <span className="text-white font-medium">{invite.inviter.name}</span> invited you to join
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Organization */}
                            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">
                                        {invite.org.name.substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <h4 className="text-white font-semibold">{invite.org.name}</h4>
                                <p className="text-white/40 text-sm">as {invite.role}</p>
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button asChild variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5">
                                    <Link href="/">Decline</Link>
                                </Button>
                                <Button
                                    onClick={handleAccept}
                                    disabled={isAccepting}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                                >
                                    {isAccepting ? 'Joining...' : 'Accept Invite'}
                                </Button>
                            </div>

                            <p className="text-white/30 text-xs text-center">
                                By accepting, you agree to join this organization
                            </p>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </div>
    )
}
