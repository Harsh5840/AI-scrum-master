'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RocketIcon, PersonIcon, PlusIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState<'choice' | 'create' | 'join'>('choice')
    const [orgName, setOrgName] = useState('')
    const [inviteCode, setInviteCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleCreateOrg = async () => {
        if (!orgName.trim()) {
            setError('Organization name is required')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const token = localStorage.getItem('accessToken')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: orgName }),
            })

            if (!res.ok) {
                throw new Error('Failed to create organization')
            }

            const org = await res.json()
            localStorage.setItem('currentOrgId', org.id.toString())
            router.push('/dashboard')
        } catch (err) {
            setError('Failed to create organization. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleJoinOrg = async () => {
        if (!inviteCode.trim()) {
            setError('Invite code is required')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const token = localStorage.getItem('accessToken')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invites/${inviteCode}/accept`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to join organization')
            }

            const { organization } = await res.json()
            localStorage.setItem('currentOrgId', organization.id.toString())
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Failed to join organization')
        } finally {
            setIsLoading(false)
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
                    <div className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            AI
                        </div>
                        <span className="text-xl font-semibold text-white">Scrum Master</span>
                    </div>
                </div>

                {/* Step: Choice */}
                {step === 'choice' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-semibold text-white">Welcome! Let's get started</h1>
                            <p className="text-white/40 mt-2">Create or join a team to start managing sprints</p>
                        </div>

                        <Card className="bg-white/[0.02] border-white/10 cursor-pointer hover:border-purple-500/50 transition-all group" onClick={() => setStep('create')}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all">
                                    <PlusIcon className="h-6 w-6 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-white">Create a Team</CardTitle>
                                    <CardDescription className="text-white/40">Start fresh with your own organization</CardDescription>
                                </div>
                                <ArrowRightIcon className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                            </CardHeader>
                        </Card>

                        <Card className="bg-white/[0.02] border-white/10 cursor-pointer hover:border-cyan-500/50 transition-all group" onClick={() => setStep('join')}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all">
                                    <PersonIcon className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-white">Join a Team</CardTitle>
                                    <CardDescription className="text-white/40">I have an invite code</CardDescription>
                                </div>
                                <ArrowRightIcon className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                            </CardHeader>
                        </Card>
                    </motion.div>
                )}

                {/* Step: Create */}
                {step === 'create' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="bg-white/[0.02] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <RocketIcon className="h-5 w-5 text-purple-400" />
                                    Create Your Team
                                </CardTitle>
                                <CardDescription className="text-white/40">
                                    Choose a name for your organization
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="orgName" className="text-white/70">Team Name</Label>
                                    <Input
                                        id="orgName"
                                        value={orgName}
                                        onChange={(e) => setOrgName(e.target.value)}
                                        placeholder="e.g., Acme Engineering"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    />
                                </div>

                                {error && <p className="text-red-400 text-sm">{error}</p>}

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setStep('choice')} className="flex-1 border-white/10 text-white hover:bg-white/5">
                                        Back
                                    </Button>
                                    <Button onClick={handleCreateOrg} disabled={isLoading} className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500">
                                        {isLoading ? 'Creating...' : 'Create Team'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Step: Join */}
                {step === 'join' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="bg-white/[0.02] border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <PersonIcon className="h-5 w-5 text-cyan-400" />
                                    Join a Team
                                </CardTitle>
                                <CardDescription className="text-white/40">
                                    Enter your invite code to join an existing team
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="inviteCode" className="text-white/70">Invite Code</Label>
                                    <Input
                                        id="inviteCode"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        placeholder="Paste your invite code"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono"
                                    />
                                </div>

                                {error && <p className="text-red-400 text-sm">{error}</p>}

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setStep('choice')} className="flex-1 border-white/10 text-white hover:bg-white/5">
                                        Back
                                    </Button>
                                    <Button onClick={handleJoinOrg} disabled={isLoading} className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500">
                                        {isLoading ? 'Joining...' : 'Join Team'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
