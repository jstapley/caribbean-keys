// @ts-nocheck
// Central GA4 event tracking helper

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Predefined events for consistency
export const GA = {
  // Contact events
  contactFormSubmit: () => trackEvent('contact_form_submit', { event_category: 'lead' }),
  propertyInquirySubmit: (propertyName: string) => trackEvent('property_inquiry_submit', { 
    event_category: 'lead',
    property_name: propertyName 
  }),

  // Click events
  whatsappClick: () => trackEvent('whatsapp_click', { event_category: 'engagement' }),
  phoneClick: () => trackEvent('phone_click', { event_category: 'engagement' }),
  emailClick: () => trackEvent('email_click', { event_category: 'engagement' }),

  // Property events
  propertyView: (propertyName: string, parish: string) => trackEvent('property_view', {
    event_category: 'property',
    property_name: propertyName,
    parish: parish
  }),
  shareProperty: (propertyName: string) => trackEvent('share_property', {
    event_category: 'engagement',
    property_name: propertyName
  }),

  // Social landing page
  socialLandingView: (propertyName: string) => trackEvent('social_landing_view', {
    event_category: 'social',
    property_name: propertyName
  }),
  viewFullListingClick: (propertyName: string) => trackEvent('view_full_listing_click', {
    event_category: 'social',
    property_name: propertyName
  }),

  // Visualizer
  visualizerGenerate: (roomType: string, style: string) => trackEvent('visualizer_generate', {
    event_category: 'tool',
    room_type: roomType,
    style: style
  }),
}