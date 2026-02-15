"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { EditPropertyClient } from "./EditPropertyClient"

export default function EditPropertyPage() {
  const params = useParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchProperty() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error || !data) {
          setError(true)
        } else {
          setProperty(data)
        }
      } catch (err) {
        console.error('Error fetching property:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

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

  return <EditPropertyClient property={property} />
}