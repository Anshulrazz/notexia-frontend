'use client'

import { useState } from 'react'
import { Settings, Bell, Moon, Sun, Globe, Lock, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: true,
    language: 'en',
    profileVisibility: 'public',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
          Settings
        </h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">Manage your account preferences</p>
      </div>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
            Notifications
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <Label className="text-white text-sm sm:text-base">Email Notifications</Label>
              <p className="text-xs sm:text-sm text-slate-500">Receive updates via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
          <Separator className="bg-[#2a2a3e]" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <Label className="text-white text-sm sm:text-base">Push Notifications</Label>
              <p className="text-xs sm:text-sm text-slate-500">Receive browser push notifications</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
            {settings.darkMode ? <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />}
            Appearance
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Customize how the app looks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <Label className="text-white text-sm sm:text-base">Dark Mode</Label>
              <p className="text-xs sm:text-sm text-slate-500">Use dark theme throughout the app</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
            />
          </div>
          <Separator className="bg-[#2a2a3e]" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <Label className="text-white text-sm sm:text-base">Language</Label>
              <p className="text-xs sm:text-sm text-slate-500">Select your preferred language</p>
            </div>
            <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#12121a] border-[#2a2a3e] text-white">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                <SelectItem value="en" className="text-white hover:bg-[#2a2a3e]">English</SelectItem>
                <SelectItem value="es" className="text-white hover:bg-[#2a2a3e]">Spanish</SelectItem>
                <SelectItem value="fr" className="text-white hover:bg-[#2a2a3e]">French</SelectItem>
                <SelectItem value="de" className="text-white hover:bg-[#2a2a3e]">German</SelectItem>
                <SelectItem value="hi" className="text-white hover:bg-[#2a2a3e]">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
            Privacy
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Control your profile visibility and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <Label className="text-white text-sm sm:text-base">Profile Visibility</Label>
              <p className="text-xs sm:text-sm text-slate-500">Who can see your profile</p>
            </div>
            <Select value={settings.profileVisibility} onValueChange={(value) => setSettings({ ...settings, profileVisibility: value })}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[#12121a] border-[#2a2a3e] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e2e] border-[#2a2a3e]">
                <SelectItem value="public" className="text-white hover:bg-[#2a2a3e]">Public</SelectItem>
                <SelectItem value="friends" className="text-white hover:bg-[#2a2a3e]">Friends Only</SelectItem>
                <SelectItem value="private" className="text-white hover:bg-[#2a2a3e]">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-base sm:text-lg">Change Password</CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label className="text-white text-sm">Current Password</Label>
            <Input type="password" placeholder="Enter current password" className="bg-[#12121a] border-[#2a2a3e] text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">New Password</Label>
            <Input type="password" placeholder="Enter new password" className="bg-[#12121a] border-[#2a2a3e] text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">Confirm New Password</Label>
            <Input type="password" placeholder="Confirm new password" className="bg-[#12121a] border-[#2a2a3e] text-white" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 w-full sm:w-auto"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
