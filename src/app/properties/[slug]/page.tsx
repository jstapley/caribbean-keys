// @ts-nocheck
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PropertyDetailClient } from "./PropertyDetailClient"
import { getPropertySchema, BASE_URL } from "@/lib/seo-config"
import { formatPrice } from "@/lib/utils"

interface PropertyDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { slug } = await params
  const supabase = createClient()
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!property) return {}

  const title = `${property.property_name} | ${property.parish}, Antigua`
  const description = property.property_description?.substring(0, 160) || 
    `${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.parish}, Antigua. Listed at ${formatPrice(property.price_asking)}.`
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
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params
  const supabase = createClient()

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