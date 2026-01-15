'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Bell, Search, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth.store'
import { useGlobalStore } from '@/store/global.store'
import { getInitials } from '@/utils/helpers'

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { toggleSidebar } = useGlobalStore()

  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2a3e] bg-[#12121a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#12121a]/80">
      <div className="flex h-16 items-center px-4 md:px-6">
        {isDashboard && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden text-slate-400 hover:text-white hover:bg-[#2a2a3e]"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-lg text-white tracking-tight hidden sm:block">
            Notexia
          </span>
        </Link>

        {isDashboard && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search notes, doubts, forums..."
                className="pl-10 bg-[#1e1e2e] border-[#2a2a3e] text-white placeholder:text-slate-500 focus-visible:ring-violet-500/50"
              />
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-[#2a2a3e]">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 ring-2 ring-violet-500/30">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1e1e2e] border-[#2a2a3e] text-white">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-[#2a2a3e]" />
                  <DropdownMenuItem asChild className="hover:bg-[#2a2a3e] focus:bg-[#2a2a3e] cursor-pointer">
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#2a2a3e] focus:bg-[#2a2a3e] cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2a2a3e]" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 hover:bg-[#2a2a3e] focus:bg-[#2a2a3e] hover:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-[#2a2a3e]">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
