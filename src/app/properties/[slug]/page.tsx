// @ts-nocheck
"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { PropertyDetailClient } from "./PropertyDetailClient"

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<any>(null)
  const [similarProperties, setSimilarProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchProperty() {
      try {
        // Fetch property by slug
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('slug', params.slug)
          .single()

        if (propertyError || !propertyData) {
          setError(true)
          setLoading(false)
          return
        }

        setProperty(propertyData)

        // Fetch similar properties
        const { data: similarData } = await supabase
          .from('properties')
          .select('*')
          .neq('id', propertyData.id)
          .or(`parish.eq.${propertyData.parish},property_type.eq.${propertyData.property_type}`)
          .in('listing_status', ['active', 'new'])
          .limit(3)

        setSimilarProperties(similarData || [])
      } catch (err) {
        console.error('Error fetching property:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProperty()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caribbean-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return notFound()
  }

  return <PropertyDetailClient property={property} similarProperties={similarProperties} />
}
// test