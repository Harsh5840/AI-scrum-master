'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar, addNotification } from '@/store/slices/uiSlice'
import {
  BellIcon,
  PersonIcon,
  MoonIcon,
  SunIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const dispatch = useAppDispatch()
  const { notifications, theme } = useAppSelector((state) => state.ui)
  const { user } = useAppSelector((state) => state.auth)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = () => {
    // This would typically open a notification panel
    dispatch(addNotification({
      type: 'info',
      title: 'Notifications',
      message: 'Notification panel would open here',
    }))
  }

  const handleThemeToggle = () => {
    // Theme toggle logic would go here
    console.log('Toggle theme')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Left side - Mobile menu button and title */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden"
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right side - Actions and user menu */}
      <div className="flex items-center space-x-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-4 w-4" />
          ) : (
            <MoonIcon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotificationClick}
          className="relative"
        >
          <BellIcon className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        {/* User menu */}
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-3"
        >
          <PersonIcon className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {user?.name || 'User'}
          </span>
        </Button>
      </div>
    </header>
  )
}