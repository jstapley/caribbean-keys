// @ts-nocheck
import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, style, roomType } = await request.json()

    if (!imageBase64 || !style || !roomType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiToken = process.env.REPLICATE_API_TOKEN
    if (!apiToken) {
      return NextResponse.json({ error: "Replicate API token not configured" }, { status: 500 })
    }

    // Strip data URI prefix
    const base64Data = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64

    const inputBuffer = Buffer.from(base64Data, "base64")

    // Use Sharp to resize (max 1024px) and convert to clean RGB JPEG
    const jpegBuffer = await sharp(inputBuffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Pass as data URI directly in the prediction input
    const jpegDataUri = `data:image/jpeg;base64,${jpegBuffer.toString("base64")}`
    console.log("JPEG data URI length:", jpegDataUri.length)

    const prompt = `A beautifully redesigned ${roomType} in ${style} style. Professional interior design photography, high-end renovation, bright and airy, magazine quality, photorealistic.`

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        input: {
          image: jpegDataUri,
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
      console.error("Prediction start error:", error)
      return NextResponse.json({ error: `Failed to start: ${error}` }, { status: 500 })
    }

    const prediction = await response.json()
    console.log("Prediction started:", prediction.id, "status:", prediction.status)

    // Poll for completion
    let result = prediction
    let attempts = 0

    while (result.status !== "succeeded" && result.status !== "failed" && attempts < 45) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { "Authorization": `Bearer ${apiToken}` }
      })
      result = await pollResponse.json()
      console.log(`Poll ${attempts + 1}: ${result.status}${result.error ? " - " + result.error : ""}`)
      attempts++
    }

    if (result.status === "failed") {
      console.error("Generation failed:", result.error)
      return NextResponse.json({ error: result.error || "Generation failed" }, { status: 500 })
    }

    if (result.status !== "succeeded") {
      return NextResponse.json({ error: "Timed out" }, { status: 500 })
    }

    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output
    return NextResponse.json({ imageUrl: outputUrl })

  } catch (error: any) {
    console.error("Visualizer error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}