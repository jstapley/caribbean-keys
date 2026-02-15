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
import { PARISHES, PROPERTY_TYPES, PROPERTY_FEATURES } from "@/lib/constants"
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"

export default function AddPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    property_name: "",
    property_address: "",
    parish: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    square_footage: "",
    price_asking: "",
    price_orig_asking: "",
    property_description: "",
    listing_status: "active",
    is_featured: false,
    video_url: "",
    meta_title: "",
    meta_description: "",
  })
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])

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

      // Prepare data for insertion
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
        is_featured: formData.is_featured,
        video_url: formData.video_url || null,
        features: selectedFeatures,
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

      console.log('Property created:', data)
      
      // Redirect to properties list
      router.push('/admin/properties')
      router.refresh()
    } catch (error: any) {
      console.error('Error creating property:', error)
      setError(error.message || 'Failed to create property')
      setLoading(false)
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
          <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Add New Property</h1>
          <p className="text-gray-600">Fill in the property details below</p>
        </div>

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
              existingImages={images}
              onImagesChange={setImages}
              maxImages={15}
            />
          </div>

          {/* Video */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-caribbean-navy mb-4">Video Tour (Optional)</h2>
            <Label htmlFor="video_url">YouTube or Vimeo URL</Label>
            <Input
              id="video_url"
              type="url"
              value={formData.video_url}
              onChange={(e) => handleInputChange('video_url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
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

              <div>
                <Label htmlFor="meta_title">SEO Title (Optional)</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="Leave blank to use property name"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">SEO Description (Optional)</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="Leave blank to use property description"
                  rows={3}
                />
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
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}