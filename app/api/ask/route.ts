import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import { geminiFlash } from '@/lib/gemini'
import { createServiceRoleClient } from '@/lib/supabase/server'

// ─── Tipos para datos crudos de Supabase ──────────────────────────────────────

interface RawProfileForContext {
  username: string
  full_name: string
  city: string
  bio: string | null
  years_experience: number | null
  availability: string
  profile_technologies: {
    technologies: {
      name: string
      category: string
    } | null
  }[]
  projects: {
    name: string
    description: string | null
  }[]
}

// ─── Construcción del contexto para Gemini ────────────────────────────────────

async function buildContext(): Promise<string> {
  const supabase = createServiceRoleClient()

  const { data: rawProfiles } = await supabase
    .from('profiles')
    .select(
      `
      username, full_name, city, bio, years_experience, availability,
      profile_technologies(technologies(name, category)),
      projects(name, description)
    `
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const profiles = (rawProfiles ?? []) as unknown as RawProfileForContext[]

  if (profiles.length === 0) {
    return 'Aún no hay desarrolladores registrados en el directorio.'
  }

  // Estadísticas globales
  const totalDevs = profiles.length
  const cities = [...new Set(profiles.map((p) => p.city))]
  const totalCities = cities.length

  // Conteo por disponibilidad
  const availabilityCount: Record<string, number> = {}
  for (const p of profiles) {
    availabilityCount[p.availability] = (availabilityCount[p.availability] ?? 0) + 1
  }

  // Conteo de tecnologías
  const techCount: Record<string, number> = {}
  for (const p of profiles) {
    for (const pt of p.profile_technologies) {
      if (pt.technologies?.name) {
        techCount[pt.technologies.name] = (techCount[pt.technologies.name] ?? 0) + 1
      }
    }
  }
  const topTechs = Object.entries(techCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => `${name} (${count})`)
    .join(', ')

  // Detalle por desarrollador
  const devDetails = profiles
    .map((p) => {
      const techs = p.profile_technologies
        .map((pt) => pt.technologies?.name)
        .filter(Boolean)
        .join(', ')
      const proyectos = p.projects.map((proj) => proj.name).join(', ')
      const lines = [
        `- ${p.full_name} (@${p.username}) — ${p.city}`,
        `  Disponibilidad: ${p.availability}`,
        `  Experiencia: ${p.years_experience != null ? `${p.years_experience} año(s)` : 'no especificada'}`,
        techs ? `  Stack: ${techs}` : null,
        p.bio ? `  Bio: ${p.bio}` : null,
        proyectos ? `  Proyectos destacados: ${proyectos}` : null,
      ]
      return lines.filter(Boolean).join('\n')
    })
    .join('\n\n')

  return `RESUMEN DEL ECOSISTEMA:
- Total de desarrolladores registrados: ${totalDevs}
- Ciudades representadas (${totalCities}): ${cities.join(', ')}
- Disponibilidad: ${Object.entries(availabilityCount).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Tecnologías más usadas: ${topTechs}

PERFILES COMPLETOS:
${devDetails}`
}

// ─── POST /api/ask ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
  // Verificar autenticación
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Leer el body
  let question: string
  try {
    const body = await req.json()
    question = (body.question ?? '').trim()
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!question) {
    return Response.json({ error: 'La pregunta es requerida' }, { status: 400 })
  }

  // Construir contexto desde Supabase
  const context = await buildContext()

  // System instruction
  const systemInstruction = `Eres el asistente de DevMap Ecuador, un directorio del talento tech ecuatoriano.
Tienes acceso a los datos reales de los desarrolladores registrados en la plataforma.
Responde siempre en español, de forma clara, amigable y concisa.
Si algo no está en los datos, dilo honestamente. No inventes información sobre las personas.
No revelar emails ni información privada.
Cuando menciones a un desarrollador, puedes incluir su @username para que el usuario pueda visitar su perfil en /devs/username.

Si la pregunta del usuario no está relacionada con desarrollo de software, tecnología, el ecosistema tech ecuatoriano o los datos del directorio DevMap Ecuador, declina amablemente y redirige al usuario a preguntar sobre el directorio. Responde: "Solo puedo ayudarte con preguntas sobre el ecosistema tech ecuatoriano y los desarrolladores registrados en DevMap Ecuador. ¿Tienes alguna pregunta sobre el directorio?"

DATOS ACTUALES DEL DIRECTORIO:
${context}`

  // Llamada a Gemini con streaming
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await geminiFlash.generateContentStream({
          systemInstruction,
          contents: [{ role: 'user', parts: [{ text: question }] }],
        })

        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) {
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
        controller.close()
      } catch (err) {
        console.error('[/api/ask] Gemini error:', err)
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
  } catch (err) {
    console.error('[/api/ask] Unexpected error:', err)
    return Response.json(
      { error: 'No se pudo procesar tu pregunta en este momento.' },
      { status: 500 }
    )
  }
}
