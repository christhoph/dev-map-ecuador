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
          clerk_user_id: string
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
        Insert: {
          clerk_user_id: string
          username: string
          full_name: string
          email: string
          avatar_url?: string | null
          city: string
          bio?: string | null
          years_experience?: number | null
          availability?: string
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          is_public?: boolean
          updated_at?: string
        }
        Update: {
          clerk_user_id?: string
          username?: string
          full_name?: string
          email?: string
          avatar_url?: string | null
          city?: string
          bio?: string | null
          years_experience?: number | null
          availability?: string
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          is_public?: boolean
          updated_at?: string
        }
      }
      technologies: {
        Row: {
          id: string
          name: string
          category: string
          created_at: string
        }
        Insert: {
          name: string
          category: string
        }
        Update: {
          name?: string
          category?: string
        }
      }
      profile_technologies: {
        Row: {
          profile_id: string
          technology_id: string
        }
        Insert: {
          profile_id: string
          technology_id: string
        }
        Update: {
          profile_id?: string
          technology_id?: string
        }
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
        Insert: {
          profile_id: string
          name: string
          description?: string | null
          url?: string | null
        }
        Update: {
          profile_id?: string
          name?: string
          description?: string | null
          url?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
