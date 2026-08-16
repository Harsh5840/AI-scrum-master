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
        const savedOrgId = localStorage.getItem('currentOrgId')
        const current = savedOrgId
          ? data.find((o: Organization) => o.id.toString() === savedOrgId)
          : data[0]
        if (current) setCurrentOrg(current)
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
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className={cn('h-10 bg-secondary rounded-lg animate-pulse', collapsed && 'w-10')} />
    )
  }

  if (!currentOrg) {
    return (
      <Button
        variant="ghost"
        onClick={() => router.push('/onboarding')}
        className="w-full justify-start text-muted-foreground"
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
            'w-full justify-between px-2',
            collapsed && 'justify-center px-0'
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs flex-shrink-0">
              {currentOrg.name.substring(0, 2).toUpperCase()}
            </div>
            {!collapsed && (
              <span className="truncate text-sm font-medium">{currentOrg.name}</span>
            )}
          </div>
          {!collapsed && <ChevronDownIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Team</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {orgs.map((org) => (
          <DropdownMenuItem key={org.id} onClick={() => switchOrg(org)} className="cursor-pointer">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-6 h-6 rounded bg-primary/15 text-primary flex items-center justify-center text-xs font-medium">
                {org.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <span className="text-sm">{org.name}</span>
              </div>
              {org.id === currentOrg.id && <CheckIcon className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/onboarding')} className="cursor-pointer">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create New Team
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings/team')} className="cursor-pointer">
          <GearIcon className="h-4 w-4 mr-2" />
          Team Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
