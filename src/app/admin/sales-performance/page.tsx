// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin/AdminNav"
import { TrendingUp, Calendar, Percent } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default function AdminSalesPerformancePage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSoldProperties() {
      try {
        setLoading(true)
        // Include archived properties here - a sold listing might get
        // archived later, but its sales history should still count
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("listing_status", "sold")
          .order("sold_date", { ascending: false })

        if (error) {
          console.error("Error fetching sold properties:", error)
        } else {
          setProperties(data || [])
        }
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSoldProperties()
  }, [])

  const getOriginalAsk = (p: any) => p.price_orig_asking || p.price_asking

  const withRatio = properties.map((p) => {
    const originalAsk = getOriginalAsk(p)
    const ratio = originalAsk && p.price_sold ? (p.price_sold / originalAsk) * 100 : null
    return { ...p, _originalAsk: originalAsk, _ratio: ratio }
  })

  const totalSold = properties.length

  const daysOnMarketValues = properties
    .map((p) => p.days_on_market)
    .filter((d) => d !== null && d !== undefined)
  const avgDaysOnMarket = daysOnMarketValues.length
    ? Math.round(daysOnMarketValues.reduce((a, b) => a + b, 0) / daysOnMarketValues.length)
    : null

  const ratioValues = withRatio.map((p) => p._ratio).filter((r) => r !== null)
  const avgRatio = ratioValues.length
    ? (ratioValues.reduce((a, b) => a + b, 0) / ratioValues.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-caribbean-navy mb-2">Sales Performance</h1>
          <p className="text-gray-600">Track record for sold properties</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sold</p>
                <p className="text-3xl font-bold text-caribbean-navy">
                  {loading ? "..." : totalSold}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">All time closed sales</p>
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
            <p className="mt-4 text-sm text-gray-600">Across properties with recorded dates</p>
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
            <p className="mt-4 text-sm text-gray-600">Sale price vs. original asking price</p>
          </div>
        </div>

        {/* Sold Properties Table */}
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
                      Loading sales history...
                    </td>
                  </tr>
                ) : withRatio.length > 0 ? (
                  withRatio.map((p) => (
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
                          <span
                            className={`font-semibold ${
                              p._ratio >= 100 ? "text-green-600" : "text-gray-700"
                            }`}
                          >
                            {p._ratio.toFixed(1)}%
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {p.days_on_market ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {p.sold_date ? new Date(p.sold_date).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="text-center py-12">
                        <TrendingUp className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No sold properties yet
                        </h3>
                        <p className="text-gray-600">
                          Mark a property as "Sold" with a sale price and date to see it here.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}