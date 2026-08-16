'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { OrgSwitcher } from './OrgSwitcher'
import {
  DashboardIcon,
  CalendarIcon,
  ChatBubbleIcon,
  ExclamationTriangleIcon,
  BarChartIcon,
  GearIcon,
  HamburgerMenuIcon,
  LightningBoltIcon,
  ChevronRightIcon,
  TimerIcon,
} from '@radix-ui/react-icons'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
  { id: 'sprints', label: 'Sprints', icon: CalendarIcon, href: '/sprints' },
  { id: 'standups', label: 'Standups', icon: ChatBubbleIcon, href: '/standups' },
  { id: 'blockers', label: 'Blockers', icon: ExclamationTriangleIcon, href: '/blockers' },
  { id: 'ai-insights', label: 'AI Insights', icon: LightningBoltIcon, href: '/ai-insights' },
  { id: 'analytics', label: 'Analytics', icon: BarChartIcon, href: '/analytics' },
  { id: 'workflows', label: 'Jobs', icon: TimerIcon, href: '/workflows' },
  { id: 'settings', label: 'Settings', icon: GearIcon, href: '/settings' },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-card transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-16',
        className
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-2 overflow-hidden transition-opacity',
            !sidebarOpen && 'opacity-0 w-0'
          )}
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display text-xs flex-shrink-0">
            S
          </div>
          <span className="font-display text-sm whitespace-nowrap">Signal</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-b border-border px-2 py-2">
        <OrgSwitcher collapsed={!sidebarOpen} />
      </div>

      <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start h-9 px-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary',
                isActive && 'bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary',
                !sidebarOpen && 'justify-center px-2'
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className={cn('h-4 w-4 flex-shrink-0', sidebarOpen && 'mr-2')} />
                {sidebarOpen && <span className="flex-1 text-left text-sm">{item.label}</span>}
              </Link>
            </Button>
          )
        })}
      </nav>

      <div className="border-t border-border p-2">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors',
            !sidebarOpen && 'justify-center p-1'
          )}
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-primary/15 text-primary text-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name || 'Guest'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
