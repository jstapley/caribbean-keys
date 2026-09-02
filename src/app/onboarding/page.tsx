// @ts-nocheck
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  MapPin,
  Calendar,
  Home,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  Lock,
  X,
} from "lucide-react"

const STEPS = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Timeline", icon: Calendar },
  { id: 4, label: "Preferences", icon: Home },
  { id: 5, label: "Documents", icon: FileText },
]

const PREFERENCE_TAGS = [
  "Ocean Front",
  "Ocean View",
  "Mountain View",
  "Garden View",
  "Pool",
  "Gated Community",
  "Beach Access",
  "Furnished",
]

export default function ClientOnboardingPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street_address: "",
    city: "",
    state_province: "",
    country: "",
    nationality: "",
    price_range: "",
    target_purchase_date: "",
    bedrooms: "",
    bathrooms: "",
    oceanfront: false,
    dock: false,
    preference_tags: [] as string[],
    additional_notes: "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      preference_tags: prev.preference_tags.includes(tag)
        ? prev.preference_tags.filter((t) => t !== tag)
        : [...prev.preference_tags, tag],
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const canContinue = () => {
    if (step === 1) return formData.first_name && formData.email
    return true
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError("")

    try {
      // Upload documents first (if any) to the private client-documents bucket
      const uploadedPaths: string[] = []
      for (const file of files) {
        const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from("client-documents")
          .upload(filePath, file)

        if (uploadError) throw uploadError
        uploadedPaths.push(filePath)
      }

      // Combine the "Important to me" tags into additional_notes for now,
      // since preference_tags doesn't have its own column yet
      const combinedNotes = [
        formData.preference_tags.length > 0
          ? `Important to them: ${formData.preference_tags.join(", ")}`
          : "",
        formData.additional_notes,
      ]
        .filter(Boolean)
        .join("\n\n")

      const { error: insertError } = await supabase.from("client_onboarding").insert([
        {
          first_name: formData.first_name,
          last_name: formData.last_name || null,
          email: formData.email,
          phone: formData.phone || null,
          street_address: formData.street_address || null,
          city: formData.city || null,
          state_province: formData.state_province || null,
          country: formData.country || null,
          nationality: formData.nationality || null,
          price_range: formData.price_range || null,
          target_purchase_date: formData.target_purchase_date || null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
          oceanfront: formData.oceanfront,
          dock: formData.dock,
          additional_notes: combinedNotes || null,
          documents: uploadedPaths,
        },
      ])

      if (insertError) throw insertError

      setSubmitted(true)
    } catch (err: any) {
      console.error("Onboarding submission error:", err)
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-caribbean-navy mb-2">
            Application Submitted
          </h1>
          <p className="text-gray-600">
            Thank you, {formData.first_name}. Ross will review your details and
            be in touch shortly to help find your perfect property in Antigua.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-caribbean-navy mb-2">
            Client Onboarding
          </h1>
          <p className="text-gray-500">
            Please complete all sections so we can find your perfect property.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-start justify-between mb-8 max-w-xl mx-auto">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = s.id === step
            const isComplete = s.id < step
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                      isActive || isComplete
                        ? "bg-caribbean-navy text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      isActive ? "text-caribbean-navy" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 mt-[-20px] ${
                      isComplete ? "bg-caribbean-navy" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    placeholder="Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 268-555-0000"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-4">
                Location
              </h2>
              <div>
                <Label htmlFor="street_address">Street Address</Label>
                <Input
                  id="street_address"
                  value={formData.street_address}
                  onChange={(e) => handleChange("street_address", e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state_province">State / Province</Label>
                  <Input
                    id="state_province"
                    value={formData.state_province}
                    onChange={(e) => handleChange("state_province", e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => handleChange("nationality", e.target.value)}
                    placeholder="e.g. Canadian"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-4">
                Purchase Timeline
              </h2>
              <div>
                <Label htmlFor="price_range">Budget / Price Range</Label>
                <Input
                  id="price_range"
                  value={formData.price_range}
                  onChange={(e) => handleChange("price_range", e.target.value)}
                  placeholder="e.g. $500,000 - $1,000,000"
                />
              </div>
              <div>
                <Label htmlFor="target_purchase_date">Target Purchase Date</Label>
                <Input
                  id="target_purchase_date"
                  type="date"
                  value={formData.target_purchase_date}
                  onChange={(e) => handleChange("target_purchase_date", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-4">
                Property Preferences
              </h2>

              <div>
                <Label className="mb-2 block">Important to me</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PREFERENCE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition text-left ${
                        formData.preference_tags.includes(tag)
                          ? "border-caribbean-gold bg-caribbean-gold/10 text-caribbean-navy"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleChange("bedrooms", e.target.value)}
                    placeholder="3"
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
                    onChange={(e) => handleChange("bathrooms", e.target.value)}
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.oceanfront}
                    onChange={(e) => handleChange("oceanfront", e.target.checked)}
                    className="rounded border-gray-300 text-caribbean-gold focus:ring-caribbean-gold"
                  />
                  <span className="text-sm text-gray-700">Oceanfront</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dock}
                    onChange={(e) => handleChange("dock", e.target.checked)}
                    className="rounded border-gray-300 text-caribbean-gold focus:ring-caribbean-gold"
                  />
                  <span className="text-sm text-gray-700">Private Dock</span>
                </label>
              </div>

              <div>
                <Label htmlFor="additional_notes">Additional Notes</Label>
                <Textarea
                  id="additional_notes"
                  value={formData.additional_notes}
                  onChange={(e) => handleChange("additional_notes", e.target.value)}
                  placeholder="Anything else you'd like us to know about what you're looking for..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-caribbean-navy mb-1">
                Upload Documents
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Documents like proof of funds or ID help us move faster once you find
                the right property. Stored securely and never shared publicly.
              </p>

              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-caribbean-gold transition">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium">Click to upload documents</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC up to 10MB</p>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileSelect}
                />
              </label>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm"
                    >
                      <span className="text-gray-700 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-2 bg-caribbean-gold/10 border border-caribbean-gold/30 rounded-lg p-3 text-sm text-caribbean-navy">
                <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Your documents are stored securely and only accessible to
                  Caribbean Keys staff.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canContinue()}
                className="bg-caribbean-navy hover:bg-caribbean-navy/90 text-white"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-caribbean-navy hover:bg-caribbean-navy/90 text-white"
              >
                {submitting ? "Submitting..." : "Submit Application"}
                <Check className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}