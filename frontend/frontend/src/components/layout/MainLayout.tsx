'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)

  return (
    <div className="flex h-screen bg-background">
      <div
        className={cn(
          'hidden lg:block transition-all duration-300 border-r border-border',
          sidebarOpen ? 'w-60' : 'w-16'
        )}
      >
        <Sidebar />
      </div>

      <div className={cn('fixed inset-0 z-50 lg:hidden', sidebarOpen ? 'block' : 'hidden')}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative w-64 h-full border-r border-border bg-background">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-4 lg:p-6 brand-wash">{children}</main>
      </div>
    </div>
  )
}
