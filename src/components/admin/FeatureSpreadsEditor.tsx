// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ChevronUp, ChevronDown, X, Image as ImageIcon, Edit2 } from "lucide-react"

const COMMON_SECTIONS = [
  "Living Room",
  "Dining Room",
  "Kitchen",
  "Primary Bedroom",
  "Primary Ensuite",
  "Second Bedroom",
  "Exterior",
  "Waterfront / Dock",
  "Other",
]

interface Spread {
  id: string
  display_order: number
  section_title: string
  hero_image_url: string | null
  supporting_image_urls: string[]
  bullets: string[]
}

interface FeatureSpreadsEditorProps {
  propertyId: string
  galleryImages: string[]
}

export function FeatureSpreadsEditor({ propertyId, galleryImages }: FeatureSpreadsEditorProps) {
  const [spreads, setSpreads] = useState<Spread[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | "new" | null>(null)
  const [saving, setSaving] = useState(false)

  // Draft state for the spread currently being added/edited
  const [draftTitle, setDraftTitle] = useState("")
  const [draftCustomTitle, setDraftCustomTitle] = useState("")
  const [draftHero, setDraftHero] = useState<string | null>(null)
  const [draftSupporting, setDraftSupporting] = useState<string[]>([])
  const [draftBullets, setDraftBullets] = useState("")

  useEffect(() => {
    fetchSpreads()
  }, [propertyId])

  async function fetchSpreads() {
    if (!propertyId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("property_feature_spreads")
        .select("*")
        .eq("property_id", propertyId)
        .order("display_order", { ascending: true })

      if (error) {
        console.error("Error fetching feature spreads:", error)
      } else {
        setSpreads(data || [])
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetDraft = () => {
    setDraftTitle("")
    setDraftCustomTitle("")
    setDraftHero(null)
    setDraftSupporting([])
    setDraftBullets("")
  }

  const startAdd = () => {
    resetDraft()
    setEditingId("new")
  }

  const startEdit = (spread: Spread) => {
    const isCommon = COMMON_SECTIONS.includes(spread.section_title)
    setDraftTitle(isCommon ? spread.section_title : "Other")
    setDraftCustomTitle(isCommon ? "" : spread.section_title)
    setDraftHero(spread.hero_image_url)
    setDraftSupporting(spread.supporting_image_urls || [])
    setDraftBullets((spread.bullets || []).join("\n"))
    setEditingId(spread.id)
  }

  const cancelEdit = () => {
    setEditingId(null)
    resetDraft()
  }

  const toggleSupporting = (url: string) => {
    setDraftSupporting((prev) =>
      prev.includes(url)
        ? prev.filter((u) => u !== url)
        : prev.length < 4
        ? [...prev, url]
        : prev
    )
  }

  const handleSaveDraft = async () => {
    const finalTitle = draftTitle === "Other" ? draftCustomTitle.trim() : draftTitle
    if (!finalTitle) {
      alert("Please choose or enter a section title")
      return
    }

    setSaving(true)
    try {
      const bulletsArray = draftBullets
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean)

      if (editingId === "new") {
        const { error } = await supabase.from("property_feature_spreads").insert([
          {
            property_id: propertyId,
            display_order: spreads.length,
            section_title: finalTitle,
            hero_image_url: draftHero,
            supporting_image_urls: draftSupporting,
            bullets: bulletsArray,
          },
        ])
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("property_feature_spreads")
          .update({
            section_title: finalTitle,
            hero_image_url: draftHero,
            supporting_image_urls: draftSupporting,
            bullets: bulletsArray,
          })
          .eq("id", editingId)
        if (error) throw error
      }

      await fetchSpreads()
      cancelEdit()
    } catch (err: any) {
      console.error("Error saving spread:", err)
      alert("Failed to save spread: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this spread from the feature booklet?")) return
    try {
      const { error } = await supabase.from("property_feature_spreads").delete().eq("id", id)
      if (error) throw error
      await fetchSpreads()
    } catch (err: any) {
      console.error("Error deleting spread:", err)
      alert("Failed to delete spread: " + err.message)
    }
  }

  const handleReorder = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= spreads.length) return

    const reordered = [...spreads]
    ;[reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]]

    setSpreads(reordered)

    try {
      await Promise.all(
        reordered.map((s, i) =>
          supabase.from("property_feature_spreads").update({ display_order: i }).eq("id", s.id)
        )
      )
    } catch (err) {
      console.error("Error reordering spreads:", err)
      fetchSpreads() // revert to server state on failure
    }
  }

  if (!propertyId) {
    return (
      <p className="text-sm text-gray-500">
        Save the property first before adding feature booklet spreads.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-sm text-gray-500">Loading spreads...</p>
      ) : (
        <>
          {spreads.length === 0 && editingId === null && (
            <p className="text-sm text-gray-500">
              No spreads yet. Add one to start building this property's feature booklet.
            </p>
          )}

          {/* Existing spreads list */}
          {spreads.map((spread, i) => (
            <div
              key={spread.id}
              className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
            >
              <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {spread.hero_image_url ? (
                  <img
                    src={spread.hero_image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-caribbean-navy text-sm truncate">
                  {spread.section_title}
                </p>
                <p className="text-xs text-gray-500">
                  {spread.bullets?.length || 0} bullet{spread.bullets?.length === 1 ? "" : "s"} •{" "}
                  {spread.supporting_image_urls?.length || 0} supporting photo
                  {spread.supporting_image_urls?.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleReorder(i, -1)}
                  disabled={i === 0}
                  className="p-1.5 text-gray-400 hover:text-caribbean-navy disabled:opacity-20"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(i, 1)}
                  disabled={i === spreads.length - 1}
                  className="p-1.5 text-gray-400 hover:text-caribbean-navy disabled:opacity-20"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(spread)}
                  className="p-1.5 text-gray-400 hover:text-caribbean-navy"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(spread.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Spread button */}
          {editingId === null && (
            <Button type="button" variant="outline" onClick={startAdd} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Spread
            </Button>
          )}

          {/* Add/Edit form */}
          {editingId !== null && (
            <div className="border border-caribbean-gold/40 rounded-lg p-4 space-y-4 bg-caribbean-seafoam/10">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-caribbean-navy text-sm">
                  {editingId === "new" ? "New Spread" : "Edit Spread"}
                </h4>
                <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <Label>Section</Label>
                <Select value={draftTitle} onValueChange={setDraftTitle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_SECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {draftTitle === "Other" && (
                  <Input
                    className="mt-2"
                    value={draftCustomTitle}
                    onChange={(e) => setDraftCustomTitle(e.target.value)}
                    placeholder="Custom section name"
                  />
                )}
              </div>

              <div>
                <Label className="mb-2 block">Hero Photo</Label>
                {galleryImages.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    Upload photos in the Property Images section above first.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {galleryImages.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setDraftHero(url)}
                        className={`relative aspect-square rounded overflow-hidden border-2 transition ${
                          draftHero === url
                            ? "border-caribbean-gold"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="mb-2 block">
                  Supporting Photos ({draftSupporting.length}/4)
                </Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {galleryImages.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => toggleSupporting(url)}
                      className={`relative aspect-square rounded overflow-hidden border-2 transition ${
                        draftSupporting.includes(url)
                          ? "border-caribbean-gold"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {draftSupporting.includes(url) && (
                        <div className="absolute top-0.5 right-0.5 bg-caribbean-gold text-caribbean-navy text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {draftSupporting.indexOf(url) + 1}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Features You'll Love (one per line)</Label>
                <Textarea
                  value={draftBullets}
                  onChange={(e) => setDraftBullets(e.target.value)}
                  placeholder={"Light oak hardwood flooring\nFree-flowing layout into the kitchen\nLarge window creating a light-filled ambiance"}
                  rows={5}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={saving}
                  onClick={handleSaveDraft}
                  className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy"
                >
                  {saving ? "Saving..." : "Save Spread"}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}