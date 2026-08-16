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
  ChatBubbleIcon,
  ExclamationTriangleIcon,
  GearIcon,
  HamburgerMenuIcon,
  LightningBoltIcon,
} from '@radix-ui/react-icons'

const sidebarItems = [
  { id: 'inbox', label: 'Inbox', icon: ExclamationTriangleIcon, href: '/blockers' },
  { id: 'capture', label: 'Capture', icon: ChatBubbleIcon, href: '/standups' },
  { id: 'ask', label: 'Ask', icon: LightningBoltIcon, href: '/ai-insights' },
  { id: 'settings', label: 'Settings', icon: GearIcon, href: '/settings' },
]

export function Sidebar({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-card/90',
        sidebarOpen ? 'w-56' : 'w-16',
        className
      )}
    >
      <div className="flex h-14 items-center justify-between px-3">
        <Link
          href="/blockers"
          className={cn(
            'flex items-center gap-2 overflow-hidden',
            !sidebarOpen && 'opacity-0 w-0'
          )}
        >
          <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-display text-xs flex-shrink-0">
            S
          </div>
          <span className="font-display text-sm tracking-tight">Signal</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="h-10 w-10 text-muted-foreground hover:text-foreground"
          aria-label={sidebarOpen ? 'Collapse navigation' : 'Expand navigation'}
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-2 pb-3">
        <OrgSwitcher collapsed={!sidebarOpen} />
      </div>

      <nav className="flex-1 space-y-1 px-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start h-10 px-2.5 text-muted-foreground',
                isActive && 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary',
                !sidebarOpen && 'justify-center px-2'
              )}
              asChild
            >
              <Link href={item.href} aria-label={item.label} aria-current={isActive ? 'page' : undefined}>
                <Icon className={cn('h-4 w-4 flex-shrink-0', sidebarOpen && 'mr-2.5')} />
                {sidebarOpen && <span className="flex-1 text-left text-[13px]">{item.label}</span>}
              </Link>
            </Button>
          )
        })}
      </nav>

      <div className="p-2">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg p-2 hover:bg-secondary min-h-10',
            !sidebarOpen && 'justify-center p-1'
          )}
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={user?.avatarUrl || user?.avatar} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-primary/15 text-primary text-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Guest'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  )
}
