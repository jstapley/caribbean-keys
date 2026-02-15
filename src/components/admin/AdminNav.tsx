"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Building2, 
  ImageIcon, 
  MessageSquare, 
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Properties", href: "/admin/properties", icon: Building2 },
    { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <nav className="bg-caribbean-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3">
            <Image 
              src="/images/caribbean-keys-logo.png"
              alt="Caribbean Keys"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <div className="font-bold text-lg">CARIBBEAN KEYS</div>
              <div className="text-xs text-white/70">Admin Panel</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-caribbean-gold text-caribbean-navy font-semibold"
                      : "hover:bg-caribbean-navy/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-transparent border-white/30 text-white hover:bg-white/20 hover:border-white/50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-caribbean-gold text-caribbean-navy font-semibold"
                      : "hover:bg-caribbean-navy/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full bg-transparent border-white/30 text-white hover:bg-white/20 hover:border-white/50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}