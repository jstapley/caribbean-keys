// @ts-nocheck
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditPropertyClient } from './EditPropertyClient'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 16, params is a Promise that must be awaited
  const { id } = await params
  
  const supabase = await createClient()
  
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !property) {
    notFound()
  }

  return <EditPropertyClient property={property} />
}