'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ExitIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  BellIcon,
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
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-[#09090B] px-4 lg:px-6">
      {/* Left side - Mobile menu button and title */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white/60 hover:text-white hover:bg-white/5"
          onClick={handleToggleSidebar}
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <p className="text-xs text-white/40">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right side - Search, notifications, user */}
      <div className="flex items-center space-x-2">
        {/* Search */}
        <Button
          variant="ghost"
          className="hidden sm:flex items-center gap-2 h-9 px-3 text-white/40 hover:text-white hover:bg-white/5 rounded-lg border border-white/10"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          <span className="text-sm">Search...</span>
          <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded bg-white/10 px-1.5 font-mono text-[10px] text-white/40">
            ⌘K
          </kbd>
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/40 hover:text-white hover:bg-white/5"
        >
          <BellIcon className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
        </Button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/10 mx-2" />

        {/* User */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-white/10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-white/70 text-xs">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm text-white/70">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Logout"
          className="text-white/40 hover:text-red-400 hover:bg-white/5"
        >
          <ExitIcon className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}