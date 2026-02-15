// @ts-nocheck
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    interest: "",
    message: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
        throw new Error("Please fill in all required fields")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Prepare inquiry data
      const inquiryData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        name: `${formData.first_name.trim()} ${formData.last_name.trim()}`,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        interest: formData.interest || null,
        message: formData.message.trim() || null,
        created_at: new Date().toISOString()
      }

      // 1. Save to Supabase
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('property_inquiries')
        .insert([inquiryData])
        .select()
        .single()

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        throw new Error('Failed to submit inquiry. Please try again.')
      }

      console.log('Saved to Supabase:', supabaseData)

      // 2. Send to GoHighLevel API (if configured)
      try {
        const ghlApiKey = process.env.NEXT_PUBLIC_GHL_API_KEY
        const ghlLocationId = process.env.NEXT_PUBLIC_GHL_LOCATION_ID
        
        if (ghlApiKey && ghlLocationId) {
          // Build tags array - always include "Website Lead" + the interest if selected
          const tags = ['Website Lead']
          if (formData.interest) {
            // Convert interest to short-form tag
            const interestTagMap: Record<string, string> = {
              'Citizenship by Investment': 'CIP',
              'Investment': 'Invest',
              'Buying': 'Buy',
              'Selling': 'Sell',
              'Renting': 'Rent'
            }
            const interestTag = interestTagMap[formData.interest] || formData.interest
            tags.push(interestTag)
          }

          const ghlPayload = {
            firstName: formData.first_name.trim(),
            lastName: formData.last_name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            source: 'Caribbean Keys Website',
            tags: tags,
            customFields: [
              {
                key: 'message',
                value: formData.message.trim() || 'No message provided'
              }
            ]
          }

          const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ghlApiKey}`,
              'Content-Type': 'application/json',
              'Version': '2021-07-28'
            },
            body: JSON.stringify({
              ...ghlPayload,
              locationId: ghlLocationId
            })
          })

          if (ghlResponse.ok) {
            const ghlData = await ghlResponse.json()
            console.log('Contact created in GHL:', ghlData)
          } else {
            const errorText = await ghlResponse.text()
            console.warn('GHL API failed:', errorText)
            console.warn('But inquiry saved to database successfully')
          }
        } else {
          console.log('GHL API credentials not configured')
        }
      } catch (ghlError) {
        // GHL error doesn't fail the submission since we have it in Supabase
        console.warn('GHL API error:', ghlError)
      }

      // Success!
      setSuccess(true)
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        interest: "",
        message: ""
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)

    } catch (err: any) {
      console.error('Form submission error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] bg-gradient-to-r from-caribbean-navy to-caribbean-blue">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-white/90">
              Let's discuss your Antigua real estate goals
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-caribbean-navy mb-6">
                Contact Information
              </h2>
              <p className="text-gray-700 mb-8">
                Ready to explore Antigua real estate opportunities? Reach out today and let's start the conversation about finding your perfect Caribbean property.
              </p>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-caribbean-gold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-caribbean-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-caribbean-navy mb-1">Phone</h3>
                    <a href="tel:+17057255824" className="text-gray-700 hover:text-caribbean-gold transition">
                      (705) 725-5824
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-caribbean-gold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-caribbean-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-caribbean-navy mb-1">Email</h3>
                    <a href="mailto:ross.caribbeankeys@gmail.com" className="text-gray-700 hover:text-caribbean-gold transition">
                      ross.caribbeankeys@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="bg-caribbean-gold w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-caribbean-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-caribbean-navy mb-1">Location</h3>
                    <p className="text-gray-700">
                      St. John's, Antigua and Barbuda
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Proof / Hours */}
              <div className="mt-12 p-6 bg-caribbean-seafoam/20 rounded-lg">
                <h3 className="font-bold text-caribbean-navy mb-3">Response Time</h3>
                <p className="text-gray-700">
                  Ross typically responds within 24 hours. For urgent inquiries, please call directly.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-6">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                {/* Interest */}
                <div>
                  <Label htmlFor="interest">I'm Interested In</Label>
                  <Select
                    value={formData.interest}
                    onValueChange={(value) => handleInputChange('interest', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Buying">Buying</SelectItem>
                      <SelectItem value="Selling">Selling</SelectItem>
                      <SelectItem value="Renting">Renting</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Citizenship by Investment">Citizenship by Investment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us about your real estate goals..."
                    rows={5}
                  />
                </div>

                {/* Success Message - Right above submit button */}
                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Message Sent!</h4>
                      <p className="text-green-700 text-sm">Thank you for reaching out. Ross will be in touch soon.</p>
                    </div>
                  </div>
                )}

                {/* Error Message - Right above submit button */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-caribbean-navy mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
