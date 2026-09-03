// @ts-nocheck
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 })
    }

    const formData = new URLSearchParams()
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY!)
    formData.append('response', token)

    const ip = request.headers.get('x-forwarded-for')
    if (ip) formData.append('remoteip', ip)

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    return NextResponse.json({ success: data.success === true })
  } catch (err: any) {
    console.error('Turnstile verify error:', err)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}