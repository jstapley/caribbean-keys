// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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

async function resolveAgentId(admin: any, email: string): Promise<string> {
  // Check if this person's email is registered as a client by any agent
  const { data: referral } = await admin
    .from('agent_referrals')
    .select('agent_id')
    .eq('client_email', email.toLowerCase().trim())
    .limit(1)
    .single()

  if (referral?.agent_id) return referral.agent_id

  // Fall back to Ross Harris — find or create the record
  const rossEmail = process.env.NOTIFICATION_EMAIL || 'ross@caribbeankeysrealestate.com'

  const { data: ross } = await admin
    .from('agents')
    .select('id')
    .eq('email', rossEmail)
    .single()

  if (ross?.id) return ross.id

  // Create Ross's agent record if it doesn't exist yet
  const { data: newRoss } = await admin
    .from('agents')
    .insert({
      name: 'Ross Harris',
      email: rossEmail,
      company: 'Caribbean Keys Real Estate',
      status: 'approved',
      referral_code: 'ROSS',
      approved_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  return newRoss.id
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

    // Basic server-side validation
    if (!inquiryData.first_name || !inquiryData.last_name || !inquiryData.email || !inquiryData.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inquiryData.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Need service role for agent lookup (bypasses RLS)
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const agentId = await resolveAgentId(admin, inquiryData.email)

    const { error: insertError } = await admin
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
          referred_by_agent_id: agentId,
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
