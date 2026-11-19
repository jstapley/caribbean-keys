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

    const { agentId } = await request.json()
    if (!agentId) return NextResponse.json({ error: 'agentId required' }, { status: 400 })

    // Delete referral files records, referrals, then agent
    const { data: referrals } = await admin
      .from('agent_referrals')
      .select('id')
      .eq('agent_id', agentId)

    if (referrals && referrals.length > 0) {
      const referralIds = referrals.map((r: any) => r.id)
      await admin.from('agent_referral_files').delete().in('referral_id', referralIds)
      await admin.from('agent_referrals').delete().in('id', referralIds)
    }

    const { error } = await admin.from('agents').delete().eq('id', agentId)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Agent delete error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
