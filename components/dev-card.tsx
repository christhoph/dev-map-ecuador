import Link from 'next/link'
import { MapPin, Briefcase } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AVAILABILITY_LABELS, AVAILABILITY_COLORS, AVAILABILITY_BORDER_COLORS } from '@/lib/constants'
import { getInitials, cn } from '@/lib/utils'
import type { DevCardProfile } from '@/types'

// ─── Tipos locales ────────────────────────────────────────────────────────────

interface DevCardProps {
  profile: DevCardProfile
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DevCard({ profile }: DevCardProps) {
  const displayTechs = profile.technologies.slice(0, 5)
  const remainingCount = profile.technologies.length - displayTechs.length

  return (
    <Link
      href={`/devs/${profile.username}`}
      className="group block h-full"
      aria-label={`Ver perfil de ${profile.full_name}`}
    >
      <article className={cn(
        'flex h-full flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:ring-1 hover:ring-indigo-100 border-t-[3px]',
        AVAILABILITY_BORDER_COLORS[profile.availability]
      )}>

        {/* ── Header: avatar + nombre + badge ─────────────────────────────── */}
        <div className="flex items-start gap-3">
          <Avatar size="lg">
            <AvatarImage
              src={profile.avatar_url}
              alt={profile.full_name}
            />
            <AvatarFallback className="text-sm font-semibold">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-tight transition-colors group-hover:text-indigo-600">
              {profile.full_name}
            </p>
            <p className="truncate text-xs text-indigo-500">
              @{profile.username}
            </p>
          </div>

          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
              AVAILABILITY_COLORS[profile.availability]
            )}
          >
            {AVAILABILITY_LABELS[profile.availability]}
          </span>
        </div>

        {/* ── Ciudad y experiencia ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {profile.city}
          </span>

          {profile.years_experience != null && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 shrink-0" />
              {profile.years_experience}{' '}
              {profile.years_experience === 1 ? 'año' : 'años'}
            </span>
          )}
        </div>

        {/* ── Tecnologías ───────────────────────────────────────────────────── */}
        {profile.technologies.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {displayTechs.map((tech) => (
              <Badge key={tech.id} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-xs">
                {tech.name}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{remainingCount}
              </Badge>
            )}
          </div>
        )}
      </article>
    </Link>
  )
}
