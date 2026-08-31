// @ts-nocheck
import { notFound } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"
import { Bed, Bath, Maximize, MapPin, ArrowRight, Phone, Mail } from "lucide-react"

// Convert social video URLs to embed format
// Returns null for Facebook (not embeddable) - handled separately
function getSocialEmbedUrl(url: string): string | null {
  if (!url) return null

  // Skip Facebook - not reliably embeddable
  if (url.includes('facebook.com') || url.includes('fb.watch')) return null

  // TikTok
  if (url.includes('tiktok.com')) {
    const videoId = url.split('/video/')[1]?.split('?')[0]
    if (videoId) return `https://www.tiktok.com/embed/v2/${videoId}`
  }

  // Instagram Reels
  if (url.includes('instagram.com/reel') || url.includes('instagram.com/p/')) {
    const shortcode = url.split('/reel/')[1]?.split('/')[0]
      || url.split('/p/')[1]?.split('/')[0]
    if (shortcode) return `https://www.instagram.com/p/${shortcode}/embed`
  }

  // YouTube Shorts
  if (url.includes('youtube.com/shorts/') || url.includes('youtu.be/')) {
    const videoId = url.includes('shorts/')
      ? url.split('shorts/')[1]?.split('?')[0]
      : url.split('youtu.be/')[1]?.split('?')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }

  return null
}

function isFacebookUrl(url: string): boolean {
  return url?.includes('facebook.com') || url?.includes('fb.watch')
}

async function getProperty(slug: string) {
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export default async function SocialLandingPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const property = await getProperty(slug)

  if (!property) notFound()

  const embedUrl = getSocialEmbedUrl(property.tiktok_url)
  const firstImage = property.images?.[0] || '/images/placeholder-property.jpg'

  return (
    <div className="min-h-screen bg-caribbean-navy flex flex-col items-center">
      {/* Hide header and footer inherited from root layout */}
      <style>{`
        header, footer, nav { display: none !important; }
        main { padding: 0 !important; }
      `}</style>
      {/* Logo Header */}
      <div className="w-full max-w-md px-4 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Caribbean Keys" className="h-8 w-8 rounded-full" />
          <div>
            <p className="text-white font-bold text-sm leading-none">Caribbean Keys</p>
            <p className="text-gray-400 text-xs">Real Estate</p>
          </div>
        </div>
        {property.is_cip_approved && (
          <span className="bg-caribbean-gold text-caribbean-navy px-3 py-1 rounded-full text-xs font-bold uppercase">
            🛡️ CIP Approved
          </span>
        )}
      </div>

      {/* Portrait Video, Facebook Button, or Image */}
      <div className="w-full max-w-md px-4">
        {embedUrl ? (
          <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '9/16' }}>
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            />
          </div>
        ) : isFacebookUrl(property.tiktok_url) ? (
          // Facebook - show thumbnail + watch button
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '9/16' }}>
            <img
              src={firstImage}
              alt={property.property_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4">
              <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <a
                href={property.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full transition flex items-center gap-2"
              >
                Watch on Facebook
              </a>
            </div>
          </div>
        ) : (
          // Fallback to image
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '9/16' }}>
            <img
              src={firstImage}
              alt={property.property_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
      </div>

      {/* Property Info Card */}
      <div className="w-full max-w-md px-4 mt-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-2xl">
          {/* Parish */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
            <MapPin className="h-4 w-4 text-caribbean-gold" />
            <span>{property.parish}, Antigua</span>
          </div>

          {/* Property Name & Price */}
          <h1 className="text-2xl font-bold text-caribbean-navy mb-1">
            {property.property_name}
          </h1>
          <p className="text-3xl font-bold text-caribbean-gold mb-4">
            {formatPrice(property.price_asking)}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 pb-5 border-b">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-caribbean-gold" />
                <span>{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-caribbean-gold" />
                <span>{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {property.square_footage && (
              <div className="flex items-center gap-1.5">
                <Maximize className="h-4 w-4 text-caribbean-gold" />
                <span>{property.square_footage.toLocaleString()} sq ft</span>
              </div>
            )}
          </div>

          {/* Short description */}
          {property.property_description && (
            <p className="text-gray-600 text-sm mb-5 line-clamp-3">
              {property.property_description}
            </p>
          )}

          {/* CTAs */}
          <div className="space-y-3">
            <Link
              href={`/properties/${property.slug}`}
              className="flex items-center justify-center gap-2 w-full bg-caribbean-navy hover:bg-caribbean-navy/90 text-white font-bold py-3.5 rounded-xl transition active:scale-95"
            >
              View Full Listing
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+17057255824"
                className="flex items-center justify-center gap-2 w-full border-2 border-caribbean-gold text-caribbean-navy font-semibold py-3 rounded-xl hover:bg-caribbean-gold/10 transition active:scale-95 text-sm"
              >
                <Phone className="h-4 w-4 text-caribbean-gold" />
                Call Ross
              </a>
              <a
                href="mailto:ross.caribbeankeys@gmail.com"
                className="flex items-center justify-center gap-2 w-full border-2 border-caribbean-gold text-caribbean-navy font-semibold py-3 rounded-xl hover:bg-caribbean-gold/10 transition active:scale-95 text-sm"
              >
                <Mail className="h-4 w-4 text-caribbean-gold" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-xs pb-6">caribbean-keys.vercel.app</p>
    </div>
  )
}