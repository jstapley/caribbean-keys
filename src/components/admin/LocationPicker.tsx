// @ts-nocheck
"use client"

import { useEffect, useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'

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
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchError, setSearchError] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current || !inputRef.current) return

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

      // Setup Places Autocomplete on the input
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'ag' }, // Restrict to Antigua & Barbuda
        fields: ['geometry', 'formatted_address', 'name'],
      })

      autocompleteRef.current = autocomplete

      // When user selects a suggestion
      autocomplete.addListener('place_changed', () => {
        setSearchError('')
        const place = autocomplete.getPlace()

        if (!place.geometry?.location) {
          setSearchError('Location not found. Please select from the dropdown.')
          return
        }

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const address = place.formatted_address || place.name || ''

        setSelectedLocation({ lat, lng })
        map.setCenter({ lat, lng })
        map.setZoom(16)
        addMarker({ lat, lng })
        onLocationChange(lat, lng, address)
      })

      // Click map to place marker
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          setSelectedLocation({ lat, lng })
          addMarker({ lat, lng })
          onLocationChange(lat, lng)
          // Reverse geocode to fill in address
          reverseGeocode(lat, lng)
        }
      })
    }

    const checkGoogleMaps = setInterval(() => {
      if (window.google?.maps?.places) {
        clearInterval(checkGoogleMaps)
        initMap()
      }
    }, 100)

    return () => clearInterval(checkGoogleMaps)
  }, [])

  const addMarker = (location: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current) return
    if (markerRef.current) markerRef.current.setMap(null)

    const marker = new google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      draggable: true,
      animation: google.maps.Animation.DROP,
    })

    markerRef.current = marker

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

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/geocode?address=${lat},${lng}`)
      const data = await response.json()
      if (data.formatted_address && inputRef.current) {
        inputRef.current.value = data.formatted_address
      }
    } catch (e) {}
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
    setSelectedLocation(null)
    setSearchError('')
    if (markerRef.current) markerRef.current.setMap(null)
    onLocationChange(null, null)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 17.0608, lng: -61.7964 })
      mapInstanceRef.current.setZoom(11)
    }
  }

  return (
    <div className="space-y-4">
      {/* Autocomplete Search */}
      <div>
        <Label>Search Location or Click on Map</Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">Start typing an address and select from the dropdown</p>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            defaultValue={initialAddress || ''}
            placeholder="Search address in Antigua..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-caribbean-gold focus:border-transparent"
          />
          {selectedLocation && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </div>
        {searchError && (
          <p className="text-sm text-red-600 mt-2">⚠️ {searchError}</p>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-[400px] rounded-lg border-2 border-gray-300" />
        {!selectedLocation && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md text-sm text-gray-600 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-caribbean-gold" />
            Search above or click the map to drop a pin
          </div>
        )}
      </div>

      {/* Coordinates */}
      {selectedLocation && (
        <div className="bg-caribbean-seafoam/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-caribbean-gold" />
            <span className="font-semibold">Selected Location:</span>
            <span className="text-gray-700">
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Drag the marker to fine-tune the location</p>
        </div>
      )}
    </div>
  )
}