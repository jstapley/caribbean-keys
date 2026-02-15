"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "HOME", href: "/" },
    { name: "PROPERTIES", href: "/properties" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-caribbean-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+17057255824" className="flex items-center gap-2 hover:text-caribbean-gold transition">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">(705) 725-5824</span>
              </a>
              <a href="mailto:ross.caribbeankeys@gmail.com" className="flex items-center gap-2 hover:text-caribbean-gold transition">
                <Mail className="h-4 w-4" />
                <span className="hidden md:inline">ross.caribbeankeys@gmail.com</span>
              </a>
            </div>
            <div className="hidden md:block text-xs uppercase tracking-wider">
              Your Trusted Real Estate Partner in Antigua
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/images/caribbean-keys-logo.png"
              alt="Caribbean Keys Real Estate"
              width={60}
              height={60}
              className="w-12 h-12 sm:w-14 sm:h-14"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-caribbean-navy tracking-wider">
                CARIBBEAN KEYS
              </span>
              <span className="text-xs text-caribbean-navy/70 tracking-wide hidden sm:block">
                REAL ESTATE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-caribbean-navy hover:text-caribbean-gold font-semibold transition tracking-wide text-sm"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy uppercase tracking-wider font-semibold">
              <a 
                href="https://api.leadconnectorhq.com/widget/booking/SvIBBVEDScQOGhfhK5eS"
                target="_blank"
                rel="noopener noreferrer"
              >
                Schedule Viewing
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-caribbean-navy hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-semibold text-caribbean-navy hover:bg-caribbean-blue/10 rounded-md tracking-wide"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="w-full bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy uppercase tracking-wider font-semibold">
              <Link href="/contact">Schedule Viewing</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}