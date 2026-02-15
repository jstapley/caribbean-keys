"use client"

import { useState, useEffect } from "react"
import { PropertyCard } from "@/components/property/PropertyCard"
import { PropertyFilters, type PropertyFilters as Filters } from "@/components/property/PropertyFilters"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, X } from "lucide-react"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Filters>({
    parishes: [],
    propertyTypes: [],
    bedrooms: [],
    bathrooms: [],
    priceRange: "",
    status: ["active", "new"],
  })

  // Fetch properties from Supabase
  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .in('listing_status', ['active', 'new', 'under_contract'])
          .order('created_at', { ascending: false })

        if (error) throw error

        setProperties(data || [])
        setFilteredProperties(data || [])
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...properties]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.property_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.property_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.property_description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Parish filter
    if (activeFilters.parishes.length > 0) {
      filtered = filtered.filter(property =>
        activeFilters.parishes.includes(property.parish)
      )
    }

    // Property type filter
    if (activeFilters.propertyTypes.length > 0) {
      filtered = filtered.filter(property =>
        activeFilters.propertyTypes.includes(property.property_type)
      )
    }

    // Bedrooms filter
    if (activeFilters.bedrooms.length > 0) {
      const minBedrooms = parseInt(activeFilters.bedrooms[0])
      filtered = filtered.filter(property =>
        property.bedrooms && property.bedrooms >= minBedrooms
      )
    }

    // Bathrooms filter
    if (activeFilters.bathrooms.length > 0) {
      const minBathrooms = parseFloat(activeFilters.bathrooms[0])
      filtered = filtered.filter(property =>
        property.bathrooms && property.bathrooms >= minBathrooms
      )
    }

    // Price range filter
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange.split('-').map(Number)
      filtered = filtered.filter(property =>
        property.price_asking &&
        property.price_asking >= min &&
        property.price_asking <= max
      )
    }

    setFilteredProperties(filtered)
  }, [properties, searchQuery, activeFilters])

  const handleFilterChange = (filters: Filters) => {
    setActiveFilters(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-caribbean-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Browse Properties</h1>
          <p className="text-lg text-white/80">
            Discover your perfect home in Antigua
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-caribbean-gold text-caribbean-gold hover:bg-caribbean-gold hover:text-white"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:block lg:w-80 ${showFilters ? 'block' : 'hidden'}`}>
            <PropertyFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Property Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-caribbean-navy mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    handleFilterChange({
                      parishes: [],
                      propertyTypes: [],
                      bedrooms: [],
                      bathrooms: [],
                      priceRange: "",
                      status: ["active", "new"],
                    })
                  }}
                  className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}