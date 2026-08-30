// @ts-nocheck
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleMapsScript } from "@/components/GoogleMapsScript";
import { ACTIVE_FONT, montserrat, poppins, workSans, inter, playfair } from "@/lib/fonts/font-config";
import { LOCAL_BUSINESS_SCHEMA, BASE_URL } from "@/lib/seo-config";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Caribbean Keys Real Estate | Luxury Properties in Antigua',
    template: '%s | Caribbean Keys Real Estate',
  },
  description: 'Find luxury real estate in Antigua with Ross Harris, your trusted Caribbean property expert. Browse villas, beachfront homes, and CIP-approved investment properties.',
  keywords: ['Antigua real estate', 'luxury properties Antigua', 'Caribbean real estate', 'CIP Antigua', 'Jolly Harbour properties', 'Ross Harris realtor', 'Antigua villas for sale'],
  authors: [{ name: 'Ross Harris', url: `${BASE_URL}/about` }],
  creator: 'Caribbean Keys Real Estate',
  publisher: 'Caribbean Keys Real Estate',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Caribbean Keys Real Estate',
    title: 'Caribbean Keys Real Estate | Luxury Properties in Antigua',
    description: 'Find luxury real estate in Antigua with Ross Harris. Browse villas, beachfront homes, and CIP-approved investment properties.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Caribbean Keys Real Estate - Luxury Properties in Antigua',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caribbean Keys Real Estate | Luxury Properties in Antigua',
    description: 'Find luxury real estate in Antigua with Ross Harris.',
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />
      </head>
      <body 
        className={`
          ${ACTIVE_FONT.font.variable}
          ${montserrat.variable}
          ${poppins.variable}
          ${workSans.variable}
          ${inter.variable}
          ${playfair.variable}
          ${ACTIVE_FONT.className}
        `}
      >
        <GoogleMapsScript />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}