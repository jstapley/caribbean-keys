import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { sendAgentApprovalEmail } from '@/lib/email'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateReferralCode(company: string, existingCodes: string[]): string {
  const base = company
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join('-')
    .slice(0, 24)

  let num = 1
  let code = `${base}-${String(num).padStart(3, '0')}`
  while (existingCodes.includes(code)) {
    num++
    code = `${base}-${String(num).padStart(3, '0')}`
  }
  return code
}

export async function POST(request: Request) {
  try {
    // Admin-only: verify logged-in session belongs to an admin user
    const serverClient = await createServerClient()
    const { data: { user } } = await serverClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agentId, adminNotes } = body

    if (!agentId) {
      return NextResponse.json({ error: 'agentId required' }, { status: 400 })
    }

    // Fetch agent
    const { data: agent, error: fetchError } = await admin
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (fetchError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    if (agent.status === 'approved') {
      return NextResponse.json({ error: 'Agent already approved' }, { status: 409 })
    }

    // Generate unique referral code
    const { data: existingCodes } = await admin
      .from('agents')
      .select('referral_code')
      .not('referral_code', 'is', null)

    const codes = (existingCodes || []).map((r: any) => r.referral_code).filter(Boolean)
    const referralCode = generateReferralCode(agent.company, codes)

    // Update agent record
    const { error: updateError } = await admin
      .from('agents')
      .update({
        status: 'approved',
        referral_code: referralCode,
        admin_notes: adminNotes || null,
        approved_at: new Date().toISOString(),
      })
      .eq('id', agentId)

    if (updateError) throw updateError

    // Send welcome email to agent
    await sendAgentApprovalEmail({
      name: agent.name,
      email: agent.email,
      referral_code: referralCode,
    })

    // Send Supabase magic-link invite so agent can log in
    await admin.auth.admin.inviteUserByEmail(agent.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/agents/portal`,
    })

    return NextResponse.json({ success: true, referralCode })
  } catch (err: any) {
    console.error('Agent approve error:', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
