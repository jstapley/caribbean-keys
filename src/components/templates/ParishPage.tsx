"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { PropertyCard } from "@/components/property/PropertyCard"
import { MapPin, TrendingUp, Palmtree, Home, Bed, Bath, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ParishPageProps {
  parishName: string
  parishSlug: string
  subtitle: string
  mapImage: string
  description: string
  attractions: Array<{ title: string; description: string }>
  investment: Array<{ title: string; description: string }>
}

export default function ParishPage({
  parishName,
  parishSlug,
  subtitle,
  mapImage,
  description,
  attractions,
  investment
}: ParishPageProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('parish', parishName)
          .in('listing_status', ['active', 'new'])
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching properties:', error)
        } else {
          setProperties(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [parishName])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Map */}
      <section className="relative bg-gradient-to-r from-caribbean-navy to-caribbean-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-6 w-6 text-caribbean-gold" />
                <span className="text-caribbean-gold font-semibold">{subtitle}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                {parishName}
              </h1>
              <p className="text-xl text-white/90">
                {description}
              </p>
            </div>

            {/* Right: Parish Map */}
            <div className="relative h-[400px]">
              <Image
                src={mapImage}
                alt={`${parishName} map`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Things to Do */}
      <section className="py-16 bg-caribbean-seafoam/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Palmtree className="h-12 w-12 mx-auto text-caribbean-gold mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-caribbean-navy mb-4">
              Things to Do in {parishName}
            </h2>
            <p className="text-xl text-gray-600">
              Discover the attractions and lifestyle this parish offers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-caribbean-navy mb-3">
                  {attraction.title}
                </h3>
                <p className="text-gray-700">
                  {attraction.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Invest Here */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <TrendingUp className="h-12 w-12 mx-auto text-caribbean-gold mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-caribbean-navy mb-4">
              Why Invest in {parishName}?
            </h2>
            <p className="text-xl text-gray-600">
              Investment opportunities and growth potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {investment.map((point, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-caribbean-gold flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-caribbean-navy" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-caribbean-navy mb-2">
                    {point.title}
                  </h3>
                  <p className="text-gray-700">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Listings */}
      <section className="py-16 bg-caribbean-seafoam/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Home className="h-12 w-12 mx-auto text-caribbean-gold mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-caribbean-navy mb-4">
              Properties in {parishName}
            </h2>
            <p className="text-xl text-gray-600">
              Browse available real estate in this parish
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <div className="text-center">
                <Button size="lg" asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold">
                  <Link href="/properties">View All Properties</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No properties currently available in {parishName}
              </h3>
              <p className="text-gray-500 mb-6">
                Check back soon or explore properties in other parishes
              </p>
              <Button asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy">
                <Link href="/properties">View All Properties</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}