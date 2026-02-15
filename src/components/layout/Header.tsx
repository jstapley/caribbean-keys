"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [locationsOpen, setLocationsOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [projectsTimeoutId, setProjectsTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const navigation = [
    { name: "HOME", href: "/" },
    { name: "PROPERTIES", href: "/properties" },
    { name: "PROJECTS", href: "#", hasDropdown: true },
    { name: "LOCATIONS", href: "#", hasDropdown: true },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ]

  const projects = [
    { name: "The Gardens", slug: "the-gardens", subtitle: "Jolly Harbour • CIP Approved" },
  ]

  const parishes = [
    { name: "St. John", slug: "st-john", subtitle: "Central/North West" },
    { name: "St. George", slug: "st-george", subtitle: "Central/North" },
    { name: "St. Peter", slug: "st-peter", subtitle: "Central/North East" },
    { name: "St. Mary", slug: "st-mary", subtitle: "South West" },
    { name: "St. Philip", slug: "st-philip", subtitle: "East" },
    { name: "St. Paul", slug: "st-paul", subtitle: "South" },
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
              item.hasDropdown ? (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.name === "LOCATIONS") {
                      if (timeoutId) clearTimeout(timeoutId)
                      setLocationsOpen(true)
                    } else if (item.name === "PROJECTS") {
                      if (projectsTimeoutId) clearTimeout(projectsTimeoutId)
                      setProjectsOpen(true)
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.name === "LOCATIONS") {
                      const id = setTimeout(() => setLocationsOpen(false), 200)
                      setTimeoutId(id)
                    } else if (item.name === "PROJECTS") {
                      const id = setTimeout(() => setProjectsOpen(false), 200)
                      setProjectsTimeoutId(id)
                    }
                  }}
                >
                  <button
                    className="flex items-center gap-1 text-caribbean-navy hover:text-caribbean-gold font-semibold transition tracking-wide text-sm"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {/* Projects Dropdown */}
                  {item.name === "PROJECTS" && projectsOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-white shadow-lg rounded-lg py-2 border border-gray-100">
                      {projects.map((project) => (
                        <Link
                          key={project.slug}
                          href={`/projects/${project.slug}`}
                          className="block px-4 py-3 hover:bg-caribbean-seafoam/20 transition"
                        >
                          <div className="font-semibold text-caribbean-navy">{project.name}</div>
                          <div className="text-xs text-gray-600">{project.subtitle}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Locations Dropdown */}
                  {item.name === "LOCATIONS" && locationsOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded-lg py-2 border border-gray-100">
                      {parishes.map((parish) => (
                        <Link
                          key={parish.slug}
                          href={`/locations/${parish.slug}`}
                          className="block px-4 py-3 hover:bg-caribbean-seafoam/20 transition"
                        >
                          <div className="font-semibold text-caribbean-navy">{parish.name}</div>
                          <div className="text-xs text-gray-600">{parish.subtitle}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-caribbean-navy hover:text-caribbean-gold font-semibold transition tracking-wide text-sm"
                >
                  {item.name}
                </Link>
              )
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
              item.hasDropdown ? (
                <div key={item.name}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-base font-semibold text-caribbean-navy hover:bg-caribbean-blue/10 rounded-md tracking-wide"
                    onClick={() => {
                      if (item.name === "LOCATIONS") {
                        setLocationsOpen(!locationsOpen)
                      } else if (item.name === "PROJECTS") {
                        setProjectsOpen(!projectsOpen)
                      }
                    }}
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      (item.name === "LOCATIONS" && locationsOpen) || (item.name === "PROJECTS" && projectsOpen) ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Projects Dropdown */}
                  {item.name === "PROJECTS" && projectsOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      {projects.map((project) => (
                        <Link
                          key={project.slug}
                          href={`/projects/${project.slug}`}
                          className="block px-3 py-2 text-sm text-caribbean-navy hover:bg-caribbean-seafoam/20 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="font-semibold">{project.name}</div>
                          <div className="text-xs text-gray-600">{project.subtitle}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Locations Dropdown */}
                  {item.name === "LOCATIONS" && locationsOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      {parishes.map((parish) => (
                        <Link
                          key={parish.slug}
                          href={`/locations/${parish.slug}`}
                          className="block px-3 py-2 text-sm text-caribbean-navy hover:bg-caribbean-seafoam/20 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="font-semibold">{parish.name}</div>
                          <div className="text-xs text-gray-600">{parish.subtitle}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-semibold text-caribbean-navy hover:bg-caribbean-blue/10 rounded-md tracking-wide"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            <Button asChild className="w-full bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy uppercase tracking-wider font-semibold">
              <a 
                href="https://api.leadconnectorhq.com/widget/booking/SvIBBVEDScQOGhfhK5eS"
                target="_blank"
                rel="noopener noreferrer"
              >
                Schedule Viewing
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}