'use client'

import { useState, useMemo } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

import { DevCard } from '@/components/dev-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CITIES_ECUADOR, AVAILABILITY_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { DevCardProfile, Technology, Availability } from '@/types'

// ─── Constantes locales ───────────────────────────────────────────────────────

const ALL_CITIES_VALUE = '__all__'

const AVAILABILITY_OPTIONS: Availability[] = [
  'buscando_empleo',
  'freelance',
  'abierto_oportunidades',
  'empleado',
]

// ─── Tipos locales ────────────────────────────────────────────────────────────

interface DevFiltersProps {
  initialProfiles: DevCardProfile[]
  technologies: Technology[]
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DevFilters({ initialProfiles, technologies }: DevFiltersProps) {
  const [selectedCity, setSelectedCity] = useState<string>(ALL_CITIES_VALUE)
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<Availability[]>([])
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const toggleAvailability = (value: Availability) => {
    setSelectedAvailabilities((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
    )
  }

  const toggleTech = (techId: string) => {
    setSelectedTechIds((prev) =>
      prev.includes(techId) ? prev.filter((id) => id !== techId) : [...prev, techId]
    )
  }

  const clearFilters = () => {
    setSelectedCity(ALL_CITIES_VALUE)
    setSelectedAvailabilities([])
    setSelectedTechIds([])
  }

  // ─── Filtrado (memoizado) ─────────────────────────────────────────────────

  const filteredProfiles = useMemo(() => {
    return initialProfiles.filter((profile) => {
      if (selectedCity !== ALL_CITIES_VALUE && profile.city !== selectedCity) {
        return false
      }
      if (
        selectedAvailabilities.length > 0 &&
        !selectedAvailabilities.includes(profile.availability)
      ) {
        return false
      }
      if (selectedTechIds.length > 0) {
        const profileTechIds = profile.technologies.map((t) => t.id)
        const hasMatch = selectedTechIds.some((id) => profileTechIds.includes(id))
        if (!hasMatch) return false
      }
      return true
    })
  }, [initialProfiles, selectedCity, selectedAvailabilities, selectedTechIds])

  const hasActiveFilters =
    selectedCity !== ALL_CITIES_VALUE ||
    selectedAvailabilities.length > 0 ||
    selectedTechIds.length > 0

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Panel de filtros ───────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ── Ciudad ────────────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Ciudad
          </p>
          <Select
            value={selectedCity}
            onValueChange={(value) => setSelectedCity(value ?? ALL_CITIES_VALUE)}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Todas las ciudades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CITIES_VALUE}>Todas las ciudades</SelectItem>
              {CITIES_ECUADOR.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Disponibilidad ────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Disponibilidad
          </p>
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY_OPTIONS.map((avail) => {
              const active = selectedAvailabilities.includes(avail)
              return (
                <button
                  key={avail}
                  type="button"
                  onClick={() => toggleAvailability(avail)}
                  className={cn(
                    'transition-all',
                    active ? 'ring-2 ring-primary ring-offset-1' : ''
                  )}
                >
                  <Badge
                    variant={active ? 'default' : 'outline'}
                    className="cursor-pointer select-none"
                  >
                    {AVAILABILITY_LABELS[avail]}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tecnología ────────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Tecnología
            </p>
            {selectedTechIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTechIds([])}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Quitar todas ({selectedTechIds.length})
              </button>
            )}
          </div>
          <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto py-0.5">
            {technologies.map((tech) => {
              const selected = selectedTechIds.includes(tech.id)
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech.id)}
                  className={cn(
                    'transition-all',
                    selected ? 'ring-2 ring-primary ring-offset-1' : ''
                  )}
                >
                  <Badge
                    variant={selected ? 'default' : 'outline'}
                    className="cursor-pointer select-none text-xs"
                  >
                    {tech.name}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Contador de resultados ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProfiles.length === 0
            ? 'Sin resultados'
            : filteredProfiles.length === 1
            ? '1 developer'
            : `${filteredProfiles.length} developers`}
          {hasActiveFilters && (
            <span className="ml-1 text-muted-foreground/60">
              (de {initialProfiles.length} totales)
            </span>
          )}
        </p>
      </div>

      {/* ── Grid de DevCards ───────────────────────────────────────────────── */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <DevCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <p className="text-base font-medium">
            No encontramos devs con esos criterios.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            ¡Sé el primero en registrarte con este stack!
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Quitar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
