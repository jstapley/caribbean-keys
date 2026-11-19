'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

const GA_MEASUREMENT_ID = 'G-YRCEVF9JJX'

export function GoogleAnalytics() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
