'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function AgentLoginContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/agents/portal`,
          shouldCreateUser: false, // only allow already-approved agents
        },
      })

      if (otpError) throw otpError
      setSent(true)
    } catch (err: any) {
      // Supabase returns a generic error when shouldCreateUser=false and email not found
      setError('No approved agent account found for this email. Please check your email or contact Caribbean Keys.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-caribbean-navy flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-caribbean-gold/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-7 w-7 text-caribbean-gold" />
          </div>
          <h2 className="text-xl font-bold text-caribbean-navy mb-2">Check your email</h2>
          <p className="text-gray-600 text-sm">
            We've sent a login link to <strong>{email}</strong>. Click the link to access your
            agent portal. The link expires in 1 hour.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-caribbean-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/caribbean-keys-logo.png"
            alt="Caribbean Keys"
            width={56}
            height={56}
            className="w-14 h-14 mb-4"
          />
          <h1 className="text-white text-2xl font-bold">Caribbean Keys</h1>
          <p className="text-white/60 text-sm">Agent Portal</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-lg font-bold text-caribbean-navy mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email and we'll send you a secure login link.
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {authError === 'not_approved'
                ? 'Your application is still under review or has not been approved.'
                : 'Authentication failed. Please try again.'}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@yourcompany.com"
                required
                autoComplete="email"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold"
            >
              {loading ? 'Sending…' : 'Send Login Link'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Not registered?{' '}
            <Link href="/agents/register" className="text-caribbean-gold hover:underline font-medium">
              Apply here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AgentLoginPage() {
  return (
    <Suspense>
      <AgentLoginContent />
    </Suspense>
  )
}
