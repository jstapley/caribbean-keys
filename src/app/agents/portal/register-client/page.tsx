'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, Upload, X, FileText, ArrowLeft, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export default function RegisterClientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    notes: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name))
      return [...prev, ...accepted.filter((f) => !existing.has(f.name))]
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [], 'image/jpeg': [], 'image/png': [] },
    maxSize: 10 * 1024 * 1024,
  })

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index))

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      setError('Please upload at least one proof file (email screenshot or PDF).')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('client_name', formData.client_name)
      fd.append('client_email', formData.client_email)
      if (formData.client_phone) fd.append('client_phone', formData.client_phone)
      if (formData.notes) fd.append('notes', formData.notes)
      files.forEach((f) => fd.append('files', f))

      const res = await fetch('/api/agents/referrals', { method: 'POST', body: fd })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Something went wrong.')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
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
          <h1 className="text-2xl font-bold text-caribbean-navy mb-2">Client Registered</h1>
          <p className="text-gray-600 mb-6">
            <strong>{formData.client_name}</strong> has been registered with a timestamp and your
            proof files. Ross has been notified.
          </p>
          <Button
            onClick={() => router.push('/agents/portal')}
            className="bg-caribbean-navy hover:bg-caribbean-navy/90 text-white"
          >
            Back to My Referrals
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/agents/portal" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-caribbean-navy">
            <ArrowLeft className="h-4 w-4" /> Back to My Referrals
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-caribbean-navy mb-1">Register a Client</h1>
          <p className="text-sm text-gray-500 mb-6">
            This creates a timestamped record linking you to this buyer. Upload proof of your
            communication with them (email screenshots, PDFs, etc.).
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Client details */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Client Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="client_name">Full Name *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => handleChange('client_name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_email">Email Address *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => handleChange('client_email', e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client_phone">Phone Number</Label>
                  <Input
                    id="client_phone"
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => handleChange('client_phone', e.target.value)}
                    placeholder="+1 268-555-0000"
                  />
                </div>
              </div>
            </div>

            {/* Development */}
            <div className="bg-caribbean-gold/10 border border-caribbean-gold/30 rounded-lg px-4 py-3 text-sm text-caribbean-navy font-medium">
              Development: Sugar Ridge
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Brief context about this client's interest, timeline, budget, etc."
                rows={3}
              />
            </div>

            {/* File upload */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Proof of Communication *
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                Upload email screenshots, PDF conversations, or any document showing you've been
                actively working with this buyer. PDF, JPG, PNG up to 10MB each.
              </p>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  isDragActive
                    ? 'border-caribbean-gold bg-caribbean-gold/5'
                    : 'border-gray-300 hover:border-caribbean-gold hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  {isDragActive ? 'Drop files here…' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 10MB per file</p>
              </div>

              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-caribbean-gold flex-shrink-0" />
                        <span className="truncate text-gray-700">{file.name}</span>
                        <span className="text-gray-400 text-xs flex-shrink-0">
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 ml-2">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-caribbean-navy hover:bg-caribbean-navy/90 text-white font-semibold"
            >
              {submitting ? 'Submitting…' : 'Register Client'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
