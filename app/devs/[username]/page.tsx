import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Globe, MapPin, Briefcase, Pencil, ExternalLink, Link2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { AVAILABILITY_LABELS, AVAILABILITY_COLORS } from '@/lib/constants'
import { getInitials, cn } from '@/lib/utils'
import type { TechCategory, Availability } from '@/types'

// ─── Tipos locales ────────────────────────────────────────────────────────────

interface ProfileRow {
  id: string
  username: string
  full_name: string
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
  clerk_user_id: string
  profile_technologies: {
    technologies: {
      id: string
      name: string
      category: string
    } | null
  }[]
  projects: {
    id: string
    name: string
    description: string | null
    url: string | null
  }[]
}

interface PageProps {
  params: Promise<{ username: string }>
}

const TECH_CATEGORY_ORDER: TechCategory[] = [
  'Frontend',
  'Backend',
  'Mobile',
  'DevOps',
  'Data',
  'Gaming',
  'Other',
]

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = createServiceRoleClient()

  const { data } = await supabase
    .from('profiles')
    .select('full_name, bio, avatar_url, city, availability')
    .eq('username', username)
    .maybeSingle()

  if (!data) {
    return { title: 'Perfil no encontrado — DevMap Ecuador' }
  }

  const title = `${data.full_name} (@${username}) — DevMap Ecuador`
  const description =
    data.bio ??
    `Perfil de ${data.full_name} en DevMap Ecuador. ${data.city}, Ecuador.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: data.avatar_url ? [{ url: data.avatar_url, alt: data.full_name }] : [],
      url: `${process.env.NEXT_PUBLIC_APP_URL}/devs/${username}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: data.avatar_url ? [data.avatar_url] : [],
    },
  }
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function DevProfilePage({ params }: PageProps) {
  const { username } = await params
  const { userId } = await auth()
  const supabase = createServiceRoleClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      `
      id, username, full_name, avatar_url, city, bio,
      years_experience, availability, github_url, linkedin_url,
      portfolio_url, is_public, created_at, clerk_user_id,
      profile_technologies(
        technologies(id, name, category)
      ),
      projects(id, name, description, url)
    `
    )
    .eq('username', username)
    .maybeSingle()

  if (!profile) {
    notFound()
  }

  // Perfil privado
  if (!profile.is_public) {
    return (
      <main className="container mx-auto max-w-2xl py-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Perfil no disponible</h1>
        <p className="mt-2 text-muted-foreground">
          Este perfil ha sido configurado como privado.
        </p>
        <Link href="/devs" className={cn(buttonVariants(), 'mt-6')}>
          Ver directorio
        </Link>
      </main>
    )
  }

  const profileData = profile as unknown as ProfileRow
  const isOwner = userId === profileData.clerk_user_id
  const availability = profileData.availability as Availability

  // Transformar tecnologías
  const technologies = profileData.profile_technologies
    .map((pt) => pt.technologies)
    .filter((t): t is NonNullable<typeof t> => t !== null)

  // Agrupar tecnologías por categoría
  const techsByCategory = TECH_CATEGORY_ORDER.reduce<
    Partial<Record<TechCategory, typeof technologies>>
  >((acc, category) => {
    const group = technologies.filter((t) => (t.category as TechCategory) === category)
    if (group.length > 0) acc[category] = group
    return acc
  }, {})

  const hasLinks =
    profileData.github_url || profileData.linkedin_url || profileData.portfolio_url

  return (
    <main className="container mx-auto max-w-3xl py-10 px-4 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24 shrink-0 ring-2 ring-border">
          <AvatarImage src={profileData.avatar_url ?? undefined} alt={profileData.full_name} />
          <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
            {getInitials(profileData.full_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">{profileData.full_name}</h1>
              <p className="text-indigo-500 text-sm">@{profileData.username}</p>
            </div>
            {isOwner && (
              <Link
                href="/register"
                className={cn(buttonVariants({ size: 'sm' }), 'bg-indigo-600 hover:bg-indigo-700 text-white')}
              >
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Editar perfil
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {profileData.city}
            </span>

            {profileData.years_experience != null && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                {profileData.years_experience}{' '}
                {profileData.years_experience === 1 ? 'año' : 'años'} de experiencia
              </span>
            )}

            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                AVAILABILITY_COLORS[availability]
              )}
            >
              {AVAILABILITY_LABELS[availability]}
            </span>
          </div>

          {hasLinks && (
            <div className="flex items-center gap-3 mt-3">
              {profileData.github_url && (
                <a
                  href={profileData.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <Link2 className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {profileData.linkedin_url && (
                <a
                  href={profileData.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <Link2 className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {profileData.portfolio_url && (
                <a
                  href={profileData.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Bio ────────────────────────────────────────────────────────────── */}
      {profileData.bio && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Sobre mí</h2>
          <p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>
        </section>
      )}

      {/* ── Stack tecnológico ──────────────────────────────────────────────── */}
      {technologies.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Stack tecnológico</h2>
          <div className="space-y-3">
            {Object.entries(techsByCategory).map(([category, techs]) => (
              <div key={category} className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide w-20 shrink-0">
                  {category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {techs!.map((tech) => (
                    <Badge key={tech.id} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Proyectos destacados ───────────────────────────────────────────── */}
      {profileData.projects.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Proyectos destacados</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profileData.projects.map((project) => (
              <Card key={project.id} className="flex flex-col border-l-4 border-l-indigo-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-start justify-between gap-2">
                    <span>{project.name}</span>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        aria-label={`Ver ${project.name}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="text-sm leading-relaxed">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                {project.url && (
                  <CardContent className="pt-0 mt-auto">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate block"
                    >
                      {project.url}
                    </a>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Back link ──────────────────────────────────────────────────────── */}
      <div className="pt-4 border-t">
        <Link href="/devs" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
          ← Ver todos los devs
        </Link>
      </div>
    </main>
  )
}
