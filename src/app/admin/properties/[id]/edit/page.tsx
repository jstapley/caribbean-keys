// @ts-nocheck
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditPropertyClient } from './EditPropertyClient'

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !property) {
    notFound()
  }

  return <EditPropertyClient property={property} />
}
