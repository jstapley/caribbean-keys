export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_name: string
          property_address: string
          parish: string
          property_type: string
          bedrooms: number | null
          bathrooms: number | null
          square_footage: number | null
          lot_size: string | null
          year_built: number | null
          price_paid: number | null
          price_asking: number | null
          price_orig_asking: number | null
          price_sold: number | null
          currency: string
          property_description: string | null
          short_description: string | null
          features: Json | null
          listing_status: string
          is_featured: boolean
          images: Json | null
          video_url: string | null
          virtual_tour_url: string | null
          slug: string
          meta_title: string | null
          meta_description: string | null
          amenities: Json | null
          nearby_attractions: string[] | null
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_name: string
          property_address: string
          parish: string
          property_type: string
          bedrooms?: number | null
          bathrooms?: number | null
          square_footage?: number | null
          lot_size?: string | null
          year_built?: number | null
          price_paid?: number | null
          price_asking?: number | null
          price_orig_asking?: number | null
          price_sold?: number | null
          currency?: string
          property_description?: string | null
          short_description?: string | null
          features?: Json | null
          listing_status?: string
          is_featured?: boolean
          images?: Json | null
          video_url?: string | null
          virtual_tour_url?: string | null
          slug?: string
          meta_title?: string | null
          meta_description?: string | null
          amenities?: Json | null
          nearby_attractions?: string[] | null
          display_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_name?: string
          property_address?: string
          parish?: string
          property_type?: string
          bedrooms?: number | null
          bathrooms?: number | null
          square_footage?: number | null
          lot_size?: string | null
          year_built?: number | null
          price_paid?: number | null
          price_asking?: number | null
          price_orig_asking?: number | null
          price_sold?: number | null
          currency?: string
          property_description?: string | null
          short_description?: string | null
          features?: Json | null
          listing_status?: string
          is_featured?: boolean
          images?: Json | null
          video_url?: string | null
          virtual_tour_url?: string | null
          slug?: string
          meta_title?: string | null
          meta_description?: string | null
          amenities?: Json | null
          nearby_attractions?: string[] | null
          display_order?: number
        }
      }
      property_inquiries: {
        Row: {
          id: string
          created_at: string
          property_id: string | null
          name: string
          email: string
          phone: string | null
          message: string | null
          inquiry_type: string | null
          ghl_contact_id: string | null
          synced_to_ghl: boolean
          synced_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          property_id?: string | null
          name: string
          email: string
          phone?: string | null
          message?: string | null
          inquiry_type?: string | null
          ghl_contact_id?: string | null
          synced_to_ghl?: boolean
          synced_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string | null
          name?: string
          email?: string
          phone?: string | null
          message?: string | null
          inquiry_type?: string | null
          ghl_contact_id?: string | null
          synced_to_ghl?: boolean
          synced_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_property_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
