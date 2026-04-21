// Tipos generados por Supabase CLI
// Para regenerar: npx supabase gen types typescript --project-id [PROJECT_ID] > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Placeholder — reemplazar con tipos generados por Supabase CLI
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          email: string
          avatar_url: string | null
          city: string
          bio: string | null
          years_experience: number | null
          availability: string
          github_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      technologies: {
        Row: {
          id: string
          name: string
          category: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['technologies']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['technologies']['Insert']>
      }
      profile_technologies: {
        Row: {
          profile_id: string
          technology_id: string
        }
        Insert: Database['public']['Tables']['profile_technologies']['Row']
        Update: Partial<Database['public']['Tables']['profile_technologies']['Insert']>
      }
      projects: {
        Row: {
          id: string
          profile_id: string
          name: string
          description: string | null
          url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
