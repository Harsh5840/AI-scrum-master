'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckIcon, ChevronDownIcon, PlusIcon, GearIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

interface Organization {
    id: number
    name: string
    slug: string
    plan: string
    _count?: {
        members: number
        sprints: number
    }
}

interface OrgSwitcherProps {
    collapsed?: boolean
}

export function OrgSwitcher({ collapsed = false }: OrgSwitcherProps) {
    const router = useRouter()
    const [orgs, setOrgs] = useState<Organization[]>([])
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchOrganizations()
    }, [])

    const fetchOrganizations = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                const data = await res.json()
                setOrgs(data)

                // Set current org from localStorage or first org
                const savedOrgId = localStorage.getItem('currentOrgId')
                const current = savedOrgId
                    ? data.find((o: Organization) => o.id.toString() === savedOrgId)
                    : data[0]

                if (current) {
                    setCurrentOrg(current)
                }
            }
        } catch (error) {
            console.error('Failed to fetch organizations:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const switchOrg = (org: Organization) => {
        setCurrentOrg(org)
        localStorage.setItem('currentOrgId', org.id.toString())
        // Refresh current page to load new org data
        window.location.reload()
    }

    if (isLoading) {
        return (
            <div className={cn("h-10 bg-white/5 rounded-lg animate-pulse", collapsed && "w-10")} />
        )
    }

    if (!currentOrg) {
        return (
            <Button
                variant="ghost"
                onClick={() => router.push('/onboarding')}
                className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5"
            >
                <PlusIcon className="h-4 w-4 mr-2" />
                {!collapsed && 'Create Team'}
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-between text-white hover:bg-white/5 px-2",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                            {currentOrg.name.substring(0, 2).toUpperCase()}
                        </div>
                        {!collapsed && (
                            <span className="truncate text-sm font-medium">{currentOrg.name}</span>
                        )}
                    </div>
                    {!collapsed && <ChevronDownIcon className="h-4 w-4 text-white/40 flex-shrink-0" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#0a0a0f] border-white/10" align="start">
                <DropdownMenuLabel className="text-white/50 text-xs">Switch Team</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                {orgs.map((org) => (
                    <DropdownMenuItem
                        key={org.id}
                        onClick={() => switchOrg(org)}
                        className="text-white/80 focus:bg-white/5 focus:text-white cursor-pointer"
                    >
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-xs font-medium text-white/70">
                                {org.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 truncate">
                                <span className="text-sm">{org.name}</span>
                                {org._count && (
                                    <span className="text-xs text-white/40 ml-2">{org._count.members} members</span>
                                )}
                            </div>
                            {org.id === currentOrg.id && (
                                <CheckIcon className="h-4 w-4 text-emerald-400" />
                            )}
                        </div>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                    onClick={() => router.push('/onboarding')}
                    className="text-white/60 focus:bg-white/5 focus:text-white cursor-pointer"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create New Team
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push('/settings/team')}
                    className="text-white/60 focus:bg-white/5 focus:text-white cursor-pointer"
                >
                    <GearIcon className="h-4 w-4 mr-2" />
                    Team Settings
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
