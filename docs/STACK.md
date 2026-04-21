# STACK — DevMap Ecuador

## Decisiones técnicas

### Frontend
- **Framework:** Next.js 14+ con App Router y TypeScript
- **Por qué:** SSR para SEO, stack principal del dev, deploy trivial en Vercel
- **Estilos:** Tailwind CSS — velocidad de desarrollo, resultado visual limpio sin CSS custom
- **Componentes UI:** shadcn/ui — componentes accesibles, sin overhead, copiables al proyecto

### Autenticación
- **Librería:** Clerk
- **Por qué:** Setup en horas, UI de login/registro incluida, integración nativa con Next.js, free tier suficiente para MVP
- **Alternativa considerada:** NextAuth — descartado por mayor configuración requerida

### Base de datos
- **Servicio:** Supabase (PostgreSQL)
- **Por qué:** Free tier generoso, panel visual para ver datos, real-time out of the box, SDK tipado para TypeScript
- **ORM:** Supabase JS Client directo — no se usa Prisma ni Drizzle para mantener simplicidad en MVP

### Inteligencia Artificial
- **Proveedor:** Google Gemini API — modelo `gemini-2.5-flash`
- **Por qué:** Free tier real sin tarjeta de crédito, 250 requests/día suficientes para MVP y demo, contexto de 1M tokens
- **Uso:** Chat en `/ask` que responde preguntas sobre el ecosistema consultando perfiles reales de Supabase
- **Patrón:** El servidor consulta Supabase, construye contexto con los datos y se lo pasa a Gemini como system instruction
- **SDK:** `@google/generative-ai`
- **Límites free tier:** 10 RPM, 250 RPD, 250K TPM — más que suficiente para el MVP

### Deploy e infraestructura
- **Plataforma:** Vercel
- **Por qué:** Integración nativa con Next.js, deploy automático desde GitHub, dominio temporal gratuito para demo
- **Variables de entorno:** Vercel Dashboard — nunca en el repositorio

### Control de versiones
- **Plataforma:** GitHub
- **Rama principal:** `main`
- **Estrategia:** Feature branches por página/módulo, PRs antes de mergear a main

---

## Estructura de carpetas del proyecto

```
devmap-ecuador/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── devs/
│   │   ├── [username]/
│   │   │   └── page.tsx        ← Perfil público
│   │   └── page.tsx            ← Directorio con filtros
│   ├── ask/
│   │   └── page.tsx            ← Chat con IA
│   ├── registro/
│   │   └── page.tsx            ← Formulario de perfil
│   ├── api/
│   │   ├── ask/
│   │   │   └── route.ts        ← Endpoint del chat IA
│   │   └── github/
│   │       └── route.ts        ← Import desde GitHub (nice to have)
│   ├── layout.tsx
│   └── page.tsx                ← Landing
├── components/
│   ├── ui/                     ← shadcn/ui components
│   ├── dev-card.tsx            ← Tarjeta de dev en el directorio
│   ├── dev-filters.tsx         ← Filtros del directorio
│   ├── profile-form.tsx        ← Formulario de perfil
│   ├── ask-chat.tsx            ← Interfaz del chat con IA
│   └── ecosystem-stats.tsx     ← Stats del landing
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← Cliente browser
│   │   ├── server.ts           ← Cliente server
│   │   └── types.ts            ← Tipos generados de Supabase
│   ├── gemini.ts               ← Configuración Google Generative AI SDK
│   └── utils.ts                ← Helpers generales
├── hooks/
│   ├── use-profile.ts
│   └── use-devs.ts
├── types/
│   └── index.ts                ← Tipos globales del proyecto
├── docs/                       ← Esta carpeta de .md
├── .env.local                  ← Variables locales (en .gitignore)
├── .env.example                ← Template de variables (en repo)
└── middleware.ts               ← Protección de rutas con Clerk
```

---

## Variables de entorno requeridas

```bash
# .env.example

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/registro
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/registro

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google Gemini
GEMINI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Comandos del proyecto

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build de producción
npm run build

# Lint
npm run lint

# Generar tipos de Supabase (requiere Supabase CLI)
npx supabase gen types typescript --project-id [PROJECT_ID] > lib/supabase/types.ts
```
