'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { Availability } from '@/types'

interface ProjectInput {
  id?: string
  name: string
  description?: string
  url?: string
}

export interface SaveProfileInput {
  username: string
  full_name: string
  city: string
  bio?: string
  years_experience?: number
  availability: Availability
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
  avatar_url?: string
  technologies: string[]
  projects: ProjectInput[]
}

export interface SaveProfileResult {
  success: boolean
  username?: string
  error?: string
}

export async function saveProfile(data: SaveProfileInput): Promise<SaveProfileResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: 'No autenticado' }
  }

  const user = await currentUser()
  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  const email = user.emailAddresses[0]?.emailAddress ?? ''
  const clerkAvatarUrl = user.imageUrl ?? null

  const supabase = createServiceRoleClient()

  try {
    // 1. Upsert perfil (conflicto en clerk_user_id)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          clerk_user_id: userId,
          username: data.username,
          full_name: data.full_name,
          email,
          avatar_url: data.avatar_url || clerkAvatarUrl,
          city: data.city,
          bio: data.bio || null,
          years_experience: data.years_experience ?? null,
          availability: data.availability,
          github_url: data.github_url || null,
          linkedin_url: data.linkedin_url || null,
          portfolio_url: data.portfolio_url || null,
          is_public: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'clerk_user_id' }
      )
      .select('id, username')
      .single()

    if (profileError) {
      // Unique constraint en username
      if (profileError.code === '23505') {
        return { success: false, error: 'Este username ya está en uso' }
      }
      return { success: false, error: 'Error al guardar el perfil' }
    }

    const profileId = profile.id

    // 2. Reemplazar tecnologías (delete + insert)
    await supabase.from('profile_technologies').delete().eq('profile_id', profileId)

    if (data.technologies.length > 0) {
      const { error: techError } = await supabase.from('profile_technologies').insert(
        data.technologies.map((techId) => ({
          profile_id: profileId,
          technology_id: techId,
        }))
      )
      if (techError) {
        return { success: false, error: 'Error al guardar las tecnologías' }
      }
    }

    // 3. Reemplazar proyectos (delete + insert)
    await supabase.from('projects').delete().eq('profile_id', profileId)

    if (data.projects.length > 0) {
      const { error: projectError } = await supabase.from('projects').insert(
        data.projects.map((p) => ({
          profile_id: profileId,
          name: p.name,
          description: p.description || null,
          url: p.url || null,
        }))
      )
      if (projectError) {
        return { success: false, error: 'Error al guardar los proyectos' }
      }
    }

    revalidatePath(`/devs/${profile.username}`)
    revalidatePath('/devs')
    revalidatePath('/')

    return { success: true, username: profile.username }
  } catch {
    return { success: false, error: 'Error inesperado al guardar el perfil' }
  }
}
