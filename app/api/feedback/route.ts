import { z } from 'zod'

import { createServiceRoleClient } from '@/lib/supabase/server'

// ─── Schema de validación ─────────────────────────────────────────────────────

const feedbackSchema = z.object({
  type: z.enum(['bug', 'mejora', 'feature'] as const),
  title: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
  page: z.enum(['landing', 'directorio', 'perfil', 'ask', 'registro', 'otra'] as const).optional(),
  contact_email: z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
  name: z.string().max(80, 'Máximo 80 caracteres').optional(),
})

// ─── POST /api/feedback ───────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return Response.json({ error: 'Body inválido' }, { status: 400 })
    }

    const result = feedbackSchema.safeParse(body)
    if (!result.success) {
      const firstIssue = result.error.issues[0]
      return Response.json(
        { error: firstIssue?.message ?? 'Datos inválidos' },
        { status: 400 }
      )
    }

    const { type, title, description, page, contact_email, name } = result.data
    const supabase = createServiceRoleClient()

    const { error } = await supabase.from('feedback').insert({
      type,
      title,
      description,
      page: page ?? null,
      contact_email: contact_email || null,
      name: name || null,
    })

    if (error) {
      console.error('[/api/feedback] Supabase error:', error)
      return Response.json({ error: 'No se pudo guardar el feedback' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[/api/feedback] Unexpected error:', err)
    return Response.json({ error: 'Error inesperado. Inténtalo de nuevo.' }, { status: 500 })
  }
}
