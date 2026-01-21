import { ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 w-full md:ml-64 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
