// @ts-nocheck

"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PropertyCard } from "@/components/property/PropertyCard"
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Calendar,
  Phone,
  Mail,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { PropertyMap } from "@/components/property/PropertyMap"

// Convert YouTube/Vimeo URLs to embed format
function getVideoEmbedUrl(url: string): string {
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be') 
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
    return `https://player.vimeo.com/video/${videoId}`
  }
  
  return url
}

interface PropertyDetailClientProps {
  property: any
  similarProperties: any[]
}

export function PropertyDetailClient({ property, similarProperties }: PropertyDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  
  // Inquiry form state
  const [inquiryLoading, setInquiryLoading] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(false)
  const [inquiryError, setInquiryError] = useState("")
  const [inquiryForm, setInquiryForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: ""
  })

  // Parse features
  const features = property.features ? 
    (Array.isArray(property.features) ? property.features : JSON.parse(property.features)) 
    : []

  // Get images or use placeholders
  const images = property.images && Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : ['/images/properties/garden1.jpg', '/images/properties/garden2.jpg', '/images/properties/garden3.jpg']

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInquiryLoading(true)
    setInquiryError("")
    setInquirySuccess(false)

    try {
      // Validate required fields
      if (!inquiryForm.first_name || !inquiryForm.last_name || !inquiryForm.email || !inquiryForm.phone) {
        throw new Error("Please fill in all required fields")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(inquiryForm.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Pre-fill message with property info if message is empty
      const propertyMessage = inquiryForm.message || `I'm interested in ${property.property_name} (${property.parish}) listed at ${formatPrice(property.price_asking)}.`

      // Prepare inquiry data
      const inquiryData = {
        first_name: inquiryForm.first_name.trim(),
        last_name: inquiryForm.last_name.trim(),
        name: `${inquiryForm.first_name.trim()} ${inquiryForm.last_name.trim()}`,
        email: inquiryForm.email.trim().toLowerCase(),
        phone: inquiryForm.phone.trim(),
        interest: 'Property Inquiry',
        message: propertyMessage,
        property_id: property.id,
        property_name: property.property_name,
        created_at: new Date().toISOString()
      }

      // 1. Save to Supabase
      const { error: supabaseError } = await supabase
        .from('property_inquiries')
        .insert([inquiryData])

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        throw new Error('Failed to submit inquiry. Please try again.')
      }

      // 2. Send to GoHighLevel API
      try {
        const ghlApiKey = process.env.NEXT_PUBLIC_GHL_API_KEY
        const ghlLocationId = process.env.NEXT_PUBLIC_GHL_LOCATION_ID
        
        if (ghlApiKey && ghlLocationId) {
          const tags = ['Website Lead', 'Property Inquiry', property.parish]

          const ghlPayload = {
            firstName: inquiryForm.first_name.trim(),
            lastName: inquiryForm.last_name.trim(),
            email: inquiryForm.email.trim().toLowerCase(),
            phone: inquiryForm.phone.trim(),
            source: `Caribbean Keys - ${property.property_name}`,
            tags: tags,
            customFields: [
              {
                key: 'property_interest',
                value: property.property_name
              },
              {
                key: 'message',
                value: propertyMessage
              }
            ]
          }

          await fetch(`https://services.leadconnectorhq.com/contacts/`, {
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
        }
      } catch (ghlError) {
        console.warn('GHL API error:', ghlError)
      }

      // Success!
      setInquirySuccess(true)
      setInquiryForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: ""
      })

      // Reset success message after 5 seconds
      setTimeout(() => setInquirySuccess(false), 5000)

    } catch (err: any) {
      console.error('Inquiry submission error:', err)
      setInquiryError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setInquiryLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/properties" 
            className="inline-flex items-center text-caribbean-navy hover:text-caribbean-gold transition"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Properties
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Status & Parish */}
              <div className="flex items-center gap-3 mb-4">
                {property.is_featured && (
                  <span className="bg-caribbean-gold text-caribbean-navy px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Featured
                  </span>
                )}
                {property.listing_status === 'new' && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    New Listing
                  </span>
                )}
                <span className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.parish}
                </span>
              </div>

              {/* Title & Address */}
              <h1 className="text-3xl sm:text-4xl font-bold text-caribbean-navy mb-2">
                {property.property_name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">{property.property_address}</p>

              {/* Price */}
              <div className="text-4xl font-bold text-caribbean-navy mb-6">
                {formatPrice(property.price_asking)}
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-caribbean-gold" />
                    <div>
                      <div className="font-semibold text-caribbean-navy">{property.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-caribbean-gold" />
                    <div>
                      <div className="font-semibold text-caribbean-navy">{property.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  </div>
                )}
                {property.square_footage && (
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-caribbean-gold" />
                    <div>
                      <div className="font-semibold text-caribbean-navy">
                        {property.square_footage.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-caribbean-gold" />
                  <div>
                    <div className="font-semibold text-caribbean-navy">{property.property_type}</div>
                    <div className="text-sm text-gray-600">Type</div>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-caribbean-gold text-caribbean-gold hover:bg-caribbean-gold hover:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Property
                </Button>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-4">Property Photos</h2>
              
              {/* Main Carousel */}
              <div className="relative">
                <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${property.property_name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => setShowLightbox(true)}
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                      >
                        <ChevronLeft className="h-6 w-6 text-caribbean-navy" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                      >
                        <ChevronRight className="h-6 w-6 text-caribbean-navy" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition ${
                        currentImageIndex === index 
                          ? 'border-caribbean-gold' 
                          : 'border-transparent hover:border-caribbean-gold/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-4">Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{property.property_description}</p>
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-caribbean-navy mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-caribbean-gold rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Tour */}
            {property.video_url && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-caribbean-navy mb-4">Video Tour</h2>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={getVideoEmbedUrl(property.video_url)}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-4">Location</h2>
              <div className="mb-4">
                <p className="text-gray-700 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-caribbean-gold" />
                  {property.property_address || property.parish}
                </p>
              </div>
              <PropertyMap 
                address={property.property_address || property.parish}
                propertyName={property.property_name}
                latitude={property.latitude}
                longitude={property.longitude}
              />
              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.property_address || property.property_name + ', ' + property.parish + ', Antigua')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-caribbean-gold hover:text-caribbean-gold/80 font-semibold"
                >
                  <MapPin className="h-4 w-4" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-caribbean-navy mb-4">
                Interested in this property?
              </h3>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="first_name" className="text-caribbean-navy">First Name *</Label>
                    <Input
                      id="first_name"
                      type="text"
                      value={inquiryForm.first_name}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="text-caribbean-navy">Last Name *</Label>
                    <Input
                      id="last_name"
                      type="text"
                      value={inquiryForm.last_name}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-caribbean-navy">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-caribbean-navy">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (268) 123-4567"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-caribbean-navy">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={`I'm interested in ${property.property_name}...`}
                  />
                </div>

                {/* Success Message */}
                {inquirySuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 text-sm">Inquiry Sent!</h4>
                      <p className="text-green-700 text-xs">Ross will contact you soon.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {inquiryError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{inquiryError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold"
                  disabled={inquiryLoading}
                >
                  {inquiryLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-caribbean-navy mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t space-y-3">
                <Button 
                  className="w-full bg-caribbean-navy hover:bg-caribbean-navy/90 text-white font-semibold"
                  asChild
                >
                  <a 
                    href="https://api.leadconnectorhq.com/widget/booking/SvIBBVEDScQOGhfhK5eS"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Viewing
                  </a>
                </Button>

                <a
                  href="tel:+17057255824"
                  className="flex items-center justify-center w-full px-4 py-2 border-2 border-caribbean-gold text-caribbean-gold hover:bg-caribbean-gold hover:text-white rounded-md transition font-semibold"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties && similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-caribbean-navy mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-caribbean-gold transition"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>

          <div className="relative max-w-6xl max-h-[90vh] w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={`${property.property_name} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full transition"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}