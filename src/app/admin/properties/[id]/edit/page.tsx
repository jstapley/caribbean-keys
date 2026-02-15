// @ts-nocheck
import { EditPropertyClient } from './EditPropertyClient'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15+, params is a Promise
  const { id } = await params
  
  // For now, just test if page loads
  const mockProperty = {
    id: id,
    property_name: 'Test Property',
    property_address: '123 Test St',
    parish: 'St. John',
    property_type: 'Villa',
    listing_status: 'active',
    is_featured: false,
    features: [],
    images: [],
  }

  return <EditPropertyClient property={mockProperty} />
}