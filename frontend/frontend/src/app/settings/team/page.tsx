'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { PersonIcon, PlusIcon, TrashIcon, EnvelopeClosedIcon, CheckIcon } from '@radix-ui/react-icons'

interface Member {
    id: number
    userId: number
    role: string
    user: {
        id: number
        name: string
        email: string
        avatar?: string
    }
}

interface Invite {
    id: number
    email: string
    role: string
    status: string
    createdAt: string
}

export default function TeamSettingsPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [invites, setInvites] = useState<Invite[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState('member')
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchTeamData()
    }, [])

    const fetchTeamData = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            const orgId = localStorage.getItem('currentOrgId')

            if (!orgId) {
                setError('No organization selected')
                setIsLoading(false)
                return
            }

            // Fetch members
            const membersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${orgId}/members`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (membersRes.ok) {
                const membersData = await membersRes.json()
                setMembers(membersData)
            }

            // Fetch pending invites
            const invitesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${orgId}/invites`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (invitesRes.ok) {
                const invitesData = await invitesRes.json()
                setInvites(invitesData)
            }
        } catch (err) {
            setError('Failed to load team data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendInvite = async () => {
        if (!inviteEmail.trim()) {
            setError('Email is required')
            return
        }

        setIsSending(true)
        setError('')

        try {
            const token = localStorage.getItem('accessToken')
            const orgId = localStorage.getItem('currentOrgId')

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${orgId}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
            })

            if (!res.ok) {
                throw new Error('Failed to send invite')
            }

            const data = await res.json()
            setSuccess(`Invite sent! Link: ${window.location.origin}${data.inviteLink}`)
            setInviteEmail('')
            setIsInviteDialogOpen(false)
            fetchTeamData()
        } catch (err) {
            setError('Failed to send invite')
        } finally {
            setIsSending(false)
        }
    }

    const handleRemoveMember = async (userId: number) => {
        if (!confirm('Remove this member from the team?')) return

        try {
            const token = localStorage.getItem('accessToken')
            const orgId = localStorage.getItem('currentOrgId')

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${orgId}/members/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })

            fetchTeamData()
        } catch (err) {
            setError('Failed to remove member')
        }
    }

    const handleCancelInvite = async (inviteId: number) => {
        try {
            const token = localStorage.getItem('accessToken')
            const orgId = localStorage.getItem('currentOrgId')

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations/${orgId}/invites/${inviteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })

            fetchTeamData()
        } catch (err) {
            setError('Failed to cancel invite')
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'owner': return 'bg-purple-500/20 text-purple-400'
            case 'admin': return 'bg-cyan-500/20 text-cyan-400'
            default: return 'bg-white/10 text-white/60'
        }
    }

    return (
        <MainLayout title="Team Settings">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">Team Settings</h2>
                        <p className="text-white/40 text-sm mt-1">Manage your team members and invites</p>
                    </div>

                    <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Invite Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0a0a0f] border-white/10">
                            <DialogHeader>
                                <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                                <DialogDescription className="text-white/50">
                                    Send an invite link to add a new member to your team.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-white/70">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="teammate@company.com"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role" className="text-white/70">Role</Label>
                                    <select
                                        id="role"
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value)}
                                        className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-white focus:border-purple-500/50 focus:outline-none"
                                    >
                                        <option value="member" className="bg-[#0a0a0f]">Member</option>
                                        <option value="admin" className="bg-[#0a0a0f]">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)} className="border-white/10 text-white hover:bg-white/5">
                                    Cancel
                                </Button>
                                <Button onClick={handleSendInvite} disabled={isSending} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                                    {isSending ? 'Sending...' : 'Send Invite'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Success/Error messages */}
                {success && (
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Team Members */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <PersonIcon className="h-5 w-5 text-purple-400" />
                            Team Members
                        </CardTitle>
                        <CardDescription className="text-white/40">
                            {members.length} member{members.length !== 1 ? 's' : ''} in your team
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-white/50">Member</TableHead>
                                    <TableHead className="text-white/50">Role</TableHead>
                                    <TableHead className="text-white/50">Joined</TableHead>
                                    <TableHead className="text-white/50 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={4} className="text-center text-white/40">Loading...</TableCell>
                                    </TableRow>
                                ) : members.length === 0 ? (
                                    <TableRow className="border-white/5">
                                        <TableCell colSpan={4} className="text-center text-white/40 py-8">
                                            No members yet. Invite your team!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    members.map((member) => (
                                        <TableRow key={member.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border border-white/10">
                                                        <AvatarImage src={member.user.avatar} />
                                                        <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-white/70 text-xs">
                                                            {member.user.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-white font-medium">{member.user.name}</p>
                                                        <p className="text-white/40 text-sm">{member.user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                    {member.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-white/60">
                                                Recently
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {member.role !== 'owner' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveMember(member.userId)}
                                                        className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pending Invites */}
                <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <EnvelopeClosedIcon className="h-5 w-5 text-cyan-400" />
                            Pending Invites
                        </CardTitle>
                        <CardDescription className="text-white/40">
                            {invites.length} pending invite{invites.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {invites.length === 0 ? (
                            <div className="text-center py-8 text-white/40">
                                No pending invites
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-white/50">Email</TableHead>
                                        <TableHead className="text-white/50">Role</TableHead>
                                        <TableHead className="text-white/50">Sent</TableHead>
                                        <TableHead className="text-white/50 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invites.map((invite) => (
                                        <TableRow key={invite.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="text-white">{invite.email}</TableCell>
                                            <TableCell>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(invite.role)}`}>
                                                    {invite.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-white/60">
                                                {new Date(invite.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCancelInvite(invite.id)}
                                                    className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
                                                >
                                                    Cancel
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}
