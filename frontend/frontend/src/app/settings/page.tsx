'use client'

import Link from 'next/link'
import { MainLayout } from "@/components/layout/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppSelector } from "@/store/hooks"
import { GearIcon, PersonIcon, BellIcon, LockClosedIcon, CheckIcon, GroupIcon } from "@radix-ui/react-icons"


export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <MainLayout title="Settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <p className="text-white/40 text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* Team Settings */}
        <Link href="/settings/team">
          <Card className="bg-white/[0.02] border-white/5 cursor-pointer hover:border-purple-500/30 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all">
                  <PersonIcon className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Team Settings</CardTitle>
                  <CardDescription className="text-white/40">Manage members and invites</CardDescription>
                </div>
              </div>
              <span className="text-white/30 group-hover:text-white/60 transition-colors">→</span>
            </CardHeader>
          </Card>
        </Link>

        {/* Integrations */}
        <Link href="/settings/integrations">
          <Card className="bg-white/[0.02] border-white/5 cursor-pointer hover:border-cyan-500/30 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A154B]/30 to-[#611f69]/30 flex items-center justify-center group-hover:from-[#4A154B]/50 group-hover:to-[#611f69]/50 transition-all">
                  <svg className="w-5 h-5 text-[#E01E5A]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-white">Integrations</CardTitle>
                  <CardDescription className="text-white/40">Connect Slack, Jira, GitHub</CardDescription>
                </div>
              </div>
              <span className="text-white/30 group-hover:text-white/60 transition-colors">→</span>
            </CardHeader>
          </Card>
        </Link>

        {/* Profile Settings */}


        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PersonIcon className="h-5 w-5 text-purple-400" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-white/40">
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70">Name</Label>
              <Input id="name" defaultValue={user?.name || ''} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email || ''} disabled className="bg-white/5 border-white/10 text-white/50" />
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BellIcon className="h-5 w-5 text-cyan-400" />
              Notifications
            </CardTitle>
            <CardDescription className="text-white/40">
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-white/40">Receive updates via email</p>
              </div>
              <Button variant="outline" className="border-white/10 text-white/70 hover:bg-white/5">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div>
                <p className="font-medium text-white">Slack Integration</p>
                <p className="text-sm text-white/40">Get notifications in Slack</p>
              </div>
              <Button variant="outline" className="border-white/10 text-white/70 hover:bg-white/5">Connect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <LockClosedIcon className="h-5 w-5 text-amber-400" />
              Security
            </CardTitle>
            <CardDescription className="text-white/40">
              Manage your security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-white/70">Current Password</Label>
              <Input id="current-password" type="password" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white/70">New Password</Label>
              <Input id="new-password" type="password" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white/70">Confirm Password</Label>
              <Input id="confirm-password" type="password" className="bg-white/5 border-white/10 text-white" />
            </div>
            <Button variant="outline" className="border-white/10 text-white/70 hover:bg-white/5">Update Password</Button>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <GearIcon className="h-5 w-5 text-emerald-400" />
              Integrations
            </CardTitle>
            <CardDescription className="text-white/40">
              Connect with external tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">J</div>
                <div>
                  <p className="font-medium text-white">Jira Integration</p>
                  <p className="text-sm text-white/40">Sync with Jira projects</p>
                </div>
              </div>
              <Button variant="outline" className="border-white/10 text-white/70 hover:bg-white/5">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <CheckIcon className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Google OAuth</p>
                  <p className="text-sm text-white/40">Connected as {user?.email}</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Connected</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
