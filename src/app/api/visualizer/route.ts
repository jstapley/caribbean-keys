// @ts-nocheck
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, style, roomType } = await request.json()

    if (!imageBase64 || !style || !roomType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const apiToken = process.env.REPLICATE_API_TOKEN
    if (!apiToken) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 }
      )
    }

    const prompt = `A beautifully redesigned ${roomType} in ${style} style. Professional interior design photography, high-end renovation, bright and airy, magazine quality, photorealistic.`

    // Start the prediction
    const response = await fetch("https://api.replicate.com/v1/models/adirik/interior-design/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          image: imageBase64,
          prompt: prompt,
          negative_prompt: "ugly, blurry, low quality, distorted, deformed, cartoon, sketch",
          guidance_scale: 15,
          prompt_strength: 0.8,
          num_inference_steps: 50,
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Replicate error:", error)
      return NextResponse.json(
        { error: "Failed to start image generation" },
        { status: 500 }
      )
    }

    const prediction = await response.json()

    // Poll for completion (max 60 seconds)
    let result = prediction
    let attempts = 0
    const maxAttempts = 30

    while (result.status !== "succeeded" && result.status !== "failed" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          "Authorization": `Bearer ${apiToken}`,
        }
      })
      
      result = await pollResponse.json()
      attempts++
    }

    if (result.status === "failed") {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 }
      )
    }

    if (result.status !== "succeeded") {
      return NextResponse.json(
        { error: "Image generation timed out" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      imageUrl: Array.isArray(result.output) ? result.output[0] : result.output
    })

  } catch (error) {
    console.error("Visualizer error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}