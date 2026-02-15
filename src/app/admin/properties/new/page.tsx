// @ts-nocheck
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/AdminNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { LocationPicker } from "@/components/admin/LocationPicker"
import { PARISHES, PROPERTY_TYPES, PROPERTY_FEATURES } from "@/lib/constants"
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    property_name: '',
    property_address: '',
    parish: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    square_footage: '',
    price_asking: '',
    property_description: '',
    latitude: null as number | null,
    longitude: null as number | null,
    listing_status: 'active',
    is_featured: false,
    features: [] as string[],
    meta_title: '',
    meta_description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate slug from property name
      const slug = formData.property_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Prepare property data
      const propertyData = {
        property_name: formData.property_name,
        property_address: formData.property_address || null,
        parish: formData.parish,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        square_footage: formData.square_footage ? parseInt(formData.square_footage) : null,
        price_asking: formData.price_asking ? parseFloat(formData.price_asking) : null,
        property_description: formData.property_description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        listing_status: formData.listing_status,
        is_featured: formData.is_featured,
        features: formData.features,
        images: images,
        slug: slug,
        meta_title: formData.meta_title || formData.property_name,
        meta_description: formData.meta_description || formData.property_description?.substring(0, 160),
      }

      // Insert into Supabase
      const { data, error: insertError } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single()

      if (insertError) throw insertError

      // Success! Redirect to properties list
      alert(`✅ Success!\n\n"${data.property_name}" has been created and is now live on the website.\n\nYou'll be redirected to the properties list.`)
      router.push('/admin/properties')
      
    } catch (error: any) {
      console.error('Error creating property:', error)
      
      // Show user-friendly error message
      let errorMessage = error.message
      if (error.message.includes('violates')) {
        errorMessage = 'A required field is missing or invalid. Please check all fields and try again.'
      }
      
      alert(`❌ Error Creating Property\n\n${errorMessage}\n\nIf this problem persists, please contact support.`)
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleLocationChange = (location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
      property_address: location.address || prev.property_address,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/properties"
            className="inline-flex items-center text-caribbean-navy hover:text-caribbean-gold transition mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Properties
          </Link>
          <h1 className="text-3xl font-bold text-caribbean-navy">Add New Property</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-caribbean-navy mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="property_name">Property Name *</Label>
                <Input
                  id="property_name"
                  required
                  value={formData.property_name}
                  onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
                  placeholder="Luxury Beachfront Villa"
                />
              </div>

              <div>
                <Label htmlFor="parish">Parish *</Label>
                <Select 
                  required
                  value={formData.parish}
                  onValueChange={(value) => setFormData({ ...formData, parish: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parish" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARISHES.map((parish) => (
                      <SelectItem key={parish} value={parish}>
                        {parish}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select
                  required
                  value={formData.property_type}
                  onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="listing_status">Listing Status *</Label>
                <Select
                  required
                  value={formData.listing_status}
                  onValueChange={(value) => setFormData({ ...formData, listing_status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="new">New Listing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Featured Property
                </Label>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-caribbean-navy mb-6">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="square_footage">Square Footage</Label>
                <Input
                  id="square_footage"
                  type="number"
                  min="0"
                  value={formData.square_footage}
                  onChange={(e) => setFormData({ ...formData, square_footage: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="price_asking">Asking Price (USD)</Label>
                <Input
                  id="price_asking"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price_asking}
                  onChange={(e) => setFormData({ ...formData, price_asking: e.target.value })}
                  placeholder="500000"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-caribbean-navy mb-6">Description</h2>
            <Textarea
              rows={8}
              value={formData.property_description}
              onChange={(e) => setFormData({ ...formData, property_description: e.target.value })}
              placeholder="Detailed property description..."
            />
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-caribbean-navy mb-6">Location</h2>
            <LocationPicker 
              onLocationChange={handleLocationChange}
              initialLat={formData.latitude}
              initialLng={formData.longitude}
              initialAddress={formData.property_address}
            />
            {formData.property_address && (
              <div className="mt-4">
                <Label>Selected Address</Label>
                <p className="text-sm text-gray-600 mt-1">{formData.property_address}</p>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-caribbean-navy mb-6">Images</h2>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={15}
            />
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-caribbean-navy mb-6">Features & Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PROPERTY_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="cursor-pointer text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-caribbean-navy mb-6">SEO</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Defaults to property name"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Defaults to first 160 characters of description"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/properties')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}