// @ts-nocheck
"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, Upload, Sparkles, RefreshCw, Download, Lock, ChevronDown } from "lucide-react"

const PIN = "0268" // Change this to whatever Ross wants

const STYLES = [
  { id: "Modern Luxury", label: "Modern Luxury", emoji: "✨" },
  { id: "Tropical Caribbean", label: "Tropical Caribbean", emoji: "🌴" },
  { id: "Scandinavian Minimalist", label: "Scandinavian", emoji: "🪵" },
  { id: "Mediterranean", label: "Mediterranean", emoji: "🏛️" },
  { id: "Contemporary Coastal", label: "Coastal", emoji: "🌊" },
  { id: "Industrial Chic", label: "Industrial", emoji: "⚙️" },
]

const ROOM_TYPES = [
  { id: "kitchen", label: "Kitchen", emoji: "🍳" },
  { id: "living room", label: "Living Room", emoji: "🛋️" },
  { id: "bedroom", label: "Bedroom", emoji: "🛏️" },
  { id: "bathroom", label: "Bathroom", emoji: "🚿" },
  { id: "outdoor space / garden", label: "Outdoor / Garden", emoji: "🌿" },
  { id: "dining room", label: "Dining Room", emoji: "🍽️" },
]

export default function VisualizerPage() {
  const [pin, setPin] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [pinError, setPinError] = useState(false)

  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id)
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0].id)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [stage, setStage] = useState("Preparing your image...")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Persist unlocked state in sessionStorage so camera capture doesn't reset it
  useEffect(() => {
    const saved = sessionStorage.getItem("visualizer_unlocked")
    if (saved === "true") setUnlocked(true)

    // Restore image if it was saved before camera remount
    const savedImage = sessionStorage.getItem("visualizer_image")
    if (savedImage) {
      setImage(savedImage)
      sessionStorage.removeItem("visualizer_image")
    }
  }, [])

  const handleUnlock = () => {
    setUnlocked(true)
    sessionStorage.setItem("visualizer_unlocked", "true")
  }

  const handlePinSubmit = (newPin: string) => {
    if (newPin === PIN) {
      handleUnlock()
      setPinError(false)
    } else {
      setPinError(true)
      setPin("")
    }
  }

  const handleImageSelect = (file: File) => {
    setImageFile(file)
    setResult(null)
    setError("")
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImage(dataUrl)
      // Save to sessionStorage in case mobile remounts the page after camera
      try {
        sessionStorage.setItem("visualizer_image", dataUrl)
      } catch (e) {
        // Image too large for sessionStorage, ignore
      }
    }
    reader.readAsDataURL(file)
  }

  const handleGenerate = async () => {
    if (!image) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      // Stage updates to keep user engaged
      setStage("Analysing the space...")
      await new Promise(r => setTimeout(r, 1500))
      setStage("Applying design style...")
      await new Promise(r => setTimeout(r, 1500))
      setStage("Generating your vision...")

      const response = await fetch("/api/visualizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image,
          style: selectedStyle,
          roomType: selectedRoom,
        })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Generation failed")

      setResult(data.imageUrl)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!result) return
    const a = document.createElement("a")
    a.href = result
    a.download = `visualized-${selectedRoom}-${selectedStyle}.png`
    a.target = "_blank"
    a.click()
  }

  // PIN Screen
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-caribbean-navy flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
          <div className="w-16 h-16 bg-caribbean-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-caribbean-gold" />
          </div>
          <h1 className="text-2xl font-bold text-caribbean-navy mb-2">Agent Tools</h1>
          <p className="text-gray-500 text-sm mb-6">Enter your PIN to continue</p>

          <div className="flex gap-2 justify-center mb-4">
            {[0,1,2,3].map(i => (
              <div key={i} className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition ${
                pin.length > i 
                  ? "border-caribbean-gold bg-caribbean-gold/10 text-caribbean-navy" 
                  : "border-gray-200 text-gray-300"
              }`}>
                {pin.length > i ? "•" : ""}
              </div>
            ))}
          </div>

          {pinError && (
            <p className="text-red-500 text-sm mb-4">Incorrect PIN. Try again.</p>
          )}

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((key, i) => (
              <button
                key={i}
                onClick={() => {
                  if (key === "⌫") {
                    setPin(p => p.slice(0, -1))
                  } else if (key !== "" && pin.length < 4) {
                    const newPin = pin + key
                    setPin(newPin)
                    if (newPin.length === 4) {
                      setTimeout(() => handlePinSubmit(newPin), 200)
                    }
                  }
                }}
                className={`h-14 rounded-xl font-semibold text-lg transition ${
                  key === "" 
                    ? "cursor-default" 
                    : "bg-gray-50 hover:bg-caribbean-gold/10 hover:text-caribbean-navy active:scale-95 text-gray-700"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Main Tool
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-caribbean-navy text-white px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-caribbean-gold" />
              Space Visualizer
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">AI-powered renovation preview</p>
          </div>
          <div className="text-xs text-gray-400 bg-white/10 px-3 py-1.5 rounded-full">
            Agent Tool
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Step 1: Upload Photo */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-caribbean-navy flex items-center gap-2">
              <span className="w-6 h-6 bg-caribbean-gold text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              Take or Upload a Photo
            </h2>
          </div>

          {!image ? (
            <div className="p-5 grid grid-cols-2 gap-3">
              {/* Camera */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-caribbean-gold hover:bg-caribbean-gold/5 transition active:scale-95"
              >
                <Camera className="h-8 w-8 text-caribbean-gold" />
                <span className="text-sm font-semibold text-gray-700">Take Photo</span>
                <span className="text-xs text-gray-400">Use camera</span>
              </button>

              {/* Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-caribbean-gold hover:bg-caribbean-gold/5 transition active:scale-95"
              >
                <Upload className="h-8 w-8 text-caribbean-gold" />
                <span className="text-sm font-semibold text-gray-700">Upload Photo</span>
                <span className="text-xs text-gray-400">From gallery</span>
              </button>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="p-5">
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img src={image} alt="Selected space" className="w-full h-64 object-cover" />
                <button
                  onClick={() => { setImage(null); setImageFile(null); setResult(null) }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition"
                >
                  ✕
                </button>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-sm text-caribbean-gold font-semibold hover:underline"
              >
                Change photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
              />
            </div>
          )}
        </div>

        {/* Step 2: Room Type */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-caribbean-navy flex items-center gap-2">
              <span className="w-6 h-6 bg-caribbean-gold text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              What type of space?
            </h2>
          </div>
          <div className="p-5 grid grid-cols-3 gap-2">
            {ROOM_TYPES.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition active:scale-95 ${
                  selectedRoom === room.id
                    ? "border-caribbean-gold bg-caribbean-gold/10"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className="text-2xl">{room.emoji}</span>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{room.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Style */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-caribbean-navy flex items-center gap-2">
              <span className="w-6 h-6 bg-caribbean-gold text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              Choose a design style
            </h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-2">
            {STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition active:scale-95 ${
                  selectedStyle === style.id
                    ? "border-caribbean-gold bg-caribbean-gold/10"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className="text-xl">{style.emoji}</span>
                <span className="text-sm font-semibold text-gray-700">{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!image || loading}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition ${
            !image || loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy active:scale-95 shadow-lg shadow-caribbean-gold/20"
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              {stage}
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Vision
            </>
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-caribbean-navy flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-caribbean-gold" />
                Your Redesigned Space
              </h2>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-xs font-semibold text-caribbean-gold hover:underline"
              >
                <Download className="h-4 w-4" />
                Save
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Before / After */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Before</p>
                  <img src={image!} alt="Before" className="w-full h-48 object-cover rounded-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-caribbean-gold uppercase tracking-wide mb-2">After ✨</p>
                  <img src={result} alt="After" className="w-full h-48 object-cover rounded-xl" />
                </div>
              </div>

              <div className="bg-caribbean-gold/10 rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-caribbean-navy">
                  {selectedStyle} {selectedRoom} redesign
                </p>
                <p className="text-xs text-gray-500 mt-1">AI-generated concept for visualization purposes</p>
              </div>

              {/* Generate Another */}
              <button
                onClick={handleGenerate}
                className="w-full py-3 rounded-xl border-2 border-caribbean-gold text-caribbean-navy font-semibold text-sm hover:bg-caribbean-gold/10 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Generate Another Variation
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          Caribbean Keys Agent Tool · AI-generated concepts for visualization only
        </p>
      </div>
    </div>
  )
}