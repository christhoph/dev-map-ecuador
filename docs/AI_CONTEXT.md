# AI_CONTEXT — DevMap Ecuador
## Archivo de contexto para agentes de IA (Claude Code / Google Antigravity)

Lee este archivo primero antes de cualquier tarea de desarrollo. Contiene todo lo necesario para entender el proyecto y generar código coherente.

---

## ¿Qué es este proyecto?

**DevMap Ecuador** es un directorio web del talento tech ecuatoriano. Los devs crean perfiles públicos con su stack, ciudad y disponibilidad. Hay un chat con IA que responde preguntas sobre el ecosistema usando datos reales.

Fue creado para el **Build with AI Challenge de GDG Quito** (25 abril 2026) por **Cristopher Solis**.

---

## Stack técnico (resumen rápido)

- **Next.js 16+ App Router + TypeScript**
- **Tailwind CSS + shadcn/ui**
- **Clerk** — autenticación (localización `esCL` en español)
- **Supabase** — base de datos PostgreSQL
- **Google Gemini API (`gemini-2.5-flash`)** — IA del chat `/ask` (free tier, sin tarjeta)
- **react-markdown** — renderizado enriquecido de respuestas de la IA
- **Inter** — tipografía via next/font/google
- **Vercel** — deploy

Lee `STACK.md` para estructura de carpetas y variables de entorno.

---

## Archivos de referencia

| Archivo | Cuándo leerlo |
|---|---|
| `PRD.md` | Para entender qué construir y por qué |
| `STACK.md` | Para estructura de carpetas, variables de entorno, comandos |
| `DATA_MODEL.md` | Para cualquier tarea relacionada con Supabase o queries |
| `PAGES.md` | Para construir o modificar cualquier página o componente de UI |
| `CONVENTIONS.md` | Para nombrar, tipear, organizar cualquier código nuevo |
| `PLAN.md` | Para saber en qué día del sprint estamos y qué tareas quedan |

---

## Reglas críticas para el agente de IA

1. **Seguir siempre `CONVENTIONS.md`** — nomenclatura, estructura de componentes, alias de imports
2. **Nunca hardcodear ciudades** — usar `CITIES_ECUADOR` de `lib/constants.ts`
3. **Usar `@/` para todos los imports internos** — nunca rutas relativas
4. **Clerk protege solo `/register` y `/api/ask`** — el resto es público
5. **Las API Routes usan `SUPABASE_SERVICE_ROLE_KEY`** para obtener contexto completo para la IA
6. **Nunca exponer el email del usuario** en perfiles públicos
7. **Avatar fallback obligatorio** — iniciales si no hay foto
8. **El chat `/ask` no persiste historial** — cada sesión es nueva

---

## Contexto del desarrollador

**Cristopher Solis** — Full Stack Developer, 9+ años de experiencia
- Stack principal: React, Next.js, TypeScript, React Native
- Backend: Nest.js, Django, FastAPI (aprendiendo)
- Ha usado Claude Code e integraciones MCP en proyectos reales
- Ciudad: Quito, Ecuador

---

## Cómo usar este contexto con Claude Code

Al iniciar una sesión de Claude Code, puedes decir:

```
Lee los archivos en /docs antes de empezar:
- AI_CONTEXT.md (este archivo)
- El .md relevante para la tarea de hoy

Hoy vamos a construir: [describe la tarea del día según PLAN.md]
```

---

## Cómo usar este contexto con Google Antigravity (Gemini)

Al iniciar una sesión:

```
Contexto del proyecto en /docs/AI_CONTEXT.md
Stack: Next.js 16 + TypeScript + Supabase + Clerk + Gemini API
Tarea de hoy: [describe la tarea]
Sigue las convenciones de /docs/CONVENTIONS.md
```

---

## Estado actual del proyecto

> Última actualización: 22 abril 2026

### Pasos completados

| Paso | Descripción | Estado |
|---|---|---|
| 1 | Inicializar proyecto | ✅ |
| 2 | Configurar Supabase | ✅ |
| 3 | Configurar Clerk | ✅ |
| 4 | Deploy inicial Vercel | ✅ |
| 5 | Tipos y constantes | ✅ |
| 6 | Formulario de registro `/register` | ✅ |
| 7 | Perfil público `/devs/[username]` | ✅ |
| 8 | DevCard component | ✅ |
| 9 | Directorio con filtros `/devs` | ✅ |
| 10 | Integración Gemini API `/api/ask` | ✅ |
| 11 | Chat UI `/ask` | ✅ |
| 12 | Ecosystem Stats y Landing `/` | ✅ |
| 13 | Revisión visual y responsive | ✅ |
| 14 | Beta con conocidos | ✅ |
| 15 | Preparar demo | ✅ |

