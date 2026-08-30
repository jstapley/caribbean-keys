// @ts-nocheck
// Central SEO configuration for Caribbean Keys Real Estate

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://caribbean-keys.vercel.app'

export const DEFAULT_SEO = {
  title: 'Caribbean Keys Real Estate | Luxury Properties in Antigua',
  description: 'Find luxury real estate in Antigua with Ross Harris, your trusted Caribbean property expert. Browse villas, beachfront homes, and CIP-approved investment properties.',
  keywords: 'Antigua real estate, luxury properties Antigua, Caribbean real estate, CIP Antigua, Jolly Harbour properties, Ross Harris realtor',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Caribbean Keys Real Estate',
    images: [
      {
        url: `${BASE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Caribbean Keys Real Estate - Luxury Properties in Antigua',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Caribbean Keys Real Estate',
  description: 'Luxury real estate agency specializing in Antigua properties, CIP investments, and Caribbean lifestyle properties.',
  url: BASE_URL,
  telephone: '+17057255824',
  email: 'ross.caribbeankeys@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jolly Harbour',
    addressLocality: 'St. Mary',
    addressRegion: 'Antigua',
    addressCountry: 'AG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 17.0720,
    longitude: -61.8861,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:00',
  },
  sameAs: [
    'https://www.facebook.com/roscoha',
    'https://www.instagram.com/caribbean_keys/',
    'https://www.tiktok.com/@antigua.dreams',
    'https://www.youtube.com/@Caribbeankeysofficial',
  ],
  founder: {
    '@type': 'Person',
    name: 'Ross Harris',
    jobTitle: 'Real Estate Agent',
    telephone: '+17057255824',
    email: 'ross.caribbeankeys@gmail.com',
  },
}

export const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ross Harris',
  jobTitle: 'Real Estate Agent',
  worksFor: {
    '@type': 'Organization',
    name: 'Caribbean Keys Real Estate',
  },
  url: `${BASE_URL}/about`,
  telephone: '+17057255824',
  email: 'ross.caribbeankeys@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jolly Harbour',
    addressRegion: 'St. Mary, Antigua',
    addressCountry: 'AG',
  },
  sameAs: [
    'https://www.facebook.com/roscoha',
    'https://www.instagram.com/caribbean_keys/',
  ],
}

export function getPropertySchema(property: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.property_name,
    description: property.property_description,
    url: `${BASE_URL}/properties/${property.slug}`,
    image: property.images?.[0] || `${BASE_URL}/images/og-default.jpg`,
    offers: {
      '@type': 'Offer',
      price: property.price_asking,
      priceCurrency: 'USD',
      availability: property.listing_status === 'sold' 
        ? 'https://schema.org/SoldOut' 
        : 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.property_address || property.parish,
      addressLocality: property.parish,
      addressRegion: 'Antigua',
      addressCountry: 'AG',
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: property.square_footage ? {
      '@type': 'QuantitativeValue',
      value: property.square_footage,
      unitCode: 'FTK',
    } : undefined,
    geo: property.latitude && property.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    } : undefined,
  }
}