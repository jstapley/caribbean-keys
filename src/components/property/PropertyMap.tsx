// @ts-nocheck
"use client"

import { useEffect, useRef } from 'react'

interface PropertyMapProps {
  address: string
  propertyName: string
  latitude?: number
  longitude?: number
}

export function PropertyMap({ address, propertyName, latitude, longitude }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    let attempts = 0
    const MAX_ATTEMPTS = 50 // ~5 seconds at 100ms intervals

    const tryInit = () => {
      if (window.google && window.google.maps) {
        initMap()
        return
      }

      attempts++
      if (attempts < MAX_ATTEMPTS) {
        timeoutId = setTimeout(tryInit, 100)
      } else {
        console.error('Google Maps JavaScript API failed to load after waiting')
      }
    }

    const initMap = async () => {
      if (!mapRef.current) return

      // If we have lat/lng coordinates, use them
      if (latitude && longitude) {
        const position = { lat: latitude, lng: longitude }
        
        const map = new google.maps.Map(mapRef.current, {
          center: position,
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        })

        // Add marker
        new google.maps.Marker({
          position: position,
          map: map,
          title: propertyName,
        })

        mapInstanceRef.current = map
      } else {
        // Otherwise, geocode the address
        const geocoder = new google.maps.Geocoder()
        
        geocoder.geocode({ address: `${address}, Antigua` }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const position = results[0].geometry.location

            const map = new google.maps.Map(mapRef.current!, {
              center: position,
              zoom: 15,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
            })

            // Add marker
            new google.maps.Marker({
              position: position,
              map: map,
              title: propertyName,
            })

            mapInstanceRef.current = map
          } else {
            console.error('Geocoding failed:', status)
            // Fallback to Antigua center
            const antiguaCenter = { lat: 17.0608, lng: -61.7964 }
            
            const map = new google.maps.Map(mapRef.current!, {
              center: antiguaCenter,
              zoom: 11,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
            })

            mapInstanceRef.current = map
          }
        })
      }
    }

    tryInit()

    return () => clearTimeout(timeoutId)
  }, [address, propertyName, latitude, longitude])

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md" ref={mapRef} />
  )
}