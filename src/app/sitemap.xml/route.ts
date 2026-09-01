// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://caribbean-keys.vercel.app'

// Force this route to run fresh on every request instead of being
// statically generated at build time (which was serving stale/archived
// properties for hours after they were archived).
export const dynamic = 'force-dynamic'

export async function GET() {
  // Fetch all non-archived properties (sold properties stay indexed for SEO/social proof)
  const { data: properties } = await supabase
    .from('properties')
    .select('slug, updated_at')
    .eq('is_archived', false)

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/properties', priority: '0.9', changefreq: 'daily' },
    { url: '/projects/the-gardens', priority: '0.9', changefreq: 'weekly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/st-john', priority: '0.6', changefreq: 'monthly' },
    { url: '/locations/st-peter', priority: '0.6', changefreq: 'monthly' },
    { url: '/locations/st-philip', priority: '0.6', changefreq: 'monthly' },
    { url: '/locations/st-paul', priority: '0.6', changefreq: 'monthly' },
    { url: '/locations/st-mary', priority: '0.6', changefreq: 'monthly' },
    { url: '/locations/st-george', priority: '0.6', changefreq: 'monthly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${properties?.map(property => `
  <url>
    <loc>${BASE_URL}/properties/${property.slug}</loc>
    <lastmod>${property.updated_at ? new Date(property.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') || ''}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    },
  })
}