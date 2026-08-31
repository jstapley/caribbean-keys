// @ts-nocheck
import { NextResponse } from "next/server"

const PLACE_ID = "ChIJe6QII3GTEowRru734EvcgeM"
const API_KEY = process.env.GOOGLE_PLACES_API_KEY

// Cache reviews for 24 hours
let cachedReviews: any = null
let cacheTime: number = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function GET() {
  try {
    // Return cached reviews if still fresh
    if (cachedReviews && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedReviews)
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total&key=${API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    console.log('Places API status:', data.status)
    console.log('Places API error:', data.error_message)
    console.log('Places API result keys:', Object.keys(data.result || {}))

    if (data.status !== 'OK') {
      console.error('Places API error:', data.status, data.error_message)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    const result = {
      name: data.result.name,
      rating: data.result.rating,
      totalReviews: data.result.user_ratings_total,
      reviews: (data.result.reviews || [])
        .filter((r: any) => r.rating >= 4) // Only show 4-5 star reviews
        .slice(0, 6) // Max 6 reviews
        .map((r: any) => ({
          author: r.author_name,
          rating: r.rating,
          text: r.text,
          time: r.relative_time_description,
          profilePhoto: r.profile_photo_url,
        }))
    }

    // Cache the result
    cachedReviews = result
    cacheTime = Date.now()

    return NextResponse.json(result)

  } catch (error) {
    console.error('Reviews error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}