// Antigua Parishes
export const PARISHES = [
  'St. John\'s',
  'St. Peter',
  'St. Philip',
  'St. Paul',
  'St. Mary',
  'St. George',
] as const

export type Parish = typeof PARISHES[number]

// Property Types
export const PROPERTY_TYPES = [
  'Villa',
  'Condo/Apartment',
  'Land',
  'Commercial',
  'Townhouse',
  'Beachfront',
] as const

export type PropertyType = typeof PROPERTY_TYPES[number]

// Listing Status
export const LISTING_STATUS = {
  NEW: 'new',
  ACTIVE: 'active',
  UNDER_CONTRACT: 'under_contract',
  SOLD: 'sold',
} as const

export type ListingStatus = typeof LISTING_STATUS[keyof typeof LISTING_STATUS]

// Property Features (common amenities)
export const PROPERTY_FEATURES = [
  'Ocean View',
  'Private Pool',
  'Gated Community',
  'Air Conditioning',
  'Ceiling Fans',
  'Modern Kitchen',
  'Granite/Marble Countertops',
  'Walk-in Closets',
  'Covered Parking',
  'Garage',
  '24/7 Security',
  'Garden',
  'Balcony/Terrace',
  'Sea Access',
  'Beach Access',
  'Furnished',
  'Unfurnished',
  'Solar Panels',
  'Generator',
  'Water Tank',
  'Laundry Room',
  'Guest House',
  'Office/Study',
  'Gym',
  'Tennis Court',
  'Boat Dock',
] as const

// Bedroom options
export const BEDROOM_OPTIONS = [
  { value: '1', label: '1 Bedroom' },
  { value: '2', label: '2 Bedrooms' },
  { value: '3', label: '3 Bedrooms' },
  { value: '4', label: '4 Bedrooms' },
  { value: '5', label: '5+ Bedrooms' },
]

// Bathroom options
export const BATHROOM_OPTIONS = [
  { value: '1', label: '1 Bathroom' },
  { value: '1.5', label: '1.5 Bathrooms' },
  { value: '2', label: '2 Bathrooms' },
  { value: '2.5', label: '2.5 Bathrooms' },
  { value: '3', label: '3 Bathrooms' },
  { value: '3.5', label: '3.5 Bathrooms' },
  { value: '4', label: '4+ Bathrooms' },
]

// Price ranges for filtering
export const PRICE_RANGES = [
  { value: '0-250000', label: 'Under $250K' },
  { value: '250000-500000', label: '$250K - $500K' },
  { value: '500000-750000', label: '$500K - $750K' },
  { value: '750000-1000000', label: '$750K - $1M' },
  { value: '1000000-1500000', label: '$1M - $1.5M' },
  { value: '1500000-2000000', label: '$1.5M - $2M' },
  { value: '2000000-999999999', label: '$2M+' },
]

// Site configuration
export const SITE_CONFIG = {
  name: 'Caribbean Keys Real Estate',
  description: 'Your trusted real estate partner in Antigua',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://caribbeankeys-realestate.com',
  ogImage: '/og-image.jpg',
  links: {
    facebook: 'https://facebook.com/caribbeankeys',
    instagram: 'https://instagram.com/caribbeankeys',
    twitter: 'https://twitter.com/caribbeankeys',
  },
  contact: {
    email: 'info@caribbeankeysrealestate.com',
    phone: '+1 (268) XXX-XXXX',
    address: 'Address Line, St. John\'s, Antigua',
  },
}

// Image upload configuration
export const IMAGE_CONFIG = {
  maxFiles: 15,
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}

// Video upload configuration
export const VIDEO_CONFIG = {
  maxSize: 50 * 1024 * 1024, // 50MB
  acceptedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
}

// Pagination
export const ITEMS_PER_PAGE = 12

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'bedrooms', label: 'Bedrooms' },
  { value: 'square-footage', label: 'Square Footage' },
]
