'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import type { MultiSelectOption } from '@/components/ui/multi-select'

import { useAuth } from '@clerk/nextjs'

import { saveProfile } from '@/app/actions/profile'
import { profileCache } from '@/hooks/use-profile-link'
import {
  CITIES_ECUADOR,
  AVAILABILITY_LABELS,
  MAX_PROJECTS,
  MAX_WORK_EXPERIENCE,
  MAX_BIO_CHARS,
  MAX_PROJECT_DESC_CHARS,
  MAX_WORK_EXP_DESC_CHARS,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Technology, TechCategory, Availability } from '@/types'

// ─── Tipos locales ────────────────────────────────────────────────────────────

interface InitialProject {
  id?: string
  name: string
  description?: string
  url?: string
}

interface InitialWorkExperience {
  id?: string
  company: string
  role: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
}

export interface InitialProfile {
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
  projects: InitialProject[]
  work_experience: InitialWorkExperience[]
}

interface ProfileFormProps {
  technologies: Technology[]
  initialProfile?: InitialProfile | null
  suggestedUsername?: string
}

// ─── Schema de validación ─────────────────────────────────────────────────────

const urlOrEmpty = z.union([z.string().url('Debe ser una URL válida'), z.literal('')])

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nombre requerido'),
  description: z
    .string()
    .max(MAX_PROJECT_DESC_CHARS, `Máximo ${MAX_PROJECT_DESC_CHARS} caracteres`)
    .optional(),
  url: urlOrEmpty.optional(),
})

const workExperienceSchema = z
  .object({
    id: z.string().optional(),
    company: z.string().min(1, 'Empresa requerida'),
    role: z.string().min(1, 'Rol requerido'),
    is_current: z.boolean(),
    start_date: z.string().min(1, 'Fecha de inicio requerida'),
    end_date: z.string().optional(),
    description: z
      .string()
      .max(MAX_WORK_EXP_DESC_CHARS, `Máximo ${MAX_WORK_EXP_DESC_CHARS} caracteres`)
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.is_current && val.end_date && val.start_date && val.end_date <= val.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La fecha fin debe ser posterior a la fecha de inicio',
        path: ['end_date'],
      })
    }
  })

const profileSchema = z.object({
  username: z
    .string()
    .min(MIN_USERNAME_LENGTH, `Mínimo ${MIN_USERNAME_LENGTH} caracteres`)
    .max(MAX_USERNAME_LENGTH, `Máximo ${MAX_USERNAME_LENGTH} caracteres`)
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  full_name: z.string().min(2, 'Nombre requerido'),
  city: z.string().min(1, 'Ciudad requerida'),
  bio: z.string().max(MAX_BIO_CHARS, `Máximo ${MAX_BIO_CHARS} caracteres`).optional(),
  years_experience: z.number().min(0, 'Mínimo 0').max(40, 'Máximo 40').optional(),
  availability: z.enum([
    'empleado',
    'freelance',
    'buscando_empleo',
    'abierto_oportunidades',
  ] as const),
  github_url: urlOrEmpty.optional(),
  linkedin_url: urlOrEmpty.optional(),
  portfolio_url: urlOrEmpty.optional(),
  avatar_url: urlOrEmpty.optional(),
  technologies: z.array(z.string()).min(1, 'Selecciona al menos una tecnología'),
  projects: z.array(projectSchema).max(MAX_PROJECTS),
  work_experience: z.array(workExperienceSchema).max(MAX_WORK_EXPERIENCE),
})

type ProfileFormData = z.infer<typeof profileSchema>

// ─── Orden de categorías ──────────────────────────────────────────────────────

const TECH_CATEGORY_ORDER: TechCategory[] = [
  'Frontend',
  'Backend',
  'Mobile',
  'DevOps',
  'Data',
  'Gaming',
  'Testing',
  'Other',
]

// ─── Componente ───────────────────────────────────────────────────────────────

