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
import { MultiSelect } from '@/components/ui/multi-select'
import { CITIES_ECUADOR, AVAILABILITY_LABELS } from '@/lib/constants'
import type { DevCardProfile, Technology, Availability, TechCategory } from '@/types'

// ─── Constantes locales ───────────────────────────────────────────────────────

const TECH_CATEGORIES: TechCategory[] = [
  'Frontend',
  'Backend',
  'Mobile',
  'DevOps',
  'Data',
  'Testing',
  'Gaming',
  'Other',
]

const AVAILABILITY_OPTIONS: { value: Availability; label: string }[] = [
  { value: 'buscando_empleo', label: AVAILABILITY_LABELS.buscando_empleo },
  { value: 'abierto_oportunidades', label: AVAILABILITY_LABELS.abierto_oportunidades },
  { value: 'freelance', label: AVAILABILITY_LABELS.freelance },
  { value: 'empleado', label: AVAILABILITY_LABELS.empleado },
]

// ─── Tipos locales ────────────────────────────────────────────────────────────

interface DevFiltersProps {
  initialProfiles: DevCardProfile[]
  technologies: Technology[]
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DevFilters({ initialProfiles, technologies }: DevFiltersProps) {
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const clearFilters = () => {
    setSelectedCity('')
    setSelectedAvailability('')
    setSelectedCategory('')
    setSelectedTechIds([])
  }

  // ─── Filtrado (memoizado) ─────────────────────────────────────────────────

  const filteredProfiles = useMemo(() => {
    return initialProfiles.filter((profile) => {
      if (selectedCity && profile.city !== selectedCity) return false
      if (selectedAvailability && profile.availability !== selectedAvailability) return false
      if (selectedCategory) {
        const hasCategory = profile.technologies.some(
          (t) => t.category === selectedCategory
        )
        if (!hasCategory) return false
      }
      if (selectedTechIds.length > 0) {
        const profileTechIds = profile.technologies.map((t) => t.id)
        const hasMatch = selectedTechIds.some((id) => profileTechIds.includes(id))
        if (!hasMatch) return false
      }
      return true
    })
  }, [initialProfiles, selectedCity, selectedAvailability, selectedCategory, selectedTechIds])

  const hasActiveFilters =
    selectedCity !== '' ||
    selectedAvailability !== '' ||
    selectedCategory !== '' ||
    selectedTechIds.length > 0

  const techOptions = technologies.map((t) => ({ value: t.id, label: t.name }))

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 gap-6">

      {/* ── Panel de filtros ───────────────────────────────────────────────── */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
            Filtros
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ── Fila de 4 filtros ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* Filtro 1 — Ciudad */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Ciudad</p>
            <Select
              value={selectedCity}
              onValueChange={(value) => setSelectedCity(value ?? '')}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todas las ciudades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las ciudades</SelectItem>
                {CITIES_ECUADOR.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro 2 — Disponibilidad */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Disponibilidad</p>
            <Select
              value={selectedAvailability}
              onValueChange={(value) => setSelectedAvailability(value ?? '')}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {AVAILABILITY_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro 3 — Rol / Categoría */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Rol / Categoría</p>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value ?? '')}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todos los roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los roles</SelectItem>
                {TECH_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro 4 — Tecnología */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Tecnología</p>
            <MultiSelect
              options={techOptions}
              selected={selectedTechIds}
              onChange={setSelectedTechIds}
              placeholder="Todas las tecnologías"
              searchPlaceholder="Buscar tecnología..."
            />
          </div>

        </div>
      </section>

      {/* ── Contador de resultados ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="text-indigo-600 font-semibold">
            {filteredProfiles.length === 0
              ? 'Sin resultados'
              : filteredProfiles.length === 1
              ? '1 developer'
              : `${filteredProfiles.length} developers`}
          </span>
          {hasActiveFilters && (
            <span className="ml-1 text-slate-400">
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
        <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed">
          <div className="flex flex-col items-center py-20 text-center">
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
        </div>
      )}
    </div>
  )
}
