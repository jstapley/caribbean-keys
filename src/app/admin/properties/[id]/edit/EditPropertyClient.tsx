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
import { FeatureSpreadsEditor } from "@/components/admin/FeatureSpreadsEditor"
import { LocationPicker } from "@/components/admin/LocationPicker"
import { PARISHES, PROPERTY_TYPES, PROPERTY_FEATURES } from "@/lib/constants"
import { ChevronLeft, Save, Archive } from "lucide-react"
import Link from "next/link"

interface EditPropertyClientProps {
  property: any
}

export function EditPropertyClient({ property }: EditPropertyClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  // Parse existing features
  const existingFeatures = property.features 
    ? (Array.isArray(property.features) ? property.features : JSON.parse(property.features))
    : []

  // Parse existing images
  const existingImages = property.images && Array.isArray(property.images) 
    ? property.images 
    : []
  
  // Form state
  const [formData, setFormData] = useState({
    property_name: property.property_name || "",
    property_address: property.property_address || "",
    parish: property.parish || "",
    property_type: property.property_type || "",
    bedrooms: property.bedrooms?.toString() || "",
    bathrooms: property.bathrooms?.toString() || "",
    square_footage: property.square_footage?.toString() || "",
    price_asking: property.price_asking?.toString() || "",
    price_orig_asking: property.price_orig_asking?.toString() || "",
    property_description: property.property_description || "",
    listing_status: property.listing_status || "active",
    price_sold: property.price_sold?.toString() || "",
    sold_date: property.sold_date || "",
    is_featured: property.is_featured || false,
    is_cip_approved: property.is_cip_approved || false,
    video_url: property.video_url || "",
    tiktok_url: property.tiktok_url || "",
    latitude: property.latitude?.toString() || "",
    longitude: property.longitude?.toString() || "",
    meta_title: property.meta_title || "",
    meta_description: property.meta_description || "",
  })
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(existingFeatures)
  const [images, setImages] = useState<string[]>(existingImages)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.property_name || !formData.parish || !formData.property_type) {
        throw new Error("Please fill in all required fields")
      }

      // Generate slug from property name
      const slug = formData.property_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Calculate days on market if this property is being marked sold
      // (measured from the original listing date to the sold date)
      let daysOnMarket = null
      if (formData.listing_status === 'sold' && formData.sold_date) {
        const listedDate = new Date(property.created_at)
        const soldDateObj = new Date(formData.sold_date)
        daysOnMarket = Math.round(
          (soldDateObj.getTime() - listedDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      }

      // Prepare data for update
      const propertyData = {
        property_name: formData.property_name,
        property_address: formData.property_address || null,
        parish: formData.parish,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_footage: formData.square_footage ? parseInt(formData.square_footage) : null,
        price_asking: formData.price_asking ? parseFloat(formData.price_asking) : null,
        price_orig_asking: formData.price_orig_asking ? parseFloat(formData.price_orig_asking) : null,
        property_description: formData.property_description || null,
        listing_status: formData.listing_status,
        price_sold: formData.price_sold ? parseFloat(formData.price_sold) : null,
        sold_date: formData.sold_date || null,
        days_on_market: daysOnMarket,
        is_featured: formData.is_featured,
        is_cip_approved: formData.is_cip_approved,
        video_url: formData.video_url || null,
        tiktok_url: formData.tiktok_url || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        features: selectedFeatures,
        images: images,
        slug: slug,
        updated_at: new Date().toISOString(),
      }

      // Update in Supabase
      const { error: updateError } = (await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', property.id)) as { error: any }

      if (updateError) throw updateError

      // Success! Show inline message then redirect
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/properties')
        router.refresh()
      }, 2000)
    } catch (error: any) {
      console.error('Error updating property:', error)
      
      // Show user-friendly error message
      let errorMessage = error.message
      if (error.message.includes('violates')) {
        errorMessage = 'A required field is missing or invalid. Please check all fields and try again.'
      }
      
      alert(`❌ Error Updating Property\n\n${errorMessage}\n\nIf this problem persists, please contact support.`)
      setError(errorMessage)
      setLoading(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm(`Archive "${property.property_name}"?\n\nThis will remove it from the public website, but keeps the record (and any inquiries linked to it) intact. You can find archived properties in the admin list and restore this one later if needed.`)) {
      return
    }

    setArchiving(true)
    setError("")

    try {
      // Soft delete: mark as archived instead of removing the row.
      // Keeps property_inquiries records intact (avoids FK constraint errors)
      // and preserves history for Ross's records.
      const { error: archiveError } = await supabase
        .from('properties')
        .update({
          is_archived: true,
          archived_at: new Date().toISOString(),
        })
        .eq('id', property.id)

      if (archiveError) throw archiveError

      alert(`✅ Property Archived\n\n"${property.property_name}" has been removed from the public website. It's still visible in the admin list under archived properties.`)
      router.push('/admin/properties')
      router.refresh()
    } catch (error: any) {
      console.error('Error archiving property:', error)
      const errorMessage = error.message || 'Failed to archive property'
      alert(`❌ Error Archiving Property\n\n${errorMessage}\n\nThe property was not archived. Please try again.`)
      setError(errorMessage)
      setArchiving(false)
    }
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
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Properties
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Edit Property</h1>
              <p className="text-gray-600">Update property details</p>
            </div>
            <Button
              onClick={handleArchive}
              disabled={archiving}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <Archive className="h-4 w-4 mr-2" />
              {archiving ? 'Archiving...' : 'Archive Property'}
            </Button>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
            <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">"{formData.property_name}" saved successfully!</p>
              <p className="text-sm text-green-600">Redirecting to properties list...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="property_name" className="required">Property Name</Label>
                <Input
                  id="property_name"
                  value={formData.property_name}
                  onChange={(e) => handleInputChange('property_name', e.target.value)}
                  placeholder="Sunset Villa Paradise"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="property_address">Property Address</Label>
                <Input
                  id="property_address"
                  value={formData.property_address}
                  onChange={(e) => handleInputChange('property_address', e.target.value)}
                  placeholder="123 Beach Road, Jolly Harbour"
                />
              </div>

              <div>
                <Label htmlFor="parish" className="required">Parish</Label>
                <Select
                  value={formData.parish}
                  onValueChange={(value) => handleInputChange('parish', value)}
                  required
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
                <Label htmlFor="property_type" className="required">Property Type</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => handleInputChange('property_type', value)}
                  required
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
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="4"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="3.5"
                />
              </div>

              <div>
                <Label htmlFor="square_footage">Square Footage</Label>
                <Input
                  id="square_footage"
                  type="number"
                  min="0"
                  value={formData.square_footage}
                  onChange={(e) => handleInputChange('square_footage', e.target.value)}
                  placeholder="3200"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_asking">Asking Price (USD)</Label>
                <Input
                  id="price_asking"
                  type="number"
                  min="0"
                  value={formData.price_asking}
                  onChange={(e) => handleInputChange('price_asking', e.target.value)}
                  placeholder="1250000"
                />
              </div>

              <div>
                <Label htmlFor="price_orig_asking">Original Asking Price (USD)</Label>
                <Input
                  id="price_orig_asking"
                  type="number"
                  min="0"
                  value={formData.price_orig_asking}
                  onChange={(e) => handleInputChange('price_orig_asking', e.target.value)}
                  placeholder="1350000"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Description</h2>
            <Textarea
              id="property_description"
              value={formData.property_description}
              onChange={(e) => handleInputChange('property_description', e.target.value)}
              placeholder="Describe the property in detail..."
              rows={6}
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Property Images</h2>
            <ImageUpload
              propertyId={property.id}
              existingImages={images}
              onImagesChange={setImages}
              maxImages={30}
            />
          </div>

          {/* Feature Booklet */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-1">Feature Booklet</h2>
            <p className="text-sm text-gray-500 mb-4">
              Build an animated, room-by-room feature spread for this listing's detail page. Photos are picked from the gallery above.
            </p>
            <FeatureSpreadsEditor propertyId={property.id} galleryImages={images} />
          </div>

          {/* Video */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Video Tours (Optional)</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="video_url">Landscape Video URL (YouTube or Vimeo)</Label>
                <p className="text-xs text-gray-500 mb-2">Used on the main property listing page</p>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => handleInputChange('video_url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label htmlFor="tiktok_url">Social Video URL</Label>
                <p className="text-xs text-gray-500 mb-2">Supports TikTok, Instagram Reels, Facebook Videos/Reels, YouTube Shorts. Used on the mobile social landing page at /p/{formData.property_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'property-name'}</p>
                <Input
                  id="tiktok_url"
                  type="url"
                  value={formData.tiktok_url}
                  onChange={(e) => handleInputChange('tiktok_url', e.target.value)}
                  placeholder="Paste any TikTok, Instagram, Facebook or YouTube Shorts URL..."
                />
              </div>
            </div>
          </div>

          {/* Location (Interactive Map) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Property Location</h2>
            <p className="text-sm text-gray-600 mb-4">
              Search for an address or click on the map to mark the property location. You can also drag the marker to adjust.
            </p>
            <LocationPicker
              onLocationChange={(lat, lng, address) => {
                setFormData(prev => ({
                  ...prev,
                  latitude: lat?.toString() || "",
                  longitude: lng?.toString() || "",
                  property_address: address || prev.property_address
                }))
              }}
              initialLat={formData.latitude ? parseFloat(formData.latitude) : null}
              initialLng={formData.longitude ? parseFloat(formData.longitude) : null}
              initialAddress={formData.property_address}
            />
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Features & Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROPERTY_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                    className="border-caribbean-navy data-[state=checked]:bg-caribbean-gold data-[state=checked]:border-caribbean-gold"
                  />
                  <label
                    htmlFor={`feature-${feature}`}
                    className="ml-2 text-sm cursor-pointer text-gray-700"
                  >
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Status & SEO */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Status & Settings</h2>
            <div className="space-y-4">

              {/* Sharing Links */}
              <div className="bg-caribbean-seafoam/20 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-bold text-caribbean-navy">📤 Sharing Links</h3>
                
                {(() => {
                  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://caribbean-keys.vercel.app'
                  return (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Property Listing URL</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-white px-3 py-2 rounded border border-gray-200 text-gray-700 truncate">
                            {baseUrl}/properties/{property.slug}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`${baseUrl}/properties/${property.slug}`)
                              alert('Copied!')
                            }}
                            className="text-xs bg-caribbean-navy text-white px-3 py-2 rounded hover:bg-caribbean-navy/90 transition whitespace-nowrap"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">📱 TikTok / Social Landing Page</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-white px-3 py-2 rounded border border-gray-200 text-gray-700 truncate">
                            {baseUrl}/p/{property.slug}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`${baseUrl}/p/${property.slug}`)
                              alert('Copied!')
                            }}
                            className="text-xs bg-caribbean-gold text-caribbean-navy px-3 py-2 rounded hover:bg-caribbean-gold/90 transition whitespace-nowrap font-semibold"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
              <div>
                <Label htmlFor="listing_status">Listing Status</Label>
                <Select
                  value={formData.listing_status}
                  onValueChange={(value) => handleInputChange('listing_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Listing</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under_contract">Under Contract</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.listing_status === 'sold' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-caribbean-seafoam/20 rounded-lg">
                  <div>
                    <Label htmlFor="price_sold">Sale Price (USD)</Label>
                    <Input
                      id="price_sold"
                      type="number"
                      min="0"
                      value={formData.price_sold}
                      onChange={(e) => handleInputChange('price_sold', e.target.value)}
                      placeholder="1150000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sold_date">Sold Date</Label>
                    <Input
                      id="sold_date"
                      type="date"
                      value={formData.sold_date}
                      onChange={(e) => handleInputChange('sold_date', e.target.value)}
                    />
                    {formData.sold_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(
                          (new Date(formData.sold_date).getTime() - new Date(property.created_at).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days on market
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                  className="border-caribbean-navy data-[state=checked]:bg-caribbean-gold data-[state=checked]:border-caribbean-gold"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm font-semibold cursor-pointer">
                  Mark as Featured Property
                </label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="is_cip_approved"
                  checked={formData.is_cip_approved}
                  onCheckedChange={(checked) => handleInputChange('is_cip_approved', checked)}
                  className="border-caribbean-navy data-[state=checked]:bg-caribbean-gold data-[state=checked]:border-caribbean-gold"
                />
                <label htmlFor="is_cip_approved" className="ml-2 text-sm font-semibold cursor-pointer">
                  CIP Approved
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
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
              disabled={loading}
              className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}