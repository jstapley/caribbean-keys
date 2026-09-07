// @ts-nocheck
"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/AdminNav"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, Percent, MessageSquare, Star, X, ArrowRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function AdminMetricsPage() {
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [soldProperties, setSoldProperties] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [onboarding, setOnboarding] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Shared filters
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [propertyId, setPropertyId] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)

      const [propsRes, soldRes, inquiriesRes, onboardingRes] = await Promise.all([
        supabase.from("properties").select("id, property_name").order("property_name"),
        supabase.from("properties").select("*").eq("listing_status", "sold"),
        supabase.from("property_inquiries").select("*"),
        supabase.from("client_onboarding").select("*"),
      ])

      if (propsRes.data) setAllProperties(propsRes.data)
      if (soldRes.data) setSoldProperties(soldRes.data)
      if (inquiriesRes.data) setInquiries(inquiriesRes.data)
      if (onboardingRes.data) setOnboarding(onboardingRes.data)
    } catch (err) {
      console.error("Error fetching metrics data:", err)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setDateFrom("")
    setDateTo("")
    setPropertyId("all")
  }

  const inDateRange = (dateStr: string | null) => {
    if (!dateStr) return true
    const d = new Date(dateStr)
    if (dateFrom && d < new Date(dateFrom)) return false
    if (dateTo && d > new Date(dateTo + "T23:59:59")) return false
    return true
  }

  // --- Sales Performance (filtered) ---
  const filteredSold = useMemo(() => {
    return soldProperties
      .filter((p) => propertyId === "all" || p.id === propertyId)
      .filter((p) => inDateRange(p.sold_date))
      .map((p) => {
        const originalAsk = p.price_orig_asking || p.price_asking
        const ratio = originalAsk && p.price_sold ? (p.price_sold / originalAsk) * 100 : null
        return { ...p, _originalAsk: originalAsk, _ratio: ratio }
      })
  }, [soldProperties, propertyId, dateFrom, dateTo])

  const daysOnMarketValues = filteredSold
    .map((p) => p.days_on_market)
    .filter((d) => d !== null && d !== undefined)
  const avgDaysOnMarket = daysOnMarketValues.length
    ? Math.round(daysOnMarketValues.reduce((a, b) => a + b, 0) / daysOnMarketValues.length)
    : null

  const ratioValues = filteredSold.map((p) => p._ratio).filter((r) => r !== null)
  const avgRatio = ratioValues.length
    ? (ratioValues.reduce((a, b) => a + b, 0) / ratioValues.length).toFixed(1)
    : null

  // --- Inquiries (filtered) ---
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((i) => propertyId === "all" || i.property_id === propertyId)
      .filter((i) => inDateRange(i.created_at))
  }, [inquiries, propertyId, dateFrom, dateTo])

  // --- VIP Onboarding (filtered by date only - not tied to a property) ---
  const filteredOnboarding = useMemo(() => {
    return onboarding.filter((o) => inDateRange(o.created_at))
  }, [onboarding, dateFrom, dateTo])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Metrics</h1>
          <p className="text-gray-600">Performance overview across sales, inquiries, and VIP clients</p>
        </div>

        {/* Shared Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">From</label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">To</label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Property</label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {allProperties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.property_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(dateFrom || dateTo || propertyId !== "all") && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Sales Performance */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-caribbean-navy mb-4">Sales Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Sold</p>
                  <p className="text-3xl font-bold text-caribbean-navy">
                    {loading ? "..." : filteredSold.length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Days on Market</p>
                  <p className="text-3xl font-bold text-caribbean-navy">
                    {loading ? "..." : avgDaysOnMarket ?? "N/A"}
                  </p>
                </div>
                <div className="bg-caribbean-gold/20 p-3 rounded-full">
                  <Calendar className="h-8 w-8 text-caribbean-navy" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg List-to-Sale Ratio</p>
                  <p className="text-3xl font-bold text-caribbean-navy">
                    {loading ? "..." : avgRatio ? `${avgRatio}%` : "N/A"}
                  </p>
                </div>
                <div className="bg-caribbean-blue/20 p-3 rounded-full">
                  <Percent className="h-8 w-8 text-caribbean-navy" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-caribbean-navy text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Property</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Original Ask</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Sale Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ratio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Days on Market</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Sold Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredSold.length > 0 ? (
                    filteredSold.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-caribbean-navy">{p.property_name}</div>
                          <div className="text-xs text-gray-500">{p.parish}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {p._originalAsk ? formatPrice(p._originalAsk) : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-caribbean-navy">
                          {p.price_sold ? formatPrice(p.price_sold) : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {p._ratio !== null ? (
                            <span className={`font-semibold ${p._ratio >= 100 ? "text-green-600" : "text-gray-700"}`}>
                              {p._ratio.toFixed(1)}%
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{p.days_on_market ?? "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.sold_date ? new Date(p.sold_date).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No sold properties match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inquiries + VIP Onboarding side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-caribbean-navy" />
                <h2 className="text-xl font-bold text-caribbean-navy">Client Inquiries</h2>
              </div>
            </div>
            <p className="text-4xl font-bold text-caribbean-navy mb-1">
              {loading ? "..." : filteredInquiries.length}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {propertyId !== "all" ? "For selected property, " : ""}
              matching current filters
            </p>
            <Link href="/admin/clients">
              <Button variant="outline" size="sm">
                View All Clients
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-caribbean-navy" />
                <h2 className="text-xl font-bold text-caribbean-navy">VIP Onboarding</h2>
              </div>
            </div>
            <p className="text-4xl font-bold text-caribbean-navy mb-1">
              {loading ? "..." : filteredOnboarding.length}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Submissions matching current date range
            </p>
            <Link href="/admin/vip-clients">
              <Button variant="outline" size="sm">
                View All VIP Clients
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* GA4 metrics placeholder */}
        <div className="mt-10 bg-white rounded-lg shadow-md p-6 border border-dashed border-gray-300">
          <p className="text-sm text-gray-500 text-center">
            Page views, WhatsApp clicks, phone clicks, and click-through rates will appear here
            once Google Analytics integration is connected.
          </p>
        </div>
      </div>
    </div>
  )
}