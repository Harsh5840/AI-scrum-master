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
        'flex h-full flex-col border-r bg-[#09090B] border-white/5 transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-16',
        className
      )}
    >
      {/* Logo/Header */}
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-3">
        <Link
          href="/"
          className={cn(
            'flex items-center space-x-2 transition-opacity duration-200 overflow-hidden',
            !sidebarOpen && 'opacity-0 w-0'
          )}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            AI
          </div>
          <span className="font-semibold text-sm tracking-tight whitespace-nowrap text-white">
            Scrum Master
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/5"
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Organization Switcher */}
      <div className="border-b border-white/5 px-2 py-2">
        <OrgSwitcher collapsed={!sidebarOpen} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">

        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isAI = item.id === 'ai-insights'

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start h-9 px-2.5 text-white/50 hover:text-white hover:bg-white/5 transition-all',
                isActive && 'bg-white/10 text-white font-medium',
                isAI && !isActive && 'text-purple-400/70 hover:text-purple-400',
                !sidebarOpen && 'justify-center px-2'
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className={cn(
                  'h-4 w-4 flex-shrink-0',
                  sidebarOpen && 'mr-2',
                  isAI && 'text-purple-400'
                )} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-red-500/20 text-red-400 px-1.5 py-0.5 text-[10px]">
                        {item.badge}
                      </span>
                    )}
                    {isAI && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                        NEW
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
      <div className="border-t border-white/5 p-2">
        <div className={cn(
          'flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors cursor-pointer group',
          !sidebarOpen && 'justify-center p-1'
        )}>
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-white/70 text-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </AvatarFallback>
          </Avatar>

          {sidebarOpen && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-white/40 truncate">
                {user?.email || 'guest@example.com'}
              </p>
            </div>
          )}

          {sidebarOpen && (
            <ChevronRightIcon className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors" />
          )}
        </div>
      </div>
    </div>
  )
}
