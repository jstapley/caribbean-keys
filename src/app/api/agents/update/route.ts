import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const serverClient = await createServerClient()
    const { data: { user } } = await serverClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    const { agentId, name, email, phone, company, admin_notes } = body

    if (!agentId) return NextResponse.json({ error: 'agentId required' }, { status: 400 })

    const { error } = await admin
      .from('agents')
      .update({ name, email, phone: phone || null, company, admin_notes: admin_notes || null })
      .eq('id', agentId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Agent update error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
