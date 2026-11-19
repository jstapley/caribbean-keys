'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Building2,
  Users,
  Star,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/properties', icon: Building2, label: 'Properties' },
  { href: '/admin/clients', icon: Users, label: 'Clients' },
  { href: '/admin/vip-clients', icon: Star, label: 'VIP Clients' },
]

function AdminSidebar({
  children,
  userEmail,
  onLogout,
}: {
  children: React.ReactNode
  userEmail: string
  onLogout: () => void
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (item: (typeof navItems)[0]) => {
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image
            src="/images/caribbean-keys-logo.png"
            alt="Caribbean Keys"
            width={36}
            height={36}
            className="w-9 h-9 flex-shrink-0"
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-wide">
              CARIBBEAN KEYS
            </p>
            <p className="text-white/40 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-caribbean-gold/20 text-caribbean-gold'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={17} className="flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {userEmail && (
          <div className="px-3 py-2.5">
            <p className="text-white/40 text-xs truncate">{userEmail}</p>
          </div>
        )}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink size={17} className="flex-shrink-0" />
          View Site
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={17} className="flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-caribbean-navy min-h-screen sticky top-0 h-screen">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-caribbean-navy flex items-center justify-between px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <Image
            src="/images/caribbean-keys-logo.png"
            alt="Caribbean Keys"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <p className="text-white font-bold text-sm tracking-wide">CARIBBEAN KEYS</p>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-white p-1">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-caribbean-navy flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <p className="text-white font-bold text-sm tracking-wide">CARIBBEAN KEYS</p>
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavContent />
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14">{children}</main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login')
        return
      }
      if (session?.user?.email) {
        setUserEmail(session.user.email)
      }
    }
    checkAuth()
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Login page gets no sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AdminSidebar userEmail={userEmail} onLogout={handleLogout}>
      {children}
    </AdminSidebar>
  )
}
