import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function PageLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar onMenuOpen={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children ?? <Outlet />}
          </div>
        </main>

        <footer className="border-t border-stroke/60 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>MuleTrace AI · Financial crime intelligence</span>
            <span>Secure investigation workspace</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
