import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { UserPlus, Calendar, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AgentPortalPage() {
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agent } = await admin
    .from('agents')
    .select('*')
    .eq('email', user!.email!)
    .single()

  const { data: referrals } = await admin
    .from('agent_referrals')
    .select('*, agent_referral_files(id, file_name)')
    .eq('agent_id', agent.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-caribbean-navy">Welcome, {agent.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{agent.company}</p>
        </div>

        {/* Referral code card */}
        <div className="bg-caribbean-navy rounded-xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Your Referral Code</p>
            <p className="text-caribbean-gold font-bold text-3xl tracking-widest">{agent.referral_code}</p>
          </div>
          <div className="text-white/60 text-sm max-w-xs">
            Share this code with Caribbean Keys when discussing a client, or simply register your
            clients below before any sale discussions begin.
          </div>
        </div>

        {/* Register CTA */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-caribbean-navy">
            Registered Clients
            <span className="ml-2 text-sm font-normal text-gray-500">({referrals?.length ?? 0})</span>
          </h2>
          <Link href="/agents/portal/register-client">
            <Button className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold">
              <UserPlus className="h-4 w-4 mr-2" />
              Register Client
            </Button>
          </Link>
        </div>

        {/* Referrals list */}
        {!referrals || referrals.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <UserPlus className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No clients registered yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Register a client to create a timestamped record and protect your commission.
            </p>
            <Link href="/agents/portal/register-client">
              <Button className="mt-4 bg-caribbean-navy hover:bg-caribbean-navy/90 text-white">
                Register Your First Client
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((r: any) => (
              <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-caribbean-navy">{r.client_name}</p>
                    <p className="text-sm text-gray-500">{r.client_email}</p>
                    {r.client_phone && <p className="text-sm text-gray-500">{r.client_phone}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      r.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.status === 'confirmed' ? 'Confirmed' : 'Pending Review'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(r.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(r.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  {r.agent_referral_files?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {r.agent_referral_files.length} proof file{r.agent_referral_files.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {r.notes && (
                  <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{r.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
