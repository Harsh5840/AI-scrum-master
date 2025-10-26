'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/slices/uiSlice'
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
    id: 'workflows',
    label: 'Workflows',
    icon: RocketIcon,
    href: '/workflows',
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
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'flex h-full w-64 flex-col border-r bg-background transition-all duration-300',
        !sidebarOpen && 'w-16',
        className
      )}
    >
      {/* Logo/Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn(
          'flex items-center space-x-2 transition-opacity duration-200',
          !sidebarOpen && 'opacity-0'
        )}>
          <RocketIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">AI Scrum Master</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="h-8 w-8"
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                !sidebarOpen && 'px-2'
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
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
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

      {/* Footer */}
      <div className="border-t p-4">
        <div className={cn(
          'text-xs text-muted-foreground transition-opacity duration-200',
          !sidebarOpen && 'opacity-0'
        )}>
          <p>Version 1.0.0</p>
          <p>AI-Powered Scrum</p>
        </div>
      </div>
    </div>
  )
}