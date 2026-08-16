'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ExitIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-muted-foreground"
          onClick={() => dispatch(toggleSidebar())}
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-display">{title}</h1>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
          <AvatarFallback className="bg-primary/15 text-primary text-xs">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            dispatch(logout())
            router.push('/')
          }}
        >
          <ExitIcon className="h-4 w-4 mr-1.5" />
          Log out
        </Button>
      </div>
    </header>
  )
}
