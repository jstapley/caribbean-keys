"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { GoogleReviews } from "@/components/GoogleReviews"
import { Search, MapPin, Home, TrendingUp, Bed, Bath, Maximize } from "lucide-react"

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_featured', true)
          .in('listing_status', ['active', 'new'])
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) {
          console.error('Error fetching featured properties:', error)
        } else {
          setFeaturedProperties(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div>
      {/* Video Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/antigua-drone.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Your Trusted Real Estate Partner in Antigua & Barbuda
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-white/90">
                Expert guidance for luxury real estate, beachfront villas, and investment opportunities across Antigua's premier communities
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button size="lg" asChild className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-caribbean-navy backdrop-blur-sm font-semibold">
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
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-caribbean-blue/20 p-4 rounded-full mb-4">
                <Home className="h-8 w-8 text-caribbean-navy" />
              </div>
              <div className="text-3xl font-bold text-caribbean-navy mb-2">150+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-caribbean-blue/20 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-caribbean-navy" />
              </div>
              <div className="text-3xl font-bold text-caribbean-navy mb-2">50+</div>
              <div className="text-gray-600">Properties Sold</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-caribbean-blue/20 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-caribbean-navy" />
              </div>
              <div className="text-3xl font-bold text-caribbean-navy mb-2">6</div>
              <div className="text-gray-600">Parishes Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-caribbean-seafoam">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-caribbean-navy mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties in Antigua
            </p>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => {
                const firstImage = property.images && property.images.length > 0 ? property.images[0] : '/images/placeholder-property.jpg'
                
                return (
                  <div 
                    key={property.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Property Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={firstImage}
                        alt={property.property_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Featured Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-caribbean-gold text-caribbean-navy px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                          Featured
                        </span>
                      </div>
                      {/* Parish Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-caribbean-navy px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.parish}
                        </span>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-caribbean-navy mb-3 line-clamp-2">
                        {property.property_name}
                      </h3>
                      
                      {/* Property Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.bedrooms} beds</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms} baths</span>
                          </div>
                        )}
                        {property.square_footage && (
                          <div className="flex items-center gap-1">
                            <Maximize className="h-4 w-4" />
                            <span>{property.square_footage.toLocaleString()} sq ft</span>
                          </div>
                        )}
                      </div>

                      {/* Price and CTA */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="text-2xl font-bold text-caribbean-navy">
                          {property.price_asking ? formatPrice(property.price_asking) : 'Contact for Price'}
                        </div>
                        <Button variant="outline" size="sm" asChild className="border-caribbean-gold text-caribbean-gold hover:bg-caribbean-gold hover:text-white font-semibold">
                          <Link href={`/properties/${property.slug}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              // Empty state - no featured properties
              <div className="col-span-3 text-center py-12">
                <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Featured Properties Yet</h3>
                <p className="text-gray-500 mb-6">Check back soon or browse all available properties</p>
                <Button asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy">
                  <Link href="/properties">View All Properties</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold uppercase tracking-wide">
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Browse by Parish */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-caribbean-navy mb-4">
              Browse by Parish
            </h2>
            <p className="text-xl text-gray-600">
              Explore properties across all of Antigua
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["St. John's", "St. Peter", "St. Philip", "St. Paul", "St. Mary", "St. George"].map((parish) => (
              <Link
                key={parish}
                href={`/properties/parish/${parish.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`}
                className="group bg-caribbean-seafoam hover:bg-caribbean-seafoam/80 rounded-lg p-6 text-center transition-all shadow-sm hover:shadow-md"
              >
                <MapPin className="h-8 w-8 text-caribbean-navy mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-caribbean-navy text-sm">{parish}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-caribbean-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Contact our expert team today to schedule a viewing or learn more about our available properties
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold uppercase tracking-wide">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-caribbean-navy font-semibold uppercase tracking-wide">
              <Link href="/properties">Browse All Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}