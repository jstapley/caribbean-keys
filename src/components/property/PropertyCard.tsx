import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Maximize } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface PropertyCardProps {
  property: {
    id: string
    slug: string
    property_name: string
    parish: string
    bedrooms: number | null
    bathrooms: number | null
    square_footage: number | null
    price_asking: number | null
    images: any
    is_featured: boolean
    listing_status: string
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Get first image or use placeholder
  const imageUrl = property.images && Array.isArray(property.images) && property.images.length > 0
    ? property.images[0]
    : "/images/placeholder-property.jpg"

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={imageUrl}
          alt={property.property_name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Status Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {property.is_featured && (
            <span className="bg-caribbean-gold text-caribbean-navy px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Featured
            </span>
          )}
          {property.listing_status === 'new' && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              New
            </span>
          )}
          {property.listing_status === 'under_contract' && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Under Contract
            </span>
          )}
          {property.listing_status === 'sold' && (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Sold
            </span>
          )}
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
        <h3 className="text-xl font-bold text-caribbean-navy mb-3 line-clamp-2 min-h-[3.5rem]">
          {property.property_name}
        </h3>
        
        {/* Property Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
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
            {formatPrice(property.price_asking)}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="border-caribbean-gold text-caribbean-gold hover:bg-caribbean-gold hover:text-white font-semibold"
          >
            <Link href={`/properties/${property.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}