### Features adicionales implementadas

- ✅ Tipografía Inter via next/font/google
- ✅ Footer con link a christhoph.dev, mención Claude AI y Claude Code, año dinámico, puntos GDG
- ✅ Clerk en español con @clerk/localizations (esCL)
- ✅ Fix Nav: Iniciar sesión → /sign-in, Únete → /sign-up
- ✅ Sistema de color: indigo primary, acentos GDG en stats y footer
- ✅ UI consistente con paleta indigo en todas las rutas
- ✅ MultiSelect con búsqueda en filtros del directorio
- ✅ Filtro por Rol/Categoría inferido via JOIN (sin campo extra en DB)
- ✅ Filtros del directorio: ciudad, disponibilidad, rol y tecnología como Selects
- ✅ Fix Select mostrando label en lugar de key interno
- ✅ Gemini limitado a temas del ecosistema tech ecuatoriano
- ✅ Manejo de errores robusto en /api/ask (JSON, nunca HTML)
- ✅ cursor-pointer en todos los elementos interactivos
- ✅ Fix button > button en MultiSelect (span con role="button")
- ✅ Hook useProfileLink — Nav redirige a /devs/[username] si el perfil ya existe
- ✅ Nota informativa en /register sobre las 3 primeras tecnologías
- ✅ Tabla work_experience — experiencia laboral opcional (máx 5 entradas)
- ✅ Sección Work Experience en /register y en perfil público
- ✅ Chips de la landing como atajos al chat con query param
- ✅ /ask lee query param ?q= y dispara pregunta automáticamente
- ✅ Fix botón CTA hover en sección fondo indigo
- ✅ max-w-3xl en contenedor del chat, chips en grid 2 columnas
- ✅ OGP completo: imagen dinámica via /og con next/og, meta tags por página, OG dinámico en /devs/[username]
- ✅ MultiSelect en /register reemplaza badges de tecnologías
- ✅ Página /feedback con formulario y tabla en Supabase (pública, sin auth)
- ✅ CONTRIBUTING.md en raíz del repo
- ✅ Stack tecnológico en perfil rediseñado como grid de cards por categoría
- ✅ Categorías nuevas: Testing, Gaming, Design, Design System
- ✅ Fix SelectContent min-width en todos los Select
- ✅ Respuestas de la IA renderizadas con react-markdown
- ✅ @username en respuestas de la IA convertidos en hipervínculos a /devs/[username]
- ✅ Tecnologías en respuestas de la IA como links al directorio filtrado
- ✅ min-h-[calc(100dvh-4rem)] en /devs con flex-1 para 100dvh sin doble scroll
- ✅ Stack en perfil como grid de cards responsive (1/2/3 columnas)

### Notas técnicas acumuladas

- `proxy.ts` en lugar de `middleware.ts` — Next.js 16
- `sonner` en lugar de shadcn toast — `import { toast } from 'sonner'`
- `Button asChild` no funciona — usar `<Link className={cn(buttonVariants({variant}))} />`
- `lucide-react`: usar `Link2` y `Globe` (no existen `Github` ni `Linkedin`)
- Zod: `.optional()` + `defaultValues` en useForm, nunca `.default('')`
- Rutas en inglés: `/register`, `/sign-in`, `/sign-up`
- Streaming con `ReadableStream` nativo en `/api/ask`
- `useSearchParams()` siempre dentro de `<Suspense>` boundary
- `min-h-screen` bajo Nav genera doble scroll — usar `flex-1` con `flex flex-col` en body
- `not-found.tsx` en raíz de `app/` captura todos los `notFound()` del proyecto
- `usePathname()` para active links requiere `'use client'`
- `button > button` es HTML inválido — usar `<span role="button">` dentro de `<button>`
- Valor por defecto de selects de filtro: siempre `''` (string vacío), nunca `'__all__'`
- `enrichAIResponse()` en lib/utils.ts procesa @username y tecnologías antes de ReactMarkdown

### Colaboradores

- **christhoph** — Cristopher Solis (autor)
- **chris-torres-dev** — colaborador

### Perfiles registrados

Objetivo: 15 perfiles para el evento del 25 de abril

### URLs

- **Producción:** https://dev-map-ecuador.vercel.app
- **Repo:** https://github.com/christhoph/dev-map-ecuador
- **Evento:** 25 de abril 2026, USFQ Cumbayá, 8:00-14:00
