// @ts-nocheck
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const query = `${address}, Antigua`

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
  )

  const data = await response.json()

  if (data.status === "OK" && data.results?.[0]) {
    const { lat, lng } = data.results[0].geometry.location
    return NextResponse.json({
      lat,
      lng,
      formatted_address: data.results[0].formatted_address
    })
  }

  return NextResponse.json({ error: "Location not found" }, { status: 404 })
}