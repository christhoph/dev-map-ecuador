---
name: Project State
description: Estado actual del sprint DevMap Ecuador — qué pasos están completos
type: project
---

Bloque 1 completado (Pasos 1–3, más estructura del Paso 4).

**Why:** Sprint hacia Build with AI Challenge GDG Quito el 25 de abril 2026.

**How to apply:** El siguiente bloque es el Bloque 2 (Pasos 5–7): tipos/constantes, formulario de registro, perfil público.

## Pasos completados

- **Paso 1:** Next.js 16.2.4 inicializado con TypeScript, Tailwind, App Router, ESLint. Todas las dependencias instaladas (@clerk/nextjs, @supabase/supabase-js, @google/generative-ai, react-hook-form, zod, @hookform/resolvers, lucide-react, cva, clsx, tailwind-merge). shadcn/ui inicializado con: button, input, textarea, select, badge, card, avatar, sonner.
- **Paso 2:** lib/supabase/client.ts, lib/supabase/server.ts (con createServerClient y createServiceRoleClient), lib/supabase/types.ts (placeholder tipado).
- **Paso 3:** proxy.ts (Clerk middleware — Next.js 16 usa proxy.ts no middleware.ts), páginas sign-in/sign-up con ClerkProvider en layout.tsx.
- **Estructura base:** app/page.tsx, app/devs/page.tsx, app/devs/[username]/page.tsx, app/ask/page.tsx, app/registro/page.tsx, app/api/ask/route.ts, hooks/use-profile.ts, hooks/use-devs.ts, types/index.ts, lib/gemini.ts.

## Build status
`npm run build` pasa sin errores ni warnings.
