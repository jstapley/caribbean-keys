// @ts-nocheck
"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Search } from 'lucide-react'

interface LocationPickerProps {
  onLocationChange: (lat: number | null, lng: number | null, address?: string) => void
  initialLat?: number | null
  initialLng?: number | null
  initialAddress?: string
}

export function LocationPicker({ onLocationChange, initialLat, initialLng, initialAddress }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const [searchQuery, setSearchQuery] = useState(initialAddress || '')
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) return

      // Default center to Antigua
      const antiguaCenter = { lat: 17.0608, lng: -61.7964 }
      const center = selectedLocation || antiguaCenter

      const map = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: selectedLocation ? 15 : 11,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      })

      mapInstanceRef.current = map

      // Add initial marker if location exists
      if (selectedLocation) {
        addMarker(selectedLocation)
      }

      // Click to add marker
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          setSelectedLocation({ lat, lng })
          addMarker({ lat, lng })
          onLocationChange(lat, lng)
          
          // Reverse geocode to get address
          reverseGeocode(lat, lng)
        }
      })
    }

    // Wait for Google Maps to load
    const checkGoogleMaps = setInterval(() => {
      if (window.google) {
        clearInterval(checkGoogleMaps)
        initMap()
      }
    }, 100)

    return () => clearInterval(checkGoogleMaps)
  }, [])

  const addMarker = (location: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current) return

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    // Add new marker
    const marker = new google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      draggable: true,
      animation: google.maps.Animation.DROP,
    })

    markerRef.current = marker

    // Update location when marker is dragged
    marker.addListener('dragend', () => {
      const position = marker.getPosition()
      if (position) {
        const lat = position.lat()
        const lng = position.lng()
        setSelectedLocation({ lat, lng })
        onLocationChange(lat, lng)
        reverseGeocode(lat, lng)
      }
    })
  }

  const reverseGeocode = (lat: number, lng: number) => {
    if (!window.google) return

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setSearchQuery(results[0].formatted_address)
      }
    })
  }

  const handleSearch = () => {
    if (!window.google || !mapInstanceRef.current || !searchQuery) return

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: `${searchQuery}, Antigua` }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()

        setSelectedLocation({ lat, lng })
        mapInstanceRef.current?.setCenter(location)
        mapInstanceRef.current?.setZoom(15)
        addMarker({ lat, lng })
        onLocationChange(lat, lng, results[0].formatted_address)
      } else {
        alert('Location not found. Please try a different address.')
      }
    })
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedLocation(null)
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }
    onLocationChange(null, null)
    
    // Reset map to Antigua center
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 17.0608, lng: -61.7964 })
      mapInstanceRef.current.setZoom(11)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div>
        <Label>Search Location or Click on Map</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address in Antigua..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button type="button" onClick={handleSearch} className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy">
            <Search className="h-4 w-4" />
          </Button>
          {selectedLocation && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-[400px] rounded-lg border-2 border-gray-300" />
        {!selectedLocation && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md text-sm text-gray-600 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-caribbean-gold" />
            Click on the map to drop a pin
          </div>
        )}
      </div>

      {/* Selected Coordinates Display */}
      {selectedLocation && (
        <div className="bg-caribbean-seafoam/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-caribbean-gold" />
            <span className="font-semibold">Selected Location:</span>
            <span className="text-gray-700">
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            You can drag the marker to adjust the location
          </p>
        </div>
      )}
    </div>
  )
}