"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/AdminNav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('properties')
          .select('*')
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
  }, [])

  const handleDelete = async (propertyId: string, propertyName: string) => {
    if (!confirm(`Are you sure you want to delete "${propertyName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error

      // Remove from local state
      setProperties(properties.filter(p => p.id !== propertyId))
      
      alert('Property deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting property:', error)
      alert('Failed to delete property: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Properties</h1>
            <p className="text-gray-600">Manage your property listings</p>
          </div>
          <Button asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold">
            <Link href="/admin/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-caribbean-navy text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Property</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Parish</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Loading properties...
                    </td>
                  </tr>
                ) : properties.length > 0 ? (
                  properties.map((property) => {
                  const imageUrl = property.images && Array.isArray(property.images) && property.images.length > 0
                    ? property.images[0]
                    : '/images/properties/garden1.jpg'

                  return (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={imageUrl}
                              alt={property.property_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-caribbean-navy">
                              {property.property_name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {property.bedrooms && property.bathrooms 
                                ? `${property.bedrooms} bed • ${property.bathrooms} bath`
                                : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {property.parish}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {property.property_type}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-caribbean-navy">
                        {formatPrice(property.price_asking)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.listing_status === 'active' ? 'bg-green-100 text-green-800' :
                          property.listing_status === 'new' ? 'bg-blue-100 text-blue-800' :
                          property.listing_status === 'under_contract' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {property.listing_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-caribbean-navy hover:text-caribbean-gold"
                          >
                            <Link href={`/properties/${property.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-caribbean-navy hover:text-caribbean-gold"
                          >
                            <Link href={`/admin/properties/${property.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(property.id, property.property_name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Plus className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
                        <p className="text-gray-600 mb-4">Get started by adding your first property</p>
                        <Button asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy">
                          <Link href="/admin/properties/new">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Property
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {(!properties || properties.length === 0) && !loading && (
              <></>
            )}
          </div>
        </div>

        {/* Property Count */}
        {!loading && properties && properties.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
          </div>
        )}
      </div>
    </div>
  )
}