export function ProfileForm({
  technologies,
  initialProfile,
  suggestedUsername,
}: ProfileFormProps) {
  const router = useRouter()
  const { userId } = useAuth()
  const [checkingUsername, setCheckingUsername] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialProfile?.username ?? suggestedUsername ?? '',
      full_name: initialProfile?.full_name ?? '',
      city: initialProfile?.city ?? '',
      bio: initialProfile?.bio ?? '',
      years_experience: initialProfile?.years_experience,
      availability: initialProfile?.availability ?? 'empleado',
      github_url: initialProfile?.github_url ?? '',
      linkedin_url: initialProfile?.linkedin_url ?? '',
      portfolio_url: initialProfile?.portfolio_url ?? '',
      avatar_url: initialProfile?.avatar_url ?? '',
      technologies: initialProfile?.technologies ?? [],
      projects: initialProfile?.projects ?? [],
      work_experience: initialProfile?.work_experience ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'projects' })
  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({ control, name: 'work_experience' })

  const watchedBio = watch('bio')

  // ─── Computed ───────────────────────────────────────────────────────────────

  const techOptions: MultiSelectOption[] = TECH_CATEGORY_ORDER.flatMap((category) =>
    technologies
      .filter((t) => (t.category as TechCategory) === category)
      .map((t) => ({ value: t.id, label: t.name }))
  )

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleUsernameBlur = async (value: string) => {
    if (!value || value.length < MIN_USERNAME_LENGTH) return
    if (value === initialProfile?.username) return

    setCheckingUsername(true)
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(value)}`)
      const json = await res.json() as { available: boolean }
      if (!json.available) {
        setError('username', { type: 'manual', message: 'Este username ya está en uso' })
      } else {
        clearErrors('username')
      }
    } catch {
      // Error silencioso — el servidor validará al guardar
    } finally {
      setCheckingUsername(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    const result = await saveProfile({
      ...data,
      years_experience: data.years_experience,
      bio: data.bio || undefined,
      github_url: data.github_url || undefined,
      linkedin_url: data.linkedin_url || undefined,
      portfolio_url: data.portfolio_url || undefined,
      avatar_url: data.avatar_url || undefined,
      work_experience: data.work_experience.map((w) => ({
        ...w,
        end_date: w.is_current ? undefined : w.end_date || undefined,
        description: w.description || undefined,
      })),
    })

    if (result.success && result.username) {
      if (userId) profileCache.delete(userId)
      toast.success('¡Perfil guardado exitosamente!')
      router.push(`/devs/${result.username}`)
    } else {
      toast.error(result.error ?? 'Error al guardar el perfil')
      if (result.error?.includes('username')) {
        setError('username', { type: 'manual', message: result.error })
      }
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

      {/* ── Información básica ─────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold text-indigo-600 border-b border-indigo-100 pb-2">Información básica</h2>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Username <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              {...register('username')}
              placeholder="tu-username"
              autoComplete="off"
              onBlur={(e) => handleUsernameBlur(e.target.value)}
              className={errors.username ? 'border-destructive' : ''}
            />
            {checkingUsername && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Solo letras minúsculas, números y guiones. Ej: <code>juan-perez</code>
          </p>
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
        </div>

        {/* Nombre completo */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Nombre completo <span className="text-destructive">*</span>
          </label>
          <Input
            {...register('full_name')}
            placeholder="Juan Pérez"
            className={errors.full_name ? 'border-destructive' : ''}
          />
          {errors.full_name && (
            <p className="text-sm text-destructive">{errors.full_name.message}</p>
          )}
        </div>

        {/* Ciudad */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Ciudad <span className="text-destructive">*</span>
          </label>
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={errors.city ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecciona tu ciudad" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {CITIES_ECUADOR.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        {/* Disponibilidad */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Disponibilidad <span className="text-destructive">*</span>
          </label>
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={errors.availability ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecciona tu disponibilidad">
                    {field.value ? AVAILABILITY_LABELS[field.value as Availability] : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full">
                  {(Object.entries(AVAILABILITY_LABELS) as [Availability, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.availability && (
            <p className="text-sm text-destructive">{errors.availability.message}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Bio</label>
            <span className="text-xs text-muted-foreground">
              {(watchedBio ?? '').length}/{MAX_BIO_CHARS}
            </span>
          </div>
          <Textarea
            {...register('bio')}
            placeholder="Cuéntanos un poco sobre ti, tu experiencia y en qué te especializas..."
            rows={3}
            maxLength={MAX_BIO_CHARS}
            className={errors.bio ? 'border-destructive' : ''}
          />
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio.message}</p>
          )}
        </div>

        {/* Años de experiencia */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Años de experiencia</label>
          <Input
            type="number"
            min={0}
            max={40}
            placeholder="0"
            {...register('years_experience', {
              setValueAs: (v: string) => (v === '' ? undefined : Number(v)),
            })}
            className={cn('w-32', errors.years_experience ? 'border-destructive' : '')}
          />
          {errors.years_experience && (
            <p className="text-sm text-destructive">{errors.years_experience.message}</p>
          )}
        </div>

        {/* Avatar URL */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">URL de avatar</label>
          <Input
            {...register('avatar_url')}
            placeholder="https://github.com/tu-usuario.png"
            className={errors.avatar_url ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground">
            Opcional. Pega la URL de tu foto de perfil de GitHub, Gravatar u otro servicio.
          </p>
          {errors.avatar_url && (
            <p className="text-sm text-destructive">{errors.avatar_url.message}</p>
          )}
        </div>
      </section>

      {/* ── Links sociales ─────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold text-indigo-600 border-b border-indigo-100 pb-2">Links sociales</h2>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">GitHub</label>
          <Input
            {...register('github_url')}
            placeholder="https://github.com/tu-usuario"
            className={errors.github_url ? 'border-destructive' : ''}
          />
          {errors.github_url && (
            <p className="text-sm text-destructive">{errors.github_url.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">LinkedIn</label>
          <Input
            {...register('linkedin_url')}
            placeholder="https://linkedin.com/in/tu-perfil"
            className={errors.linkedin_url ? 'border-destructive' : ''}
          />
          {errors.linkedin_url && (
            <p className="text-sm text-destructive">{errors.linkedin_url.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Portfolio / Web</label>
          <Input
            {...register('portfolio_url')}
            placeholder="https://tu-portfolio.com"
            className={errors.portfolio_url ? 'border-destructive' : ''}
          />
          {errors.portfolio_url && (
            <p className="text-sm text-destructive">{errors.portfolio_url.message}</p>
          )}
        </div>
      </section>

      {/* ── Stack tecnológico ──────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="text-xl font-semibold text-indigo-600">Stack tecnológico</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona las tecnologías con las que trabajas <span className="text-destructive">*</span>
          </p>
        </div>

        <p className="mt-0.5 mb-2 text-xs text-slate-500 italic">
          <Info className="h-3 w-3 text-indigo-400 inline mr-1" />
          Las primeras 3 tecnologías que selecciones aparecerán destacadas en tu perfil y se contabilizarán en el ranking del ecosistema. Elige primero las que más usas.
        </p>

        <Controller
          control={control}
          name="technologies"
          render={({ field }) => (
            <MultiSelect
              options={techOptions}
              selected={field.value}
              onChange={field.onChange}
              placeholder="Busca y selecciona tus tecnologías..."
              searchPlaceholder="Buscar tecnologías..."
            />
          )}
        />

        {errors.technologies && (
          <p className="text-sm text-destructive">{errors.technologies.message}</p>
        )}
      </section>

      {/* ── Proyectos destacados ───────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h2 className="text-xl font-semibold text-indigo-600">Proyectos destacados</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Hasta {MAX_PROJECTS} proyectos
            </p>
          </div>
          {fields.length < MAX_PROJECTS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', description: '', url: '' })}
              className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Agregar proyecto
            </Button>
          )}
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No has agregado proyectos aún. ¡Muestra tu mejor trabajo!
          </p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Proyecto {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input
                {...register(`projects.${index}.name`)}
                placeholder="Mi Proyecto"
                className={errors.projects?.[index]?.name ? 'border-destructive' : ''}
              />
              {errors.projects?.[index]?.name && (
                <p className="text-sm text-destructive">
                  {errors.projects[index]?.name?.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Descripción</label>
                <span className="text-xs text-muted-foreground">
                  {(watch(`projects.${index}.description`) ?? '').length}/{MAX_PROJECT_DESC_CHARS}
                </span>
              </div>
              <Textarea
                {...register(`projects.${index}.description`)}
                placeholder="Describe brevemente el proyecto..."
                rows={2}
                maxLength={MAX_PROJECT_DESC_CHARS}
                className={errors.projects?.[index]?.description ? 'border-destructive' : ''}
              />
              {errors.projects?.[index]?.description && (
                <p className="text-sm text-destructive">
                  {errors.projects[index]?.description?.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL del proyecto</label>
              <Input
                {...register(`projects.${index}.url`)}
                placeholder="https://mi-proyecto.com"
                className={errors.projects?.[index]?.url ? 'border-destructive' : ''}
              />
              {errors.projects?.[index]?.url && (
                <p className="text-sm text-destructive">
                  {errors.projects[index]?.url?.message}
                </p>
              )}
            </div>
          </div>
        ))}

        {errors.projects && !Array.isArray(errors.projects) && (
          <p className="text-sm text-destructive">{errors.projects.message}</p>
        )}
      </section>

      {/* ── Experiencia laboral ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h2 className="text-xl font-semibold text-indigo-600">Experiencia laboral</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Hasta {MAX_WORK_EXPERIENCE} entradas
            </p>
          </div>
          {workFields.length < MAX_WORK_EXPERIENCE && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendWork({ company: '', role: '', is_current: false, start_date: '', end_date: '', description: '' })}
              className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Agregar experiencia
            </Button>
          )}
        </div>

        {workFields.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No has agregado experiencia laboral aún.
          </p>
        )}

        {workFields.map((field, index) => {
          const isCurrent = watch(`work_experience.${index}.is_current`)
          const descLen = (watch(`work_experience.${index}.description`) ?? '').length
          return (
            <div key={field.id} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Experiencia {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWork(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Empresa <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register(`work_experience.${index}.company`)}
                  placeholder="Nombre de la empresa"
                  className={errors.work_experience?.[index]?.company ? 'border-destructive' : ''}
                />
                {errors.work_experience?.[index]?.company && (
                  <p className="text-sm text-destructive">{errors.work_experience[index]?.company?.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Rol <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register(`work_experience.${index}.role`)}
                  placeholder="Ej: Frontend Developer"
                  className={errors.work_experience?.[index]?.role ? 'border-destructive' : ''}
                />
                {errors.work_experience?.[index]?.role && (
                  <p className="text-sm text-destructive">{errors.work_experience[index]?.role?.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`work-current-${index}`}
                  {...register(`work_experience.${index}.is_current`)}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600 cursor-pointer"
                />
                <label htmlFor={`work-current-${index}`} className="text-sm cursor-pointer">
                  Trabajo actual
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Fecha inicio <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="month"
                    {...register(`work_experience.${index}.start_date`)}
                    className={errors.work_experience?.[index]?.start_date ? 'border-destructive' : ''}
                  />
                  {errors.work_experience?.[index]?.start_date && (
                    <p className="text-sm text-destructive">{errors.work_experience[index]?.start_date?.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={cn('text-sm font-medium', isCurrent && 'text-muted-foreground')}>
                    Fecha fin
                  </label>
                  <Input
                    type="month"
                    disabled={isCurrent}
                    {...register(`work_experience.${index}.end_date`)}
                    className={cn(
                      errors.work_experience?.[index]?.end_date ? 'border-destructive' : '',
                      isCurrent && 'opacity-50'
                    )}
                  />
                  {errors.work_experience?.[index]?.end_date && (
                    <p className="text-sm text-destructive">{errors.work_experience[index]?.end_date?.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Descripción</label>
                  <span className={cn('text-xs', descLen > 270 ? 'text-red-500' : 'text-muted-foreground')}>
                    {descLen} / {MAX_WORK_EXP_DESC_CHARS}
                  </span>
                </div>
                <Textarea
                  {...register(`work_experience.${index}.description`)}
                  placeholder="Describe brevemente tu rol y logros..."
                  rows={2}
                  maxLength={MAX_WORK_EXP_DESC_CHARS}
                  className={errors.work_experience?.[index]?.description ? 'border-destructive' : ''}
                />
                {errors.work_experience?.[index]?.description && (
                  <p className="text-sm text-destructive">{errors.work_experience[index]?.description?.message}</p>
                )}
              </div>
            </div>
          )
        })}

        {errors.work_experience && !Array.isArray(errors.work_experience) && (
          <p className="text-sm text-destructive">{errors.work_experience.message}</p>
        )}
      </section>

      {/* ── Submit ─────────────────────────────────────────────────────────── */}
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto cursor-pointer">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Guardando...' : initialProfile ? 'Guardar cambios' : 'Crear perfil'}
        </Button>
      </div>
    </form>
  )
}
