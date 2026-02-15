"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  propertyId?: string
  existingImages?: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ 
  propertyId, 
  existingImages = [], 
  onImagesChange,
  maxImages = 15 
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s)`)
      return
    }

    setUploading(true)
    const newImageUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`)
          continue
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is larger than 5MB`)
          continue
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `properties/${propertyId || 'temp'}/${fileName}`

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(filePath, file)

        if (error) {
          console.error('Upload error:', error)
          alert(`Failed to upload ${file.name}`)
          continue
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath)

        newImageUrls.push(publicUrl)
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      // Update state with new images
      const updatedImages = [...images, ...newImageUrls]
      setImages(updatedImages)
      onImagesChange(updatedImages)

    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveImage = async (imageUrl: string, index: number) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/property-images/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        
        // Delete from Supabase Storage
        const { error } = await supabase.storage
          .from('property-images')
          .remove([filePath])

        if (error) {
          console.error('Delete error:', error)
        }
      }

      // Remove from state
      const updatedImages = images.filter((_, i) => i !== index)
      setImages(updatedImages)
      onImagesChange(updatedImages)

    } catch (error) {
      console.error('Error removing image:', error)
      alert('Failed to remove image')
    }
  }

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    const updatedImages = [...images]
    const [draggedImage] = updatedImages.splice(dragIndex, 1)
    updatedImages.splice(dropIndex, 0, draggedImage)
    
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition ${
            uploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-caribbean-gold bg-caribbean-gold/5 hover:bg-caribbean-gold/10'
          }`}
        >
          {uploading ? (
            <div className="text-center">
              <div className="text-caribbean-navy mb-2">Uploading... {uploadProgress}%</div>
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-caribbean-gold transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-caribbean-gold mb-2" />
              <p className="text-sm font-semibold text-caribbean-navy mb-1">
                Click to upload images
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG up to 5MB ({images.length}/{maxImages} images)
              </p>
            </>
          )}
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-caribbean-navy mb-2">
            Uploaded Images ({images.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-caribbean-gold transition"
              >
                <Image
                  src={imageUrl}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Image Order Badge */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
                  #{index + 1}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveImage(imageUrl, index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Primary Image Badge */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-caribbean-gold text-caribbean-navy text-xs font-bold px-2 py-1 rounded">
                    PRIMARY
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The first image will be used as the primary listing photo
          </p>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  )
}