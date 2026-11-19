'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, UserPlus } from 'lucide-react'

export default function AgentRegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/agents/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Something went wrong.')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-caribbean-navy mb-2">Application Submitted</h1>
          <p className="text-gray-600">
            Thank you, {formData.name}. Ross will review your application and you'll receive an
            email once approved, along with your unique referral code.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Image
            src="/images/caribbean-keys-logo.png"
            alt="Caribbean Keys"
            width={56}
            height={56}
            className="w-14 h-14 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Agent Registration</h1>
          <p className="text-gray-500 text-sm">
            Register as an approved referring agent to protect your commission on Sugar Ridge sales.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="h-5 w-5 text-caribbean-gold" />
            <h2 className="text-lg font-bold text-caribbean-navy">Your Details</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company / Agency Name *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Jolly Harbour Realty"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="jane@yourcompany.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 268-555-0000"
                />
              </div>
            </div>

            <div className="bg-caribbean-gold/10 border border-caribbean-gold/30 rounded-lg p-4 text-sm text-caribbean-navy mt-4">
              <p className="font-semibold mb-1">Why register?</p>
              <p className="text-gray-600">
                Registration timestamps your relationship with clients. Once approved, you can log
                in and register each buyer you're actively working with, along with proof of
                communication. This protects your commission claim on any Sugar Ridge sale.
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-caribbean-navy hover:bg-caribbean-navy/90 text-white font-semibold"
            >
              {submitting ? 'Submitting…' : 'Submit Application'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already approved?{' '}
            <Link href="/agents/login" className="text-caribbean-gold hover:underline font-medium">
              Log in to your portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
