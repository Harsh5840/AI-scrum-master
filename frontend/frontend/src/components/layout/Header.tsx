'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { toggleSidebar } from '@/store/slices/uiSlice'
import {
  PersonIcon,
  ExitIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Left side - Mobile menu button and title */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={handleToggleSidebar}
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

      {/* Right side - User menu and logout */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 px-3"
          >
            <PersonIcon className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {user?.name || 'User'}
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <ExitIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}