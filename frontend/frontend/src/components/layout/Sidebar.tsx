'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DashboardIcon,
  CalendarIcon,
  ChatBubbleIcon,
  ExclamationTriangleIcon,
  BarChartIcon,
  GearIcon,
  HamburgerMenuIcon,
  RocketIcon,
  LightningBoltIcon,
  PersonIcon,
} from '@radix-ui/react-icons'

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    href: '/dashboard',
  },
  {
    id: 'sprints',
    label: 'Sprints',
    icon: CalendarIcon,
    href: '/sprints',
  },
  {
    id: 'standups',
    label: 'Standups',
    icon: ChatBubbleIcon,
    href: '/standups',
  },
  {
    id: 'blockers',
    label: 'Blockers',
    icon: ExclamationTriangleIcon,
    href: '/blockers',
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: LightningBoltIcon,
    href: '/ai-insights',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChartIcon,
    href: '/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: GearIcon,
    href: '/settings',
  },
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
        'flex h-full w-60 flex-col border-r bg-zinc-950 border-zinc-800 transition-all duration-300',
        !sidebarOpen && 'w-16',
        className
      )}
    >
      {/* Logo/Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-3">
        <div className={cn(
          'flex items-center space-x-2 transition-opacity duration-200 overflow-hidden text-zinc-100',
          !sidebarOpen && 'opacity-0 w-0'
        )}>
          <RocketIcon className="h-5 w-5" />
          <span className="font-semibold text-sm tracking-tight whitespace-nowrap">AI Scrum Master</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start h-9 px-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900',
                isActive && 'bg-zinc-900 text-zinc-100 font-medium',
                !sidebarOpen && 'justify-center px-2'
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className={cn(
                  'h-4 w-4',
                  sidebarOpen && 'mr-2'
                )} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-zinc-800 p-2">
        <div className={cn(
          'flex items-center gap-3 rounded-md p-2 hover:bg-zinc-900 transition-colors cursor-pointer',
          !sidebarOpen && 'justify-center p-1'
        )}>
          <Avatar className="h-8 w-8 border border-zinc-800">
            {/* Fallback to user avatar or generic icon */}
            <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </AvatarFallback>
          </Avatar>

          {sidebarOpen && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {user?.email || 'guest@example.com'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
