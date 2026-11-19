'use client'

import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { LayoutDashboard, UserPlus, LogOut } from 'lucide-react'

type Agent = { id: string; name: string; email: string; referral_code: string; company: string }

export default function AgentPortalShell({
  children,
  agent,
}: {
  children: React.ReactNode
  agent: Agent
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/agents/login')
  }

  const navItems = [
    { href: '/agents/portal', icon: LayoutDashboard, label: 'My Referrals' },
    { href: '/agents/portal/register-client', icon: UserPlus, label: 'Register Client' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-caribbean-navy min-h-screen sticky top-0 h-screen">
        <div className="flex flex-col h-full">
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
                <p className="text-white font-bold text-sm leading-tight tracking-wide">CARIBBEAN KEYS</p>
                <p className="text-white/40 text-xs">Agent Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
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

          <div className="px-3 py-4 border-t border-white/10 space-y-1">
            <div className="px-3 py-2">
              <p className="text-white/70 text-sm font-medium truncate">{agent.name}</p>
              <p className="text-white/40 text-xs truncate">{agent.company}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-caribbean-navy flex items-center justify-between px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <Image src="/images/caribbean-keys-logo.png" alt="Caribbean Keys" width={28} height={28} className="w-7 h-7" />
          <p className="text-white font-bold text-sm tracking-wide">AGENT PORTAL</p>
        </div>
        <button onClick={handleLogout} className="text-white/60 hover:text-white">
          <LogOut size={20} />
        </button>
      </div>

      <main className="flex-1 min-w-0 lg:pt-0 pt-14">{children}</main>
    </div>
  )
}
