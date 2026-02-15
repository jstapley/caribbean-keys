"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        console.log('Login successful, session created')
        // Wait a moment for cookies to be set
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Force reload to ensure middleware picks up the session
        window.location.href = "/admin/dashboard"
      } else {
        throw new Error('No session created')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || "Invalid login credentials")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-caribbean-blue/20 to-caribbean-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Image 
              src="/images/caribbean-keys-logo.png"
              alt="Caribbean Keys"
              width={60}
              height={60}
              className="w-16 h-16"
            />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-caribbean-navy">CARIBBEAN KEYS</h1>
              <p className="text-sm text-caribbean-navy/70">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-caribbean-navy mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-caribbean-navy font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@caribbeankeysrealestate.com"
                required
                disabled={loading}
                className="mt-1"
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-caribbean-navy font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="mt-1"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Forgot your password? Contact your administrator.</p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          © {new Date().getFullYear()} Caribbean Keys Real Estate
        </p>
      </div>
    </div>
  )
}