// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Calendar, ExternalLink } from 'lucide-react'

export const revalidate = 0

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: agent } = await admin.from('agents').select('*').eq('id', params.id).single()
  if (!agent) notFound()

  const { data: referrals } = await admin
    .from('agent_referrals')
    .select('*, agent_referral_files(*)')
    .eq('agent_id', agent.id)
    .order('created_at', { ascending: false })

  // Generate signed URLs for all proof files (1 hour expiry)
  const referralsWithUrls = await Promise.all(
    (referrals || []).map(async (r: any) => {
      const filesWithUrls = await Promise.all(
        (r.agent_referral_files || []).map(async (f: any) => {
          const { data } = await admin.storage
            .from('agent-proof-files')
            .createSignedUrl(f.file_path, 3600)
          return { ...f, signedUrl: data?.signedUrl || null }
        })
      )
      return { ...r, agent_referral_files: filesWithUrls }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin/agents" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-caribbean-navy">
            <ArrowLeft className="h-4 w-4" /> Back to Agents
          </Link>
        </div>

        {/* Agent header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-caribbean-navy">{agent.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  agent.status === 'approved' ? 'bg-green-100 text-green-700' :
                  agent.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{agent.company}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                <span>{agent.email}</span>
                {agent.phone && <span>{agent.phone}</span>}
              </div>
            </div>
            {agent.referral_code && (
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Referral Code</p>
                <p className="font-mono font-bold text-caribbean-gold text-xl tracking-widest">
                  {agent.referral_code}
                </p>
              </div>
            )}
          </div>

          {agent.admin_notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">Admin Notes</p>
              <p className="text-sm text-gray-700">{agent.admin_notes}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm text-gray-500 flex-wrap">
            <span>Applied: {new Date(agent.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {agent.approved_at && (
              <span>Approved: {new Date(agent.approved_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
          </div>
        </div>

        {/* Referrals */}
        <h2 className="text-lg font-bold text-caribbean-navy mb-4">
          Registered Clients
          <span className="ml-2 text-sm font-normal text-gray-500">({referralsWithUrls.length})</span>
        </h2>

        {referralsWithUrls.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center">
            <p className="text-gray-400">This agent hasn't registered any clients yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {referralsWithUrls.map((r: any) => (
              <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-caribbean-navy">{r.client_name}</p>
                    <p className="text-sm text-gray-500">{r.client_email}</p>
                    {r.client_phone && <p className="text-sm text-gray-500">{r.client_phone}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Registered {new Date(r.created_at).toLocaleString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                      <span className="font-medium text-caribbean-navy">{r.development}</span>
                    </div>
                    {r.notes && (
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{r.notes}</p>
                    )}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                    r.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>

                {/* Proof files */}
                {r.agent_referral_files?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      Proof Files ({r.agent_referral_files.length})
                    </p>
                    <div className="space-y-1.5">
                      {r.agent_referral_files.map((f: any) => (
                        <div key={f.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-caribbean-gold flex-shrink-0" />
                            <span className="truncate text-gray-700">{f.file_name}</span>
                            {f.file_size && (
                              <span className="text-gray-400 text-xs flex-shrink-0">
                                ({(f.file_size / 1024).toFixed(0)} KB)
                              </span>
                            )}
                          </div>
                          {f.signedUrl && (
                            <a
                              href={f.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 ml-2 text-caribbean-gold hover:text-caribbean-navy text-xs flex items-center gap-1 font-medium"
                            >
                              View <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
