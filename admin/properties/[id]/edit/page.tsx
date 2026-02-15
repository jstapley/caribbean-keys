import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditPropertyClient } from "./EditPropertyClient"

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const supabase = createClient()

  // Fetch property by ID
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