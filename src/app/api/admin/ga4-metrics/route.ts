// @ts-nocheck
import { NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { createClient } from '@/lib/supabase/server'

const TRACKED_EVENTS = [
  'contact_form_submit',
  'property_inquiry_submit',
  'whatsapp_click',
  'phone_click',
  'share_property',
  'social_landing_view',
  'view_full_listing_click',
  'visualizer_generate',
]

function getClient() {
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Vercel env vars store the key as a single line with literal \n sequences -
      // convert those back into real newlines before handing it to the client.
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
  })
}

export async function GET(request: Request) {
  try {
    // Only logged-in admins should be able to pull analytics data
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || '30daysAgo'
    const endDate = searchParams.get('endDate') || 'today'
    const pagePathContains = searchParams.get('pagePath') || null

    const propertyId = `properties/${process.env.GA4_PROPERTY_ID}`
    const analyticsDataClient = getClient()

    const pagePathFilter = pagePathContains
      ? {
          filter: {
            fieldName: 'pagePath',
            stringFilter: { matchType: 'CONTAINS', value: pagePathContains },
          },
        }
      : undefined

    // Total page views in range (optionally scoped to one property's pages)
    const [pageViewsReport] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: pagePathFilter,
    })

    const pageViews = Number(pageViewsReport.rows?.[0]?.metricValues?.[0]?.value || 0)

    // Custom event counts in range (optionally scoped to one property's pages)
    const [eventsReport] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'eventName',
                inListFilter: { values: TRACKED_EVENTS },
              },
            },
            ...(pagePathFilter ? [pagePathFilter] : []),
          ],
        },
      },
    })

    const events: Record<string, number> = Object.fromEntries(
      TRACKED_EVENTS.map((name) => [name, 0])
    )

    eventsReport.rows?.forEach((row) => {
      const eventName = row.dimensionValues?.[0]?.value
      const count = Number(row.metricValues?.[0]?.value || 0)
      if (eventName && eventName in events) {
        events[eventName] = count
      }
    })

    return NextResponse.json({ pageViews, events })
  } catch (err: any) {
    console.error('GA4 metrics API error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', detail: err.message },
      { status: 500 }
    )
  }
}