'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'

const sections = [
  { id: 'account', label: 'Account' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
] as const

export default function SettingsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]['id']>('account')
  const [notifications, setNotifications] = useState({
    standupReminders: true,
    blockerAlerts: true,
  })

  return (
    <MainLayout title="Settings">
      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-48 shrink-0 space-y-1" aria-label="Settings sections">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left min-h-10 px-3 rounded-lg text-sm ${
                activeSection === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 space-y-5 min-w-0">
          {activeSection === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-display">Account</CardTitle>
                <CardDescription>Signed-in identity from auth. Profile edits are not persisted yet.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm mt-1">{user?.name || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm mt-1">{user?.email || '—'}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    dispatch(logout())
                    router.push('/')
                  }}
                >
                  Log out
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-display">Notifications</CardTitle>
                <CardDescription>
                  These toggles stay in this browser. Server-side notification prefs are not shipped.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
                  <Label htmlFor="standup-reminders" className="text-sm font-normal">
                    Standup reminders
                  </Label>
                  <Switch
                    id="standup-reminders"
                    checked={notifications.standupReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, standupReminders: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
                  <Label htmlFor="blocker-alerts" className="text-sm font-normal">
                    Blocker alerts
                  </Label>
                  <Switch
                    id="blocker-alerts"
                    checked={notifications.blockerAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, blockerAlerts: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-display">Integrations</CardTitle>
                <CardDescription>Slack OAuth is the only connector with a live status check.</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/settings/integrations" className="text-sm text-primary hover:underline">
                  Open Slack connection
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
