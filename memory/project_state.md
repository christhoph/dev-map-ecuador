---
name: Project State
description: Estado actual del sprint DevMap Ecuador — qué pasos están completos
type: project
---

Bloque 1 y Bloque 2 completados (Pasos 1–7).

**Why:** Sprint hacia Build with AI Challenge GDG Quito el 25 de abril 2026.

**How to apply:** El siguiente bloque es el Bloque 3 (Pasos 8–9): DevCard y directorio con filtros.

## Pasos completados

- **Paso 1:** Next.js 16.2.4 inicializado. Todas las dependencias instaladas. shadcn/ui con: button, input, textarea, select, badge, card, avatar, sonner.
- **Paso 2:** lib/supabase/client.ts, lib/supabase/server.ts, lib/supabase/types.ts.
- **Paso 3:** proxy.ts, sign-in/sign-up, ClerkProvider en layout.
- **Paso 4:** Estructura base de rutas completa.
- **Paso 5:** types/index.ts, lib/constants.ts, lib/utils.ts (cn, formatAvailability, getInitials).
- **Paso 6:** components/profile-form.tsx (react-hook-form + zod, multi-select techs, proyectos dinámicos, upsert via server action). app/actions/profile.ts (saveProfile). app/api/check-username/route.ts. app/registro/page.tsx (SSR con datos existentes).
- **Paso 7:** app/devs/[username]/page.tsx (SSR, generateMetadata, SEO/OG, avatar fallback, badge disponibilidad, stack por categoría, proyectos, botón editar solo para dueño, notFound() si no existe).

## Build status
`npm run build` pasa sin errores ni warnings. 10 rutas totales.
