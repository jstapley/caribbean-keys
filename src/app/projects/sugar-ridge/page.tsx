// @ts-nocheck
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Square, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Sugar Ridge | Luxury Estate Properties",
  description:
    "Explore luxury estate properties at Sugar Ridge, Antigua. Breathtaking hillside views, private pools, and world-class finishes in St. Mary parish.",
}

export const revalidate = 60

async function getSugarRidgeProperties() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("property_tag", "Sugar Ridge")
    .eq("is_archived", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching Sugar Ridge properties:", error)
    return []
  }
  return data || []
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    new: "bg-blue-100 text-blue-800",
    under_contract: "bg-amber-100 text-amber-800",
    sold: "bg-gray-100 text-gray-700",
  }
  const labels: Record<string, string> = {
    active: "Available",
    new: "New Listing",
    under_contract: "Under Contract",
    sold: "Sold",
  }
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labels[status] || status}
    </span>
  )
}

export default async function SugarRidgePage() {
  const properties = await getSugarRidgeProperties()

  const available = properties.filter((p) => p.listing_status !== "sold")
  const sold = properties.filter((p) => p.listing_status === "sold")

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[520px] flex items-end">
        <div className="absolute inset-0 bg-caribbean-navy/70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/sugar-ridge-hero.jpg')" }}
        />
        {/* Fallback gradient if no image */}
        <div className="absolute inset-0 bg-gradient-to-b from-caribbean-navy/40 via-caribbean-navy/60 to-caribbean-navy/90" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <div className="inline-flex items-center gap-2 bg-caribbean-gold/20 border border-caribbean-gold/40 text-caribbean-gold text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <MapPin className="h-3.5 w-3.5" />
            St. Mary, Antigua
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Sugar Ridge</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Elevated living on Antigua's west coast. Breathtaking hillside estates with panoramic
            ocean views, private pools, and refined Caribbean architecture.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-caribbean-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
            <div className="px-4">
              <p className="text-2xl font-bold text-caribbean-gold">{properties.length}</p>
              <p className="text-xs text-white/60 uppercase tracking-wide mt-0.5">Total Properties</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-caribbean-gold">{available.length}</p>
              <p className="text-xs text-white/60 uppercase tracking-wide mt-0.5">Available</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-caribbean-gold">{sold.length}</p>
              <p className="text-xs text-white/60 uppercase tracking-wide mt-0.5">Sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-6">
              Sugar Ridge properties are coming soon. Contact us to register your interest.
            </p>
            <Button asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-caribbean-navy mb-8">
              {available.length > 0 ? "Available Properties" : "Properties"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {properties.map((property) => {
                const coverImage =
                  Array.isArray(property.images) && property.images.length > 0
                    ? property.images[0]
                    : "/images/properties/garden1.jpg"

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={coverImage}
                        alt={property.property_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <StatusBadge status={property.listing_status} />
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-caribbean-navy text-lg mb-1 group-hover:text-caribbean-gold transition-colors">
                        {property.property_name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin className="h-3.5 w-3.5" />
                        {property.parish}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {property.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4 text-caribbean-gold" />
                            {property.bedrooms} bed
                          </span>
                        )}
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4 text-caribbean-gold" />
                            {property.bathrooms} bath
                          </span>
                        )}
                        {property.square_footage && (
                          <span className="flex items-center gap-1">
                            <Square className="h-4 w-4 text-caribbean-gold" />
                            {property.square_footage.toLocaleString()} sqft
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-caribbean-navy">
                          {property.listing_status === "sold" && property.price_sold
                            ? formatPrice(property.price_sold)
                            : property.price_asking
                            ? formatPrice(property.price_asking)
                            : "Price on request"}
                        </p>
                        <span className="text-caribbean-gold group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="bg-caribbean-navy rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Interested in Sugar Ridge?</h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Contact Ross Harris for private viewings, pricing details, and investment opportunities
            at Sugar Ridge.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              asChild
              className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold px-8"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white"
            >
              <Link href="/properties">Browse All Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
