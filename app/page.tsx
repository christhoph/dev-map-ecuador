import type { Metadata } from 'next'
import Link from 'next/link'
import { Bot, MapPin, Users, Zap, TrendingUp, ArrowRight, Bug, Link2 } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'

import { DevCard } from '@/components/dev-card'
import { CTASection } from '@/components/cta-section'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import type { DevCardProfile, Availability, TechCategory } from '@/types'

// La landing usa Supabase en runtime
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'DevMap Ecuador — Directorio del talento tech ecuatoriano',
  description:
    'Descubre desarrolladores ecuatorianos, explora su stack tecnológico y conecta con el ecosistema tech del Ecuador.',
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

interface RawTechStatRow {
  technology_id: string
  technologies: { name: string } | null
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  '¿Cuántos devs React hay en Quito?',
  '¿Qué stack dominan los devs de Guayaquil?',
  '¿Cuántos devs están disponibles para freelance?',
]

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = createServiceRoleClient()

  let userId: string | null = null
  try {
    const session = await auth()
    userId = session.userId
  } catch {
    // treat as unauthenticated
  }

  let ctaProfile: { username: string } | null = null
  if (userId) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('clerk_user_id', userId)
      .single()
    ctaProfile = data
  }

  // Últimos 6 perfiles públicos
  const { data: rawProfiles } = await supabase
    .from('profiles')
    .select(
      `
      id, username, full_name, avatar_url, city,
      years_experience, availability, created_at,
      profile_technologies(technologies(id, name, category))
    `
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Stats: total devs + ciudades únicas
  const { count: totalDevs } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_public', true)

  // Ciudades únicas (usamos los perfiles ya cargados + query separada para el total)
  const { data: allCities } = await supabase
    .from('profiles')
    .select('city')
    .eq('is_public', true)

  const uniqueCities = new Set((allCities ?? []).map((p) => p.city)).size

  // Top 3 tecnologías más usadas
  const { data: rawTechStats } = await supabase
    .from('profile_technologies')
    .select('technology_id, technologies(name)')

  const techCount: Record<string, { name: string; count: number }> = {}
  for (const pt of (rawTechStats ?? []) as unknown as RawTechStatRow[]) {
    if (!pt.technologies?.name) continue
    const id = pt.technology_id
    if (!techCount[id]) {
      techCount[id] = { name: pt.technologies.name, count: 0 }
    }
    techCount[id].count++
  }
  const topTechs = Object.values(techCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  // % devs disponibles (buscando_empleo + abierto_oportunidades + freelance)
  const { count: availableDevs } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_public', true)
    .in('availability', ['buscando_empleo', 'abierto_oportunidades', 'freelance'])

  const availablePercent =
    totalDevs && totalDevs > 0
      ? Math.round(((availableDevs ?? 0) / totalDevs) * 100)
      : 0

  // Transformar perfiles recientes → DevCardProfile[]
  const recentProfiles: DevCardProfile[] = (
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

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b bg-gradient-to-b from-indigo-50 via-white to-blue-50">
        <div className="container mx-auto max-w-6xl px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4 text-xs bg-primary-foreground">
            Build with AI Challenge — GDG Quito 2026
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            El directorio del talento
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              tech ecuatoriano
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Encuentra desarrolladores ecuatorianos, explora sus stacks y
            conecta con el ecosistema. Potenciado con inteligencia artificial.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Crear mi perfil
            </Link>
            <Link
              href="/devs"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Explorar devs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ecosystem Stats ───────────────────────────────────────────────── */}
      <section className="border-b bg-muted/20 py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Total devs — azul GDG */}
            <div className="flex flex-col items-center gap-1 rounded-xl border border-blue-100 bg-blue-50 p-6 text-center">
              <Users className="h-6 w-6 text-blue-600" />
              <p className="text-3xl font-bold text-blue-900">{totalDevs ?? 0}</p>
              <p className="text-xs text-blue-600/70">Developers</p>
            </div>

            {/* Ciudades — rojo GDG */}
            <div className="flex flex-col items-center gap-1 rounded-xl border border-red-100 bg-red-50 p-6 text-center">
              <MapPin className="h-6 w-6 text-red-500" />
              <p className="text-3xl font-bold text-red-900">{uniqueCities}</p>
              <p className="text-xs text-red-500/70">Ciudades</p>
            </div>

            {/* Top tecnologías — amarillo GDG */}
            <div className="flex flex-col items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 p-6 text-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
              <div className="flex flex-wrap justify-center gap-1">
                {topTechs.length > 0 ? (
                  topTechs.map((t) => (
                    <Badge key={t.name} className="border-yellow-200 bg-yellow-100 text-xs text-yellow-800 hover:bg-yellow-100">
                      {t.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm font-bold text-yellow-900">—</p>
                )}
              </div>
              <p className="text-xs text-yellow-600/70">Top tecnologías</p>
            </div>

            {/* % disponibles — verde GDG */}
            <div className="flex flex-col items-center gap-1 rounded-xl border border-green-100 bg-green-50 p-6 text-center">
              <Zap className="h-6 w-6 text-green-600" />
              <p className="text-3xl font-bold text-green-900">{availablePercent}%</p>
              <p className="text-xs text-green-600/70">Disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Últimos perfiles ──────────────────────────────────────────────── */}
      <section className="border-b py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Últimos perfiles
            </h2>
            {recentProfiles.length > 0 && (
              <Link
                href="/devs"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'gap-1 text-muted-foreground'
                )}
              >
                Ver todos
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {recentProfiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentProfiles.map((profile) => (
                <DevCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <p className="text-base font-medium">El directorio está listo para crecer</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sé el primero en registrar tu perfil y aparecer aquí.
              </p>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: 'sm' }), 'mt-5')}
              >
                Crear mi perfil
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Ask AI Preview ────────────────────────────────────────────────── */}
      <section className="border-b bg-slate-900 py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="flex-1 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                  <Bot className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Pregúntale a la IA
                  </h2>
                  <p className="mt-2 text-slate-400">
                    Nuestro asistente tiene acceso a los datos reales del
                    directorio. Hazle preguntas sobre el ecosistema tech
                    ecuatoriano y obtén respuestas al instante.
                  </p>
                </div>
                <Link
                  href="/ask"
                  className={cn(buttonVariants({ size: 'sm' }), 'gap-2 bg-indigo-500 hover:bg-indigo-600 text-white')}
                >
                  <Bot className="h-4 w-4" />
                  Pregúntale a la IA
                </Link>
              </div>

              {/* Preguntas de ejemplo */}
              <div className="flex-1 space-y-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <Link
                    key={q}
                    href={`/ask?q=${encodeURIComponent(q)}`}
                    className="group flex items-center justify-between cursor-pointer bg-slate-700/50 hover:bg-indigo-500/20 hover:border-indigo-400 border border-slate-600 text-slate-300 hover:text-indigo-300 transition-all duration-200 rounded-lg px-4 py-3 text-sm"
                  >
                    <span>&ldquo;{q}&rdquo;</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feedback nudge ───────────────────────────────────────────────── */}
      <div className="border-b py-6 text-center">
        <p className="text-sm text-slate-500">
          ¿Encontraste algo? →{' '}
          <Link
            href="/feedback"
            className="text-slate-500 underline-offset-4 hover:text-indigo-600 hover:underline"
          >
            Déjanos tu feedback
          </Link>
        </p>
      </div>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <CTASection profile={ctaProfile} isAuthenticated={!!userId} />
    </main>
  )
}
