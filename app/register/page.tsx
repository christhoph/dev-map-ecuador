import type { Metadata } from 'next'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { ProfileForm } from '@/components/profile-form'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { MAX_USERNAME_LENGTH } from '@/lib/constants'
import type { Technology, TechCategory, Availability } from '@/types'
import type { InitialProfile } from '@/components/profile-form'

export const metadata: Metadata = {
  title: 'Mi perfil — DevMap Ecuador',
  description: 'Crea o edita tu perfil en DevMap Ecuador. Forma parte del directorio del talento tech ecuatoriano.',
}

export default async function RegistroPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const supabase = createServiceRoleClient()

  // Cargar catálogo de tecnologías
  const { data: rawTechs } = await supabase
    .from('technologies')
    .select('id, name, category')
    .order('category')
    .order('name')

  const technologies: Technology[] = (rawTechs ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category as TechCategory,
  }))

  // Cargar perfil existente del usuario (si tiene)
  const { data: profileData } = await supabase
    .from('profiles')
    .select(
      `
      username, full_name, city, bio, years_experience,
      availability, github_url, linkedin_url, portfolio_url, avatar_url,
      profile_technologies(technology_id),
      projects(id, name, description, url),
      work_experience(id, company, role, start_date, end_date, is_current, description)
    `
    )
    .eq('clerk_user_id', userId)
    .maybeSingle()

  // Convierte YYYY-MM-DD a YYYY-MM para <input type="month">
  const toMonthValue = (date: string | null): string | undefined => {
    if (!date) return undefined
    return date.slice(0, 7)
  }

  const initialProfile: InitialProfile | null = profileData
    ? {
        username: profileData.username,
        full_name: profileData.full_name,
        city: profileData.city,
        bio: profileData.bio ?? undefined,
        years_experience: profileData.years_experience ?? undefined,
        availability: profileData.availability as Availability,
        github_url: profileData.github_url ?? undefined,
        linkedin_url: profileData.linkedin_url ?? undefined,
        portfolio_url: profileData.portfolio_url ?? undefined,
        avatar_url: profileData.avatar_url ?? undefined,
        technologies: profileData.profile_technologies.map(
          (pt: { technology_id: string }) => pt.technology_id
        ),
        projects: profileData.projects.map(
          (p: { id: string; name: string; description: string | null; url: string | null }) => ({
            id: p.id,
            name: p.name,
            description: p.description ?? undefined,
            url: p.url ?? undefined,
          })
        ),
        work_experience: (profileData.work_experience as {
          id: string
          company: string
          role: string
          start_date: string
          end_date: string | null
          is_current: boolean
          description: string | null
        }[])
          .sort((a, b) => b.start_date.localeCompare(a.start_date))
          .map((w) => ({
            id: w.id,
            company: w.company,
            role: w.role,
            start_date: toMonthValue(w.start_date) ?? '',
            end_date: toMonthValue(w.end_date),
            is_current: w.is_current,
            description: w.description ?? undefined,
          })),
      }
    : null

  // Sugerir username desde el email si es primera vez
  const suggestedUsername =
    !initialProfile && user?.emailAddresses[0]?.emailAddress
      ? user.emailAddresses[0].emailAddress
          .split('@')[0]
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .slice(0, MAX_USERNAME_LENGTH)
      : undefined

  return (
    <main className="container mx-auto max-w-2xl py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          {initialProfile ? 'Editar perfil' : 'Crea tu perfil'}
        </h1>
        <p className="mt-2 text-slate-500">
          {initialProfile
            ? 'Mantén tu información actualizada para el directorio.'
            : 'Sé parte del mapa del talento tech ecuatoriano.'}
        </p>
      </div>

      <ProfileForm
        technologies={technologies}
        initialProfile={initialProfile}
        suggestedUsername={suggestedUsername}
      />
    </main>
  )
}
