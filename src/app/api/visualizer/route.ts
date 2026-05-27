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

    // Convert base64 to a data URI that Replicate can use
    // The image arrives as a full data URI (data:image/jpeg;base64,...)
    const imageDataUri = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`

    // Use the standard predictions endpoint with version hash
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "Prefer": "wait=60",
      },
      body: JSON.stringify({
        version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        input: {
          image: imageDataUri,
          prompt: prompt,
          negative_prompt: "ugly, blurry, low quality, distorted, deformed, cartoon, sketch, watermark",
          guidance_scale: 15,
          prompt_strength: 0.8,
          num_inference_steps: 50,
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Replicate API error:", error)
      return NextResponse.json(
        { error: `Replicate error: ${error}` },
        { status: 500 }
      )
    }

    const prediction = await response.json()
    console.log("Initial prediction:", JSON.stringify(prediction))

    // Poll for completion (max 90 seconds)
    let result = prediction
    let attempts = 0
    const maxAttempts = 45 // 45 * 2s = 90s

    while (result.status !== "succeeded" && result.status !== "failed" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          "Authorization": `Bearer ${apiToken}`,
        }
      })
      
      result = await pollResponse.json()
      console.log(`Poll ${attempts + 1}: status = ${result.status}`)
      attempts++
    }

    if (result.status === "failed") {
      console.error("Generation failed:", result.error)
      return NextResponse.json(
        { error: result.error || "Image generation failed" },
        { status: 500 }
      )
    }

    if (result.status !== "succeeded") {
      return NextResponse.json(
        { error: "Image generation timed out after 90 seconds" },
        { status: 500 }
      )
    }

    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output

    return NextResponse.json({ imageUrl: outputUrl })

  } catch (error: any) {
    console.error("Visualizer error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}