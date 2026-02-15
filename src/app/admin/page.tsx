"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/AdminNav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Building2, 
  TrendingUp, 
  MessageSquare, 
  Plus,
  Eye
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboard() {
  const [properties, setProperties] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })

        if (propertiesError) {
          console.error('Error fetching properties:', propertiesError)
        } else {
          setProperties(propertiesData || [])
        }

        // Fetch inquiries
        const { data: inquiriesData, error: inquiriesError } = await supabase
          .from('property_inquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (inquiriesError) {
          console.error('Error fetching inquiries:', inquiriesError)
        } else {
          setInquiries(inquiriesData || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const activeProperties = properties.filter(p => p.listing_status === 'active').length
  const soldProperties = properties.filter(p => p.listing_status === 'sold').length

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your property overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? '...' : properties.length}
                </p>
              </div>
              <div className="bg-caribbean-blue/20 p-3 rounded-full">
                <Building2 className="h-8 w-8 text-caribbean-navy" />
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-green-600 font-semibold">{activeProperties} Active</span>
              <span className="text-gray-500">{soldProperties} Sold</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Inquiries</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? '...' : inquiries.length}
                </p>
              </div>
              <div className="bg-caribbean-gold/20 p-3 rounded-full">
                <MessageSquare className="h-8 w-8 text-caribbean-navy" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">All time inquiries</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Properties Sold</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? '...' : soldProperties}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Successful sales</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Properties */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-caribbean-navy">Recent Properties</h2>
              <Button asChild size="sm" className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy">
                <Link href="/admin/properties/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : properties.length > 0 ? (
                properties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-caribbean-gold transition">
                    <div className="flex-1">
                      <h3 className="font-semibold text-caribbean-navy">{property.property_name}</h3>
                      <p className="text-sm text-gray-600">{property.parish} • {property.property_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-caribbean-navy">
                        {property.price_asking ? formatPrice(property.price_asking) : 'N/A'}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        property.listing_status === 'active' ? 'bg-green-100 text-green-800' :
                        property.listing_status === 'sold' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.listing_status}
                      </span>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="ml-4">
                      <Link href={`/admin/properties/${property.id}/edit`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No properties yet</p>
                  <Button asChild size="sm" className="mt-4 bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy">
                    <Link href="/admin/properties/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Property
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <Button asChild variant="outline" className="w-full mt-4 border-caribbean-gold text-caribbean-gold hover:bg-caribbean-gold hover:text-white">
              <Link href="/admin/properties">View All Properties</Link>
            </Button>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-caribbean-navy">Recent Inquiries</h2>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-caribbean-navy">{inquiry.name}</h3>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {inquiry.message && (
                      <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No inquiries yet</p>
                </div>
              )}
            </div>

            <Button asChild variant="outline" className="w-full mt-4 border-caribbean-gold text-caribbean-gold hover:bg-caribbean-gold hover:text-white">
              <Link href="/admin/inquiries">View All Inquiries</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}