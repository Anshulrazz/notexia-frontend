'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Users,
  BookOpen,
  Flag,
  Shield,
  User,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/store/auth.store'
import { useGlobalStore } from '@/store/global.store'
import { cn } from '@/utils/helpers'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/notes', label: 'Notes', icon: FileText },
  { href: '/dashboard/doubts', label: 'Doubts', icon: HelpCircle },
  { href: '/dashboard/forums', label: 'Forums', icon: Users },
  { href: '/dashboard/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

const adminItems = [
  { href: '/dashboard/reports', label: 'Reports', icon: Flag },
  { href: '/dashboard/admin', label: 'Admin Panel', icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { sidebarOpen, setSidebarOpen } = useGlobalStore()

  const isAdmin = user?.role === 'admin'

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-[#2a2a3e] bg-[#12121a] transition-transform duration-300 ease-in-out md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="font-semibold text-white">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-[#2a2a3e]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white border border-violet-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-[#1e1e2e]'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5', isActive && 'text-violet-400')} />
                    {item.label}
                  </Link>
                )
              })}

              {isAdmin && (
                <>
                  <div className="my-4 border-t border-[#2a2a3e]" />
                  <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Admin
                  </p>
                  {adminItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white border border-amber-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-[#1e1e2e]'
                        )}
                      >
                        <item.icon className={cn('h-5 w-5', isActive && 'text-amber-400')} />
                        {item.label}
                      </Link>
                    )
                  })}
                </>
              )}
            </nav>
          </ScrollArea>

          <div className="border-t border-[#2a2a3e] p-4">
            <div className="rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 p-4">
              <p className="text-sm font-medium text-white">Need help?</p>
              <p className="text-xs text-slate-400 mt-1">
                Check our documentation or contact support.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
              >
                View Docs
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
