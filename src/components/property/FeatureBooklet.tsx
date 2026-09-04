// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

interface Spread {
  id: string
  display_order: number
  section_title: string
  hero_image_url: string | null
  supporting_image_urls: string[]
  bullets: string[]
}

interface FeatureBookletProps {
  propertyId: string
}

export function FeatureBooklet({ propertyId }: FeatureBookletProps) {
  const [spreads, setSpreads] = useState<Spread[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("right")

  useEffect(() => {
    async function fetchSpreads() {
      try {
        const { data, error } = await supabase
          .from("property_feature_spreads")
          .select("*")
          .eq("property_id", propertyId)
          .order("display_order", { ascending: true })

        if (!error && data) setSpreads(data)
      } catch (err) {
        console.error("Error fetching feature spreads:", err)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) fetchSpreads()
  }, [propertyId])

  const goNext = () => {
    setDirection("right")
    setIndex((i) => (i + 1) % spreads.length)
  }

  const goPrev = () => {
    setDirection("left")
    setIndex((i) => (i - 1 + spreads.length) % spreads.length)
  }

  // Don't render anything for loading, error, or zero-spread properties -
  // older/unenhanced listings should look completely untouched
  if (loading || spreads.length === 0) return null

  const spread = spreads[index]
  const supporting = spread.supporting_image_urls || []

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-caribbean-gold" />
        <h2 className="text-2xl font-bold text-caribbean-navy">Feature Highlights</h2>
      </div>

      <div className="relative">
        {/* Spread */}
        <div
          key={spread.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300"
        >
          {/* Hero photo + caption panel */}
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <div className="relative aspect-[4/3]">
              {spread.hero_image_url ? (
                <img
                  src={spread.hero_image_url}
                  alt={spread.section_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
            <div className="p-5 bg-caribbean-seafoam/10">
              <p className="text-xs font-bold text-caribbean-gold uppercase tracking-wider mb-1">
                Features You'll Love
              </p>
              <h3 className="text-lg font-bold text-caribbean-navy mb-3">
                {spread.section_title}
              </h3>
              {spread.bullets && spread.bullets.length > 0 && (
                <ul className="space-y-1.5">
                  {spread.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-caribbean-gold mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Supporting photos - flexible grid based on count */}
          {supporting.length > 0 ? (
            <div
              className={`grid gap-3 ${
                supporting.length === 1
                  ? "grid-cols-1"
                  : supporting.length === 3
                  ? "grid-cols-2 grid-rows-2"
                  : "grid-cols-2"
              }`}
            >
              {supporting.map((url, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-xl border border-gray-100 ${
                    supporting.length === 1
                      ? "aspect-[4/3]"
                      : supporting.length === 3 && i === 0
                      ? "row-span-2 aspect-auto h-full"
                      : "aspect-square"
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>

        {/* Navigation */}
        {spreads.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous spread"
              className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white shadow-md rounded-full p-2.5 hover:bg-caribbean-gold hover:text-white transition text-caribbean-navy border border-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next spread"
              className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white shadow-md rounded-full p-2.5 hover:bg-caribbean-gold hover:text-white transition text-caribbean-navy border border-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Dots + counter */}
      {spreads.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {spreads.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDirection(i > index ? "right" : "left")
                setIndex(i)
              }}
              aria-label={`Go to spread ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-caribbean-gold" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}