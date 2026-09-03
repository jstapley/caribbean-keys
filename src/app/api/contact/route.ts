// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Server-side Supabase client. Uses the same public anon key as the rest
// of the app - no service role key needed, since the existing RLS policy
// on property_inquiries already permits anonymous INSERT. The Turnstile
// check above is what adds the actual protection.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function verifyTurnstileToken(token: string, ip: string | null) {
  const formData = new URLSearchParams()
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!)
  formData.append('response', token)
  if (ip) formData.append('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  return data.success === true
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { turnstileToken, ...inquiryData } = body

    if (!turnstileToken) {
      return NextResponse.json({ error: 'Verification required' }, { status: 400 })
    }

    // Verify the Turnstile token server-side before touching the database
    const ip = request.headers.get('x-forwarded-for')
    const isHuman = await verifyTurnstileToken(turnstileToken, ip)

    if (!isHuman) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 403 }
      )
    }

    // Basic server-side validation (mirrors the client-side checks, since
    // a bot could hit this route directly and skip the browser form)
    if (!inquiryData.first_name || !inquiryData.last_name || !inquiryData.email || !inquiryData.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inquiryData.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const { error: insertError } = await supabaseAdmin
      .from('property_inquiries')
      .insert([
        {
          first_name: inquiryData.first_name,
          last_name: inquiryData.last_name,
          name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone,
          interest: inquiryData.interest,
          message: inquiryData.message,
        },
      ])

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}