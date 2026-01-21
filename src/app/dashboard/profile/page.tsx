'use client'

import { useState } from 'react'
import { Camera, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth.store'
import { userService } from '@/services/user.service'
import { getInitials, formatDate, getAvatarUrl } from '@/utils/helpers'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [college, setCollege] = useState(user?.college || '')
  const [branch, setBranch] = useState(user?.branch || '')
  const [year, setYear] = useState(user?.year?.toString() || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const updatedUser = await userService.updateMe({ 
        name, 
        college,
        branch,
        year: year ? parseInt(year) : undefined,
      })
      setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)
    try {
      const response = await userService.updateAvatar(file)
      if (user) {
        setUser({ ...user, avatar: response.avatar })
      }
      toast.success('Avatar updated successfully')
    } catch {
      toast.error('Failed to upload avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">Manage your account information</p>
      </div>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-base sm:text-lg">Avatar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-violet-500/30">
              <AvatarImage src={getAvatarUrl(user?.avatar)} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xl sm:text-2xl">
                {getInitials(user?.name || 'U')}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center cursor-pointer hover:bg-violet-600 transition-colors">
              {isUploadingAvatar ? (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              ) : (
                <Camera className="h-4 w-4 text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-white font-medium">Upload new avatar</p>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG, GIF. Max 5MB.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-base sm:text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label className="text-white text-sm">Full Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#12121a] border-[#2a2a3e] text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Email</Label>
            <Input
              value={user?.email || ''}
              disabled
              className="bg-[#12121a] border-[#2a2a3e] text-slate-400"
            />
            <p className="text-xs text-slate-500">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">College / University</Label>
            <Input
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Enter your college or university"
              className="bg-[#12121a] border-[#2a2a3e] text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-white text-sm">Branch</Label>
              <Input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. CSE, ECE"
                className="bg-[#12121a] border-[#2a2a3e] text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white text-sm">Year</Label>
              <Input
                type="number"
                min="1"
                max="6"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 1, 2, 3, 4"
                className="bg-[#12121a] border-[#2a2a3e] text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1e1e2e] border-[#2a2a3e]">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-base sm:text-lg">Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-[#12121a] border border-[#2a2a3e] gap-2">
            <div>
              <p className="text-sm font-medium text-white">Account Role</p>
              <p className="text-xs text-slate-500">Your current access level</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
              user?.role === 'admin' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                : 'bg-violet-500/10 text-violet-400 border border-violet-500/30'
            }`}>
              {user?.role === 'admin' ? 'Admin' : 'Student'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-[#12121a] border border-[#2a2a3e] gap-2">
            <div>
              <p className="text-sm font-medium text-white">Verification Status</p>
              <p className="text-xs text-slate-500">Account verification</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
              user?.isVerified 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              {user?.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-[#12121a] border border-[#2a2a3e] gap-2">
            <div>
              <p className="text-sm font-medium text-white">Member Since</p>
              <p className="text-xs text-slate-500">Account creation date</p>
            </div>
            <span className="text-sm text-slate-400 self-start sm:self-auto">
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
