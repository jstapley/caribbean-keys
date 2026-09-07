// @ts-nocheck
"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/AdminNav"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, Percent, MessageSquare, Star, X, ArrowRight, Eye, Phone, Send, Info } from "lucide-react"
import { formatPrice } from "@/lib/utils"

const EVENT_LABELS: Record<string, { label: string; icon: any; tooltip: string }> = {
  whatsapp_click: {
    label: "WhatsApp Clicks",
    icon: MessageSquare,
    tooltip: "Google Analytics event: fires when a visitor clicks the WhatsApp button.",
  },
  phone_click: {
    label: "Phone Clicks",
    icon: Phone,
    tooltip: "Google Analytics event: fires when a visitor taps a phone number link.",
  },
  contact_form_submit: {
    label: "Contact Form Submits",
    icon: Send,
    tooltip:
      "Google Analytics event: fires on a successful /contact page submission only. Separate from the property-page 'Send Inquiry' form below.",
  },
  property_inquiry_submit: {
    label: "Property Inquiries (GA4)",
    icon: Send,
    tooltip:
      "Google Analytics event: fires when a visitor submits the 'Send Inquiry' form on a specific property page. This is a browser-tracked count and may run slightly lower than the actual database total below (e.g. ad blockers can block analytics tracking).",
  },
  share_property: {
    label: "Property Shares",
    icon: ArrowRight,
    tooltip: "Google Analytics event: fires when a visitor uses the Share Property button.",
  },
  social_landing_view: {
    label: "Social Landing Views",
    icon: Eye,
    tooltip: "Google Analytics event: views of a property's /p/[slug] social landing page.",
  },
  view_full_listing_click: {
    label: "View Full Listing Clicks",
    icon: Eye,
    tooltip: "Google Analytics event: fires when a visitor clicks through from a social landing page to the full listing.",
  },
  visualizer_generate: {
    label: "Visualizer Uses",
    icon: Star,
    tooltip: "Google Analytics event: fires when a visitor generates an AI room visualization.",
  },
}

export default function AdminMetricsPage() {
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [soldProperties, setSoldProperties] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [onboarding, setOnboarding] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ga4Data, setGa4Data] = useState<{ pageViews: number; events: Record<string, number> } | null>(null)
  const [ga4Loading, setGa4Loading] = useState(true)
  const [ga4Error, setGa4Error] = useState("")

  // Shared filters
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [propertyId, setPropertyId] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchGA4Data()
  }, [dateFrom, dateTo, propertyId, allProperties])

  async function fetchGA4Data() {
    try {
      setGa4Loading(true)
      setGa4Error("")

      const params = new URLSearchParams()
      // GA4 API expects YYYY-MM-DD or its relative keywords; default to last 30 days
      params.set("startDate", dateFrom || "30daysAgo")
      params.set("endDate", dateTo || "today")

      if (propertyId !== "all") {
        const selected = allProperties.find((p) => p.id === propertyId)
        if (selected?.slug) {
          params.set("pagePath", selected.slug)
        }
      }

      const res = await fetch(`/api/admin/ga4-metrics?${params.toString()}`)
      const result = await res.json()

      if (!res.ok) throw new Error(result.error || "Failed to load analytics")

      setGa4Data(result)
    } catch (err: any) {
      console.error("Error fetching GA4 data:", err)
      setGa4Error(err.message || "Could not load Google Analytics data")
    } finally {
      setGa4Loading(false)
    }
  }

  async function fetchData() {
    try {
      setLoading(true)

      const [propsRes, soldRes, inquiriesRes, onboardingRes] = await Promise.all([
        supabase.from("properties").select("id, property_name, slug").order("property_name"),
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
                <h2 className="text-xl font-bold text-caribbean-navy">All Inquiries</h2>
                <Info
                  className="h-4 w-4 text-gray-400 cursor-help"
                  title="Combines two sources into one total: general submissions from the /contact page, and property-specific 'Send Inquiry' submissions from individual property pages. Both are stored in the same database table. This is the definitive count - the Contact Form Submits and Property Inquiries (GA4) cards below track the same actions via Google Analytics and may run slightly lower."
                />
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
                <Info
                  className="h-4 w-4 text-gray-400 cursor-help"
                  title="A separate, dedicated intake form (with document uploads) that Ross shares directly with serious buyers. Unrelated to the contact form or All Inquiries above."
                />
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

        {/* Website Engagement (Google Analytics) */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-caribbean-navy mb-1">Website Engagement</h2>
          <p className="text-sm text-gray-500 mb-4">
            Google Analytics tracking - measures visitor behavior on the site. Hover any card
            below for details on what it tracks. For actual inquiry counts, All Inquiries above
            is the source of truth.
          </p>

          {ga4Error ? (
            <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
              <p className="text-sm text-red-600">{ga4Error}</p>
              <p className="text-xs text-gray-500 mt-1">
                Double check the GA4 environment variables and that the service account has Viewer
                access to the property.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Page Views</p>
                    <p className="text-3xl font-bold text-caribbean-navy">
                      {ga4Loading ? "..." : ga4Data?.pageViews ?? 0}
                    </p>
                  </div>
                  <div className="bg-caribbean-blue/20 p-3 rounded-full">
                    <Eye className="h-8 w-8 text-caribbean-navy" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {propertyId !== "all" ? "For selected property, " : "Site-wide, "}
                  matching current date range
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(EVENT_LABELS).map(([key, { label, icon: Icon, tooltip }]) => (
                  <div key={key} className="bg-white rounded-lg shadow-md p-4" title={tooltip}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-caribbean-gold" />
                      <p className="text-xs text-gray-600">{label}</p>
                      <Info className="h-3 w-3 text-gray-300 cursor-help ml-auto" />
                    </div>
                    <p className="text-2xl font-bold text-caribbean-navy">
                      {ga4Loading ? "..." : ga4Data?.events?.[key] ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}