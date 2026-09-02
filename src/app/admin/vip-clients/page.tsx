// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/AdminNav"
import { Input } from "@/components/ui/input"
import {
  Star,
  Calendar,
  Home,
  Search,
  Mail,
  Phone,
  X,
  FileText,
  Download,
} from "lucide-react"

const STATUS_OPTIONS = ["new", "contacted", "in_progress", "completed"]

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
}

export default function AdminVipClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("client_onboarding")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching VIP clients:", error)
      } else {
        setClients(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatus(id)
    try {
      const { error } = await supabase
        .from("client_onboarding")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error

      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
    } catch (error: any) {
      console.error("Error updating status:", error)
      alert("Failed to update status: " + error.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleViewDocument = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("client-documents")
        .createSignedUrl(path, 300) // 5 minute expiry

      if (error) throw error
      window.open(data.signedUrl, "_blank")
    } catch (error: any) {
      console.error("Error generating document link:", error)
      alert("Could not open document: " + error.message)
    }
  }

  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      client.first_name?.toLowerCase().includes(q) ||
      client.last_name?.toLowerCase().includes(q) ||
      client.email?.toLowerCase().includes(q) ||
      client.country?.toLowerCase().includes(q)
    )
  })

  const totalClients = clients.length
  const now = new Date()
  const clientsThisMonth = clients.filter((c) => {
    if (!c.created_at) return false
    const d = new Date(c.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const newCount = clients.filter((c) => c.status === "new").length

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caribbean-navy mb-2">VIP Clients</h1>
          <p className="text-gray-600">Clients who completed the onboarding process</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total VIP Clients</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? "..." : totalClients}
                </p>
              </div>
              <div className="bg-caribbean-blue/20 p-3 rounded-full">
                <Star className="h-8 w-8 text-caribbean-navy" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">All time submissions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? "..." : clientsThisMonth}
                </p>
              </div>
              <div className="bg-caribbean-gold/20 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-caribbean-navy" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">New onboarding this month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Needs Follow-up</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? "..." : newCount}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Home className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Marked "new" status</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or country..."
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-caribbean-navy text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Budget</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Target Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Loading VIP clients...
                    </td>
                  </tr>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => {
                    const isExpanded = expandedId === client.id
                    const displayName =
                      [client.first_name, client.last_name].filter(Boolean).join(" ") ||
                      "Unknown"

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
                            <div className="text-xs text-gray-500">
                              {client.country || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              {client.email}
                            </div>
                            {client.phone && (
                              <div className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                {client.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {client.price_range || "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {client.target_purchase_date
                              ? new Date(client.target_purchase_date).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={client.status || "new"}
                              disabled={updatingStatus === client.id}
                              onChange={(e) => handleStatusChange(client.id, e.target.value)}
                              className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer ${
                                STATUS_STYLES[client.status] || STATUS_STYLES.new
                              }`}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s.replace("_", " ")}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {client.created_at
                              ? new Date(client.created_at).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${client.id}-details`} className="bg-caribbean-seafoam/10">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1">
                                    Address
                                  </p>
                                  <p className="text-gray-700">
                                    {[client.street_address, client.city, client.state_province, client.country]
                                      .filter(Boolean)
                                      .join(", ") || "—"}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    Nationality: {client.nationality || "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1">
                                    Property Preferences
                                  </p>
                                  <p className="text-gray-700">
                                    {client.bedrooms || "—"} bed
                                    {client.bedrooms === 1 ? "" : "s"} •{" "}
                                    {client.bathrooms || "—"} bath
                                    {client.bathrooms === 1 ? "" : "s"}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {client.oceanfront ? "Oceanfront • " : ""}
                                    {client.dock ? "Private Dock" : ""}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 mb-1">
                                    Documents
                                  </p>
                                  {client.documents && client.documents.length > 0 ? (
                                    <div className="space-y-1">
                                      {client.documents.map((path: string, i: number) => (
                                        <button
                                          key={i}
                                          onClick={() => handleViewDocument(path)}
                                          className="flex items-center gap-1.5 text-caribbean-navy hover:text-caribbean-gold text-xs"
                                        >
                                          <FileText className="h-3.5 w-3.5" />
                                          {path.split("-").slice(2).join("-") || `Document ${i + 1}`}
                                        </button>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400 text-xs">No documents uploaded</p>
                                  )}
                                </div>
                              </div>
                              {client.additional_notes && (
                                <div className="mt-4">
                                  <p className="text-xs font-semibold text-gray-500 mb-1">Notes</p>
                                  <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {client.additional_notes}
                                  </p>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="text-center py-12">
                        <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {searchQuery ? "No matching clients" : "No VIP clients yet"}
                        </h3>
                        <p className="text-gray-600">
                          {searchQuery
                            ? "Try a different search term"
                            : "Onboarding submissions will appear here"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && filteredClients.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredClients.length} of {clients.length}{" "}
            {clients.length === 1 ? "client" : "clients"}
          </div>
        )}
      </div>
    </div>
  )
}