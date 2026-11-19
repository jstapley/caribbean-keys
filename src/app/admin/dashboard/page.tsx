// @ts-nocheck
"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Calendar,
  Percent,
  MessageSquare,
  Star,
  ArrowRight,
  Eye,
  Phone,
  Send,
  Info,
  Building2,
  DollarSign,
  Clock,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

// ─── Config ──────────────────────────────────────────────────────────────────
const TABS = ["Sugar Ridge", "The Gardens", "Private Properties"] as const
type Tab = (typeof TABS)[number]

// Annual targets — edit these as needed
const SALES_TARGET = 10
const REVENUE_TARGET = 5_000_000

// Project page path for each tab (null = no dedicated project page yet)
const TAB_PROJECT_PATHS: Record<Tab, string | null> = {
  "Sugar Ridge": "/projects/sugar-ridge",
  "The Gardens": "/projects/the-gardens",
  "Private Properties": null,
}

// GA4 event labels
const EVENT_LABELS: Record<string, { label: string; icon: any; tooltip: string }> = {
  whatsapp_click: {
    label: "WhatsApp Clicks",
    icon: MessageSquare,
    tooltip: "Fires when a visitor clicks the WhatsApp button.",
  },
  phone_click: {
    label: "Phone Clicks",
    icon: Phone,
    tooltip: "Fires when a visitor taps a phone number link.",
  },
  contact_form_submit: {
    label: "Contact Form Submits",
    icon: Send,
    tooltip: "Fires on a successful /contact page submission.",
  },
  property_inquiry_submit: {
    label: "Property Inquiries (GA4)",
    icon: Send,
    tooltip: "Fires when a visitor submits the Send Inquiry form on a property page.",
  },
  share_property: {
    label: "Property Shares",
    icon: ArrowRight,
    tooltip: "Fires when a visitor uses the Share Property button.",
  },
  social_landing_view: {
    label: "Social Landing Views",
    icon: Eye,
    tooltip: "Views of a property's /p/[slug] social landing page.",
  },
  view_full_listing_click: {
    label: "View Full Listing Clicks",
    icon: Eye,
    tooltip: "Fires when a visitor clicks through from a social landing page to the full listing.",
  },
  visualizer_generate: {
    label: "Visualizer Uses",
    icon: Star,
    tooltip: "Fires when a visitor generates an AI room visualization.",
  },
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Sugar Ridge")
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [soldProperties, setSoldProperties] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ga4Data, setGa4Data] = useState<{ pageViews: number; events: Record<string, number> } | null>(null)
  const [ga4Loading, setGa4Loading] = useState(true)
  const [ga4Error, setGa4Error] = useState("")

  // Load Supabase data once on mount
  useEffect(() => { fetchData() }, [])

  // Re-fetch GA4 whenever the active tab changes or after Supabase data finishes loading
  useEffect(() => {
    if (!loading) fetchGA4DataForTab(activeTab)
  }, [activeTab, loading])

  async function fetchGA4DataForTab(tab: Tab) {
    try {
      setGa4Loading(true)
      setGa4Error("")

      // Gather all page paths for this tab's properties
      const tabProps = allProperties.filter((p) => p.property_tag === tab)
      const paths: string[] = []

      tabProps.forEach((p) => {
        if (p.slug) {
          paths.push(`/properties/${p.slug}`)  // main listing page
          paths.push(`/p/${p.slug}`)            // social landing page
        }
      })

      // Add the tab's project page if it exists
      const projectPath = TAB_PROJECT_PATHS[tab]
      if (projectPath) paths.push(projectPath)

      const params = new URLSearchParams({ startDate: "30daysAgo", endDate: "today" })
      if (paths.length > 0) params.set("pagePaths", paths.join(","))

      const res = await fetch(`/api/admin/ga4-metrics?${params.toString()}`)
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to load analytics")
      setGa4Data(result)
    } catch (err: any) {
      setGa4Error(err.message || "Could not load Google Analytics data")
    } finally {
      setGa4Loading(false)
    }
  }

  async function fetchData() {
    try {
      setLoading(true)
      const [propsRes, soldRes, inquiriesRes] = await Promise.all([
        supabase.from("properties").select("*").eq("is_archived", false),
        supabase.from("properties").select("*").eq("listing_status", "sold"),
        supabase.from("property_inquiries").select("*"),
      ])
      if (propsRes.data) setAllProperties(propsRes.data)
      if (soldRes.data) setSoldProperties(soldRes.data)
      if (inquiriesRes.data) setInquiries(inquiriesRes.data)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  // ── Annual targets (global) ─────────────────────────────────────────────
  const thisYearStart = `${new Date().getFullYear()}-01-01`
  const soldThisYear = soldProperties.filter(
    (p) => p.sold_date && p.sold_date >= thisYearStart
  )
  const revenueThisYear = soldThisYear.reduce((sum, p) => sum + (p.price_sold || 0), 0)
  const salesProgress = Math.min(100, Math.round((soldThisYear.length / SALES_TARGET) * 100))
  const revenueProgress = Math.min(100, Math.round((revenueThisYear / REVENUE_TARGET) * 100))

  // ── Tab-filtered data ───────────────────────────────────────────────────
  const tabProperties = useMemo(
    () => allProperties.filter((p) => p.property_tag === activeTab),
    [allProperties, activeTab]
  )

  const tabAvailable = tabProperties.filter((p) =>
    ["active", "new"].includes(p.listing_status)
  )
  const tabUnderContract = tabProperties.filter(
    (p) => p.listing_status === "under_contract"
  )
  const tabSoldDetailed = useMemo(
    () =>
      soldProperties
        .filter((p) => p.property_tag === activeTab)
        .map((p) => {
          const originalAsk = p.price_orig_asking || p.price_asking
          const ratio =
            originalAsk && p.price_sold ? (p.price_sold / originalAsk) * 100 : null
          return { ...p, _originalAsk: originalAsk, _ratio: ratio }
        })
        .sort((a, b) => (b.sold_date || "").localeCompare(a.sold_date || "")),
    [soldProperties, activeTab]
  )

  const revenueToDate = tabSoldDetailed.reduce((sum, p) => sum + (p.price_sold || 0), 0)
  const pipelineValue = tabAvailable.reduce((sum, p) => sum + (p.price_asking || 0), 0)
  const avgSalePrice = tabSoldDetailed.length ? revenueToDate / tabSoldDetailed.length : null
  const domValues = tabSoldDetailed
    .map((p) => p.days_on_market)
    .filter((d) => d != null && d !== undefined)
  const avgDOM = domValues.length
    ? Math.round(domValues.reduce((a, b) => a + b, 0) / domValues.length)
    : null
  const avgRatio = tabSoldDetailed.length
    ? (
        tabSoldDetailed
          .filter((p) => p._ratio !== null)
          .reduce((sum, p) => sum + p._ratio, 0) /
        tabSoldDetailed.filter((p) => p._ratio !== null).length
      ).toFixed(1)
    : null

  const tabPropertyIds = useMemo(
    () => new Set(tabProperties.map((p) => p.id)),
    [tabProperties]
  )
  const tabInquiries = inquiries.filter((i) => tabPropertyIds.has(i.property_id))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Dashboard</h1>
          <p className="text-gray-600">Portfolio performance and sales tracking</p>
        </div>

        {/* ── Annual Targets (global) ─────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-caribbean-navy mb-4">
            Annual Targets ({new Date().getFullYear()})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Properties sold */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-600">Properties Sold</p>
                <span className="text-xs text-gray-400">Target: {SALES_TARGET}</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? "..." : soldThisYear.length}
                </p>
                <p className="text-sm text-gray-500 pb-1">/ {SALES_TARGET} properties</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div
                  className="bg-caribbean-gold h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${salesProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {salesProgress}% of annual target · {Math.max(0, SALES_TARGET - soldThisYear.length)} remaining
              </p>
            </div>

            {/* Revenue */}
            <div className="bg-caribbean-navy rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white/70">Revenue to Date</p>
                <span className="text-xs text-white/40">Target: {formatPrice(REVENUE_TARGET)}</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <p className="text-3xl font-bold text-caribbean-gold">
                  {loading ? "..." : formatPrice(revenueThisYear)}
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                <div
                  className="bg-caribbean-gold h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${revenueProgress}%` }}
                />
              </div>
              <p className="text-xs text-white/50">
                {revenueProgress}% of target · {formatPrice(Math.max(0, REVENUE_TARGET - revenueThisYear))} remaining
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-1" aria-label="Portfolio tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold transition-colors -mb-px border-b-2 ${
                  activeTab === tab
                    ? "border-caribbean-gold text-caribbean-gold"
                    : "border-transparent text-gray-500 hover:text-caribbean-navy hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Inventory overview ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</p>
              <Building2 className="h-4 w-4 text-caribbean-gold" />
            </div>
            <p className="text-2xl font-bold text-caribbean-navy">
              {loading ? "..." : tabProperties.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Available</p>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-700">
              {loading ? "..." : tabAvailable.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Under Contract</p>
              <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-700">
              {loading ? "..." : tabUnderContract.length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sold</p>
              <div className="w-2 h-2 rounded-full bg-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-700">
              {loading ? "..." : tabSoldDetailed.length}
            </p>
          </div>
        </div>

        {/* ── Revenue metrics ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue Sold</p>
              <DollarSign className="h-4 w-4 text-caribbean-gold" />
            </div>
            <p className="text-lg font-bold text-caribbean-navy">
              {loading ? "..." : revenueToDate > 0 ? formatPrice(revenueToDate) : "—"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pipeline Value</p>
              <TrendingUp className="h-4 w-4 text-caribbean-gold" />
            </div>
            <p className="text-lg font-bold text-caribbean-navy">
              {loading ? "..." : pipelineValue > 0 ? formatPrice(pipelineValue) : "—"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Sale Price</p>
              <Percent className="h-4 w-4 text-caribbean-gold" />
            </div>
            <p className="text-lg font-bold text-caribbean-navy">
              {loading ? "..." : avgSalePrice ? formatPrice(avgSalePrice) : "—"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Days on Market</p>
              <Clock className="h-4 w-4 text-caribbean-gold" />
            </div>
            <p className="text-lg font-bold text-caribbean-navy">
              {loading ? "..." : avgDOM ?? "—"}
            </p>
          </div>
        </div>

        {/* ── Sold properties table ───────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-caribbean-navy mb-4">
            Sold Properties — {activeTab}
          </h2>
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
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : tabSoldDetailed.length > 0 ? (
                    tabSoldDetailed.map((p) => (
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
                          ) : "—"}
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
                        No sold properties for {activeTab} yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {tabSoldDetailed.length > 0 && avgRatio && (
            <p className="mt-2 text-xs text-gray-500">
              Avg list-to-sale ratio: <span className="font-semibold">{avgRatio}%</span>
            </p>
          )}
        </div>

        {/* ── Inquiries for this tab ──────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-caribbean-navy">Inquiries — {activeTab}</h2>
            <Info
              className="h-4 w-4 text-gray-400 cursor-help"
              title="Property inquiries submitted via the Send Inquiry form on individual property pages, matched to this portfolio."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-4xl font-bold text-caribbean-navy mb-1">
                {loading ? "..." : tabInquiries.length}
              </p>
              <p className="text-sm text-gray-600 mb-4">Total inquiries for {activeTab}</p>
              <Link href="/admin/clients">
                <Button variant="outline" size="sm">
                  View All Clients
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Website Engagement (GA4 — per tab) ─────────────────────── */}
        <div className="mt-2">
          <h2 className="text-lg font-bold text-caribbean-navy mb-1">
            Website Engagement — {activeTab}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Google Analytics — last 30 days, filtered to {activeTab} property pages
            {TAB_PROJECT_PATHS[activeTab] ? ` and project page` : ""}.
            Hover any card for details.{" "}
            <span className="text-amber-600 font-medium">Note: GA4 data is processed with a 24–48 hr delay — recent activity will appear tomorrow.</span>
          </p>

          {ga4Error ? (
            <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
              <p className="text-sm text-red-600">{ga4Error}</p>
              <p className="text-xs text-gray-500 mt-1">
                Check GA4 environment variables and service account permissions.
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
