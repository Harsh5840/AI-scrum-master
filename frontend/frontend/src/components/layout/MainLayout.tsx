'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)

  return (
    <ProtectedRoute>
    <div className="flex h-screen bg-background">
      <div
        className={cn(
          'hidden lg:block transition-all duration-300 border-r border-border',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        <Sidebar />
      </div>

      <div
        className={cn('fixed inset-0 z-50 lg:hidden', sidebarOpen ? 'block' : 'hidden')}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/60"
          aria-label="Close navigation"
          onClick={() => dispatch(toggleSidebar())}
        />
        <div className="relative w-64 h-full border-r border-border bg-background">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-4 lg:p-6 brand-wash">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
