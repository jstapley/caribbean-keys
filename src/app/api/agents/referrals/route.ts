import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { sendClientRegistrationNotification } from '@/lib/email'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Verify authenticated agent
    const serverClient = await createServerClient()
    const { data: { user } } = await serverClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Look up agent record
    const { data: agent } = await admin
      .from('agents')
      .select('*')
      .eq('email', user.email!)
      .eq('status', 'approved')
      .single()

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found or not approved' }, { status: 403 })
    }

    const formData = await request.formData()
    const clientName = formData.get('client_name') as string
    const clientEmail = formData.get('client_email') as string
    const clientPhone = formData.get('client_phone') as string | null
    const notes = formData.get('notes') as string | null
    const files = formData.getAll('files') as File[]

    if (!clientName || !clientEmail) {
      return NextResponse.json({ error: 'Client name and email are required.' }, { status: 400 })
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'At least one proof file is required.' }, { status: 400 })
    }

    // Create referral record
    const { data: referral, error: referralError } = await admin
      .from('agent_referrals')
      .insert({
        agent_id: agent.id,
        client_name: clientName.trim(),
        client_email: clientEmail.toLowerCase().trim(),
        client_phone: clientPhone?.trim() || null,
        development: 'Sugar Ridge',
        notes: notes?.trim() || null,
        status: 'pending',
      })
      .select()
      .single()

    if (referralError) throw referralError

    // Upload proof files to Supabase Storage
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `${agent.id}/${referral.id}/${Date.now()}-${safeName}`

      const { error: uploadError } = await admin.storage
        .from('agent-proof-files')
        .upload(filePath, file, { contentType: file.type })

      if (uploadError) {
        console.error('File upload error:', uploadError)
        continue
      }

      await admin.from('agent_referral_files').insert({
        referral_id: referral.id,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
      })
    }

    // Notify Ross
    await sendClientRegistrationNotification({
      agentName: agent.name,
      agentEmail: agent.email,
      clientName: clientName.trim(),
      clientEmail: clientEmail.toLowerCase().trim(),
      clientPhone: clientPhone?.trim() || null,
      development: 'Sugar Ridge',
      notes: notes?.trim() || null,
      referralId: referral.id,
    })

    return NextResponse.json({ success: true, referralId: referral.id })
  } catch (err: any) {
    console.error('Referral submit error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
