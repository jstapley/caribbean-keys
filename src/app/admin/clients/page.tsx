// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/AdminNav"
import { Input } from "@/components/ui/input"
import { Users, Calendar, Home, Search, Mail, Phone, X } from "lucide-react"

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('property_inquiries')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching clients:', error)
        } else {
          setClients(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      client.name?.toLowerCase().includes(q) ||
      client.email?.toLowerCase().includes(q) ||
      client.first_name?.toLowerCase().includes(q) ||
      client.last_name?.toLowerCase().includes(q) ||
      client.property_name?.toLowerCase().includes(q)
    )
  })

  // Summary stats
  const totalClients = clients.length

  const now = new Date()
  const clientsThisMonth = clients.filter((c) => {
    if (!c.created_at) return false
    const d = new Date(c.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const propertyCounts: Record<string, number> = {}
  clients.forEach((c) => {
    if (c.property_name) {
      propertyCounts[c.property_name] = (propertyCounts[c.property_name] || 0) + 1
    }
  })
  const topProperty = Object.entries(propertyCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Clients</h1>
          <p className="text-gray-600">Everyone who's reached out through the contact form</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Clients</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? '...' : totalClients}
                </p>
              </div>
              <div className="bg-caribbean-blue/20 p-3 rounded-full">
                <Users className="h-8 w-8 text-caribbean-navy" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">All time inquiries</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? '...' : clientsThisMonth}
                </p>
              </div>
              <div className="bg-caribbean-gold/20 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-caribbean-navy" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">New clients this month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Most Inquired Property</p>
                <p className="text-lg font-bold text-caribbean-navy line-clamp-1">
                  {loading ? '...' : (topProperty ? topProperty[0] : 'N/A')}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Home className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              {topProperty ? `${topProperty[1]} inquir${topProperty[1] === 1 ? 'y' : 'ies'}` : 'No inquiries yet'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-caribbean-navy text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Property Interested</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      Loading clients...
                    </td>
                  </tr>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => {
                    const isExpanded = expandedId === client.id
                    const displayName = client.name ||
                      [client.first_name, client.last_name].filter(Boolean).join(' ') ||
                      'Unknown'

                    return (
                      <>
                        <tr
                          key={client.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setExpandedId(isExpanded ? null : client.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-caribbean-navy">
                              {displayName}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              {client.email || 'N/A'}
                            </div>
                            {client.phone && (
                              <div className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                {client.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {client.property_name || client.interest || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {client.created_at
                              ? new Date(client.created_at).toLocaleDateString()
                              : 'N/A'}
                          </td>
                        </tr>
                        {isExpanded && client.message && (
                          <tr key={`${client.id}-message`} className="bg-caribbean-seafoam/10">
                            <td colSpan={4} className="px-6 py-4">
                              <p className="text-xs font-semibold text-gray-500 mb-1">Message</p>
                              <p className="text-sm text-gray-700">{client.message}</p>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {searchQuery ? 'No matching clients' : 'No clients yet'}
                        </h3>
                        <p className="text-gray-600">
                          {searchQuery
                            ? 'Try a different search term'
                            : 'Contact form submissions will appear here'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Count */}
        {!loading && filteredClients.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredClients.length} of {clients.length} {clients.length === 1 ? 'client' : 'clients'}
          </div>
        )}
      </div>
    </div>
  )
}