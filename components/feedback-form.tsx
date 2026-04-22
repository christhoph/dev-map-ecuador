'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, CheckCircle } from 'lucide-react'

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
import { cn } from '@/lib/utils'

// ─── Schema ───────────────────────────────────────────────────────────────────

const MAX_DESCRIPTION = 500
const WARN_DESCRIPTION = 450

const feedbackFormSchema = z.object({
  type: z.enum(['bug', 'mejora', 'feature'] as const),
  title: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z
    .string()
    .min(10, 'Mínimo 10 caracteres')
    .max(MAX_DESCRIPTION, `Máximo ${MAX_DESCRIPTION} caracteres`),
  page: z.enum(['landing', 'directorio', 'perfil', 'ask', 'registro', 'otra'] as const).optional(),
  name: z.string().max(80, 'Máximo 80 caracteres').optional(),
  contact_email: z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
})

type FeedbackFormData = z.infer<typeof feedbackFormSchema>

// ─── Componente ───────────────────────────────────────────────────────────────

export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      type: 'bug',
      title: '',
      description: '',
      name: '',
      contact_email: '',
    },
  })

  const watchedDescription = watch('description')
  const descLen = (watchedDescription ?? '').length

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.type,
          title: data.title,
          description: data.description,
          ...(data.page && { page: data.page }),
          ...(data.name && { name: data.name }),
          ...(data.contact_email && { contact_email: data.contact_email }),
        }),
      })

      const json = (await res.json()) as { success?: boolean; error?: string }

      if (!res.ok || !json.success) {
        toast.error(json.error ?? 'No pudimos enviar tu feedback. Inténtalo de nuevo.')
        return
      }

      setSubmitted(true)
    } catch {
      toast.error('Error de conexión. Inténtalo de nuevo.')
    }
  }

  // ─── Estado de éxito ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-xl font-semibold">¡Gracias por tu feedback!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Lo revisaré personalmente. Si dejaste tu email me pondré en contacto contigo.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSubmitted(false)
            reset()
          }}
        >
          Enviar otro feedback
        </Button>
      </div>
    )
  }

  // ─── Formulario ─────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Tipo */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Tipo <span className="text-destructive">*</span>
        </label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug encontrado</SelectItem>
                <SelectItem value="mejora">Mejora al diseño o UX</SelectItem>
                <SelectItem value="feature">Sugerencia de nueva feature</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      {/* Título */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">
          Título <span className="text-destructive">*</span>
        </label>
        <Input
          {...register('title')}
          placeholder="Resumen corto de tu reporte o idea"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Descripción <span className="text-destructive">*</span>
          </label>
          <span className={cn('text-xs', descLen > WARN_DESCRIPTION ? 'text-red-500' : 'text-muted-foreground')}>
            {descLen} / {MAX_DESCRIPTION}
          </span>
        </div>
        <Textarea
          {...register('description')}
          placeholder="Descríbelo con el mayor detalle posible..."
          rows={4}
          maxLength={MAX_DESCRIPTION}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Página */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Página donde ocurrió</label>
        <Controller
          control={control}
          name="page"
          render={({ field }) => (
            <Select
              value={field.value ?? ''}
              onValueChange={(v) => field.onChange(v || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una página (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landing">Landing (inicio)</SelectItem>
                <SelectItem value="directorio">Directorio de devs</SelectItem>
                <SelectItem value="perfil">Perfil público</SelectItem>
                <SelectItem value="ask">Pregunta a la IA</SelectItem>
                <SelectItem value="registro">Formulario de registro</SelectItem>
                <SelectItem value="otra">Otra / No aplica</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Nombre */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Tu nombre</label>
        <Input
          {...register('name')}
          placeholder="Opcional"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email de contacto</label>
        <Input
          {...register('contact_email')}
          type="email"
          placeholder="Para hacerte seguimiento si lo deseas"
          className={errors.contact_email ? 'border-destructive' : ''}
        />
        {errors.contact_email && (
          <p className="text-sm text-destructive">{errors.contact_email.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2 w-full flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto cursor-pointer"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Enviando...' : 'Enviar feedback'}
        </Button>
      </div>
    </form>
  )
}
