'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PersonIcon,
  GearIcon,
  BellIcon,
  LockClosedIcon,
  Link2Icon,
  ExitIcon,
  PlusIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  EnvelopeClosedIcon,
  MobileIcon,
} from '@radix-ui/react-icons'

const settingsNav = [
  { id: 'profile', label: 'Profile', icon: <PersonIcon className="h-4 w-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon className="h-4 w-4" /> },
  { id: 'integrations', label: 'Integrations', icon: <Link2Icon className="h-4 w-4" /> },
  { id: 'team', label: 'Team', icon: <PersonIcon className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <LockClosedIcon className="h-4 w-4" /> },
]

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [activeSection, setActiveSection] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    role: 'Engineering Lead',
    timezone: 'UTC-5 (Eastern)',
    bio: 'Building the future of engineering productivity.',
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    standupReminders: true,
    blockerAlerts: true,
    sprintUpdates: true,
    weeklyDigest: false,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <MainLayout title="Settings">
      <div className="flex gap-6 min-h-[calc(100vh-140px)]">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <Card className="bg-gradient-to-br from-white/[0.02] to-transparent border-border sticky top-6">
            <CardContent className="p-3 space-y-1">
              {settingsNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeSection === item.id
                      ? 'bg-gradient-to-r from-primary/20 to-primary/20 text-foreground border border-primary'
                      : 'text-muted-foreground hover:text-foreground/70 hover:bg-secondary'
                    }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.id === 'team' && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary">5</span>
                  )}
                </button>
              ))}

              <div className="pt-4 border-t border-border mt-4">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                  <ExitIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile Header */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/10 border-primary">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                <CardContent className="p-6 relative">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-primary">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary text-foreground text-2xl">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <CameraIcon className="h-6 w-6 text-foreground" />
                      </button>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0a0a0f] flex items-center justify-center">
                        <CheckCircledIcon className="h-3 w-3 text-foreground" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                      <p className="text-muted-foreground">{profile.role}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <EnvelopeClosedIcon className="h-3 w-3" />
                          {profile.email}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MobileIcon className="h-3 w-3" />
                          {profile.timezone}
                        </span>
                      </div>
                    </div>

                    <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-primary to-primary text-foreground">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Personal Information</CardTitle>
                  <CardDescription className="text-muted-foreground">Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground/70">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="bg-card border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground/70">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-card border-border text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-foreground/70">Role</Label>
                      <Input
                        id="role"
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        className="bg-card border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-foreground/70">Timezone</Label>
                      <Input
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="bg-card border-border text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-foreground/70">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="bg-card border-border text-foreground resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <BellIcon className="h-5 w-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                      <div>
                        <p className="text-foreground font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                      <div>
                        <p className="text-foreground font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                      <div>
                        <p className="text-foreground font-medium">Standup Reminders</p>
                        <p className="text-sm text-muted-foreground">Daily reminder to post your standup</p>
                      </div>
                      <Switch
                        checked={notifications.standupReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, standupReminders: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                      <div>
                        <p className="text-foreground font-medium">Blocker Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified about new blockers</p>
                      </div>
                      <Switch
                        checked={notifications.blockerAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, blockerAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                      <div>
                        <p className="text-foreground font-medium">Sprint Updates</p>
                        <p className="text-sm text-muted-foreground">Sprint start, end, and milestone notifications</p>
                      </div>
                      <Switch
                        checked={notifications.sprintUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sprintUpdates: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                      <div>
                        <p className="text-foreground font-medium">Weekly Digest</p>
                        <p className="text-sm text-muted-foreground">Summary of the week's activity</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Integrations Section */}
          {activeSection === 'integrations' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Link2Icon className="h-5 w-5 text-primary" />
                    Integrations
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Connect your favorite tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/settings/integrations" className="block">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#4A154B]/20 to-transparent border border-[#4A154B]/30 hover:border-[#4A154B]/50 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-[#4A154B] flex items-center justify-center">
                            <span className="text-foreground font-bold text-sm">S</span>
                          </div>
                          <div>
                            <p className="text-foreground font-medium">Slack</p>
                            <p className="text-xs text-emerald-400">Connected</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Post standups and receive notifications</p>
                      </div>
                    </Link>

                    <div className="p-4 rounded-xl bg-card border border-border hover:border-border transition-colors opacity-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0052CC] flex items-center justify-center">
                          <span className="text-foreground font-bold text-sm">J</span>
                        </div>
                        <div>
                          <p className="text-foreground font-medium">Jira</p>
                          <p className="text-xs text-muted-foreground">Coming Soon</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Sync sprints and tickets</p>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border hover:border-border transition-colors opacity-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#24292E] flex items-center justify-center">
                          <span className="text-foreground font-bold text-sm">G</span>
                        </div>
                        <div>
                          <p className="text-foreground font-medium">GitHub</p>
                          <p className="text-xs text-muted-foreground">Coming Soon</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Link PRs and commits</p>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border hover:border-border transition-colors opacity-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                          <span className="text-foreground font-bold text-sm">N</span>
                        </div>
                        <div>
                          <p className="text-foreground font-medium">Notion</p>
                          <p className="text-xs text-muted-foreground">Coming Soon</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Sync documentation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Team Section */}
          {activeSection === 'team' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <PersonIcon className="h-5 w-5 text-emerald-400" />
                      Team Management
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage your team members and roles
                    </CardDescription>
                  </div>
                  <Link href="/settings/team">
                    <Button className="bg-gradient-to-r from-primary to-primary text-foreground">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Invite Member
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    <Link href="/settings/team" className="text-primary hover:text-primary">
                      Go to Team Settings →
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <LockClosedIcon className="h-5 w-5 text-amber-400" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your password regularly</p>
                      </div>
                      <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                        Change
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                        Enable
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-medium">Active Sessions</p>
                        <p className="text-sm text-muted-foreground">Manage your logged-in devices</p>
                      </div>
                      <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                        View All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Irreversible actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
