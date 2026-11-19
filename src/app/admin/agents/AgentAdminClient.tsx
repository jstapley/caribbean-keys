// @ts-nocheck
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, X, ChevronRight, Clock, Building2, Pencil, Trash2 } from 'lucide-react'

type Agent = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string
  referral_code: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  created_at: string
  approved_at: string | null
}

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected'] as const

export default function AgentAdminClient({ initialAgents }: { initialAgents: Agent[] }) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [activeTab, setActiveTab] = useState<typeof STATUS_TABS[number]>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [notesMap, setNotesMap] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Agent>>({})

  const filtered = activeTab === 'all' ? agents : agents.filter((a) => a.status === activeTab)

  const counts = {
    all: agents.length,
    pending: agents.filter((a) => a.status === 'pending').length,
    approved: agents.filter((a) => a.status === 'approved').length,
    rejected: agents.filter((a) => a.status === 'rejected').length,
  }

  const handleApprove = async (agent: Agent) => {
    setActionLoading(agent.id)
    try {
      const res = await fetch('/api/agents/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id, adminNotes: notesMap[agent.id] || '' }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agent.id
            ? { ...a, status: 'approved', referral_code: result.referralCode, approved_at: new Date().toISOString() }
            : a
        )
      )
    } catch (err: any) {
      alert(err.message || 'Failed to approve agent.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (agent: Agent) => {
    if (!confirm(`Reject ${agent.name}?`)) return
    setActionLoading(agent.id)
    try {
      const res = await fetch('/api/agents/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id, adminNotes: notesMap[agent.id] || '' }),
      })
      if (!res.ok) throw new Error('Failed')
      setAgents((prev) => prev.map((a) => a.id === agent.id ? { ...a, status: 'rejected' } : a))
    } catch {
      alert('Failed to reject agent.')
    } finally {
      setActionLoading(null)
    }
  }

  const startEdit = (agent: Agent) => {
    setEditingId(agent.id)
    setEditForm({
      name: agent.name,
      email: agent.email,
      phone: agent.phone || '',
      company: agent.company,
      admin_notes: agent.admin_notes || '',
    })
  }

  const handleSaveEdit = async (agentId: string) => {
    setActionLoading(agentId)
    try {
      const res = await fetch('/api/agents/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, ...editForm }),
      })
      if (!res.ok) throw new Error('Failed')
      setAgents((prev) =>
        prev.map((a) => a.id === agentId ? { ...a, ...editForm } : a)
      )
      setEditingId(null)
    } catch {
      alert('Failed to save changes.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (agent: Agent) => {
    if (!confirm(`Delete ${agent.name} and all their referral records? This cannot be undone.`)) return
    setActionLoading(agent.id)
    try {
      const res = await fetch('/api/agents/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id }),
      })
      if (!res.ok) throw new Error('Failed')
      setAgents((prev) => prev.filter((a) => a.id !== agent.id))
    } catch {
      alert('Failed to delete agent.')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caribbean-navy mb-1">Agents</h1>
          <p className="text-gray-500">Manage referral agent applications and approved agents.</p>
        </div>

        {/* Status tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-semibold capitalize transition-colors -mb-px border-b-2 ${
                  activeTab === tab
                    ? 'border-caribbean-gold text-caribbean-gold'
                    : 'border-transparent text-gray-500 hover:text-caribbean-navy'
                }`}
              >
                {tab}
                <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No {activeTab === 'all' ? '' : activeTab} agents yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((agent) => (
              <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {editingId === agent.id ? (
                  /* Edit form */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 font-medium block mb-1">Name</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-caribbean-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium block mb-1">Company</label>
                        <input
                          type="text"
                          value={editForm.company || ''}
                          onChange={(e) => setEditForm((p) => ({ ...p, company: e.target.value }))}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-caribbean-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium block mb-1">Email</label>
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-caribbean-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium block mb-1">Phone</label>
                        <input
                          type="text"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-caribbean-gold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">Admin Notes</label>
                      <input
                        type="text"
                        value={editForm.admin_notes || ''}
                        onChange={(e) => setEditForm((p) => ({ ...p, admin_notes: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-caribbean-gold"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(agent.id)}
                        disabled={actionLoading === agent.id}
                        className="bg-caribbean-navy hover:bg-caribbean-navy/90 text-white text-xs"
                      >
                        {actionLoading === agent.id ? 'Saving…' : 'Save'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Normal view */
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-caribbean-navy text-lg">{agent.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          agent.status === 'approved' ? 'bg-green-100 text-green-700' :
                          agent.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-0.5">{agent.company}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 flex-wrap">
                        <span>{agent.email}</span>
                        {agent.phone && <span>{agent.phone}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Applied {new Date(agent.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {agent.referral_code && (
                        <p className="mt-2 text-sm font-mono font-bold text-caribbean-gold">
                          {agent.referral_code}
                        </p>
                      )}
                      {agent.admin_notes && (
                        <p className="mt-1 text-xs text-gray-500 italic">Note: {agent.admin_notes}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Link href={`/admin/agents/${agent.id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Details
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(agent)}
                          className="text-xs"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(agent)}
                          disabled={actionLoading === agent.id}
                          className="text-xs border-red-200 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {agent.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(agent)}
                            disabled={actionLoading === agent.id}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {actionLoading === agent.id ? 'Approving…' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(agent)}
                            disabled={actionLoading === agent.id}
                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {agent.status === 'pending' && editingId !== agent.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="text-xs text-gray-500 font-medium block mb-1">
                      Admin notes (optional — included in rejection/approval)
                    </label>
                    <input
                      type="text"
                      value={notesMap[agent.id] || ''}
                      onChange={(e) => setNotesMap((prev) => ({ ...prev, [agent.id]: e.target.value }))}
                      placeholder="e.g. Verified licence, known local agent"
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-caribbean-gold"
                    />
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
