import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import AgentPortalShell from './AgentPortalShell'

export default async function AgentPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/agents/login')
  }

  // Verify this user is an approved agent (use service role to bypass RLS)
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: agent } = await admin
    .from('agents')
    .select('id, name, email, referral_code, company')
    .eq('email', user.email!)
    .eq('status', 'approved')
    .single()

  if (!agent) {
    redirect('/agents/login?error=not_approved')
  }

  return <AgentPortalShell agent={agent}>{children}</AgentPortalShell>
}
