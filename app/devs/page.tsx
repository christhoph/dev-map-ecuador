import type { Metadata } from 'next'

import { DevFilters } from '@/components/dev-filters'

// La página usa Supabase en runtime — no pre-renderizar en build
export const dynamic = 'force-dynamic'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { DevCardProfile, Technology, TechCategory, Availability } from '@/types'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Directorio — DevMap Ecuador',
  description:
    'Explora el talento tech ecuatoriano. Filtra por ciudad, tecnología y disponibilidad.',
}

// ─── Tipos para datos crudos de Supabase ──────────────────────────────────────

interface RawProfileRow {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  city: string
  years_experience: number | null
  availability: string
  created_at: string
  profile_technologies: {
    technologies: {
      id: string
      name: string
      category: string
    } | null
  }[]
}

interface RawTechRow {
  id: string
  name: string
  category: string
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function DevsPage() {
  const supabase = createServiceRoleClient()

  // Obtener todos los perfiles públicos con sus tecnologías
  const { data: rawProfiles } = await supabase
    .from('profiles')
    .select(
      `
      id, username, full_name, avatar_url, city,
      years_experience, availability, created_at,
      profile_technologies(
        technologies(id, name, category)
      )
    `
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  // Obtener el catálogo completo de tecnologías para el filtro
  const { data: rawTechs } = await supabase
    .from('technologies')
    .select('id, name, category')
    .order('name')

  // Transformar datos crudos → DevCardProfile[]
  const profiles: DevCardProfile[] = (
    (rawProfiles ?? []) as unknown as RawProfileRow[]
  ).map((raw) => ({
    id: raw.id,
    username: raw.username,
    full_name: raw.full_name,
    avatar_url: raw.avatar_url ?? undefined,
    city: raw.city,
    years_experience: raw.years_experience ?? undefined,
    availability: raw.availability as Availability,
    technologies: raw.profile_technologies
      .map((pt) => pt.technologies)
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category as TechCategory,
      })),
    created_at: raw.created_at,
  }))

  // Transformar tecnologías → Technology[]
  const technologies: Technology[] = (
    (rawTechs ?? []) as unknown as RawTechRow[]
  ).map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category as TechCategory,
  }))

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 min-h-[calc(100dvh-10rem)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Directorio
        </h1>
        <p className="mt-2 text-slate-500">
          Developers ecuatorianos disponibles para proyectos, empleo y
          colaboraciones.
        </p>
      </div>

      <DevFilters initialProfiles={profiles} technologies={technologies} />
    </main>
  )
}
