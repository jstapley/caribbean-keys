// @ts-nocheck
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PropertyDetailClient } from "./PropertyDetailClient"
import { formatPrice } from "@/lib/utils"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://caribbean-keys.vercel.app'

function getPropertySchema(property: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.property_name,
    description: property.property_description,
    url: `${BASE_URL}/properties/${property.slug}`,
    image: property.images?.[0] || `${BASE_URL}/images/og-default.jpg`,
    offers: {
      '@type': 'Offer',
      price: property.price_asking,
      priceCurrency: 'USD',
      availability: property.listing_status === 'sold'
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.property_address || property.parish,
      addressLocality: property.parish,
      addressRegion: 'Antigua',
      addressCountry: 'AG',
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
  }
}

export async function generateMetadata({ params }: any) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: property } = await supabase
      .from('properties')
      .select('property_name, parish, property_description, bedrooms, bathrooms, price_asking, images, slug')
      .eq('slug', slug)
      .single()

    if (!property) return {}

    const title = `${property.property_name} | ${property.parish}, Antigua`
    const description = property.property_description?.substring(0, 160) ||
      `${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.parish}, Antigua.`
    const image = property.images?.[0] || `${BASE_URL}/images/og-default.jpg`
    const url = `${BASE_URL}/properties/${property.slug}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        images: [{ url: image, width: 1200, height: 630, alt: property.property_name }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: { canonical: url },
    }
  } catch {
    return {}
  }
}

export default async function PropertyDetailPage({ params }: any) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !property) {
    notFound()
  }

  const { data: similarProperties } = await supabase
    .from('properties')
    .select('*')
    .neq('id', property.id)
    .or(`parish.eq.${property.parish},property_type.eq.${property.property_type}`)
    .in('listing_status', ['active', 'new'])
    .limit(3)

  const propertySchema = getPropertySchema(property)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <PropertyDetailClient property={property} similarProperties={similarProperties || []} />
    </>
  )
}