// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import AgentAdminClient from './AgentAdminClient'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const revalidate = 0

export default async function AdminAgentsPage() {
  const { data: agents } = await admin
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false })

  return <AgentAdminClient initialAgents={agents || []} />
}
