import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendAgentApplicationNotification } from '@/lib/email'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company } = body

    if (!name || !email || !company) {
      return NextResponse.json({ error: 'Name, email, and company are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Check for duplicate
    const { data: existing } = await admin
      .from('agents')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      const msg =
        existing.status === 'approved'
          ? 'An approved agent account already exists for this email.'
          : 'An application for this email is already under review.'
      return NextResponse.json({ error: msg }, { status: 409 })
    }

    const { error: insertError } = await admin.from('agents').insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      company: company.trim(),
      status: 'pending',
    })

    if (insertError) throw insertError

    // Notify Ross
    await sendAgentApplicationNotification({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      company: company.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Agent register error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
