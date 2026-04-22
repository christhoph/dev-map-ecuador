# PLAN — DevMap Ecuador
## Pasos de desarrollo — Sprint al 25 de abril de 2026

Los pasos son secuenciales pero no están atados a días. Puedes completar varios en una sesión si el avance lo permite. Al terminar cada paso, marca el checkbox y actualiza el estado en `AI_CONTEXT.md`.

---

## 🏗️ BLOQUE 1 — Setup y base del proyecto

### Paso 1 — Inicializar el proyecto
- [x] Crear repo en GitHub: `devmap-ecuador`
- [x] Inicializar Next.js con TypeScript y Tailwind:
  ```bash
  npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint --yes
  ```
- [x] Instalar dependencias base:
  ```bash
  npm install @clerk/nextjs @supabase/supabase-js @supabase/ssr @google/generative-ai
  npm install react-hook-form zod @hookform/resolvers
  npm install lucide-react class-variance-authority clsx tailwind-merge
  npx shadcn@latest init --yes --defaults
  npx shadcn@latest add input textarea select badge card avatar sonner --yes
  ```
- [x] Agregar carpeta `/docs` con todos los `.md` al repo
- [x] Crear `.env.local` y `.env.example` con las variables del `STACK.md`

**✅ Entregable:** `npm run build` corre sin errores

---

### Paso 2 — Configurar Supabase
- [x] Crear proyecto en Supabase
- [x] Ejecutar el SQL completo de `DATA_MODEL.md` (tablas, RLS, seed de `technologies`)
- [x] Copiar `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SERVICE_ROLE_KEY` al `.env.local`
- [x] Crear `lib/supabase/client.ts` y `lib/supabase/server.ts`
- [x] Verificar conexión consultando la tabla `technologies` desde el código

**✅ Entregable:** Query a Supabase retorna las tecnologías del seed sin errores

---

### Paso 3 — Configurar Clerk
- [x] Crear aplicación en Clerk (clerk.com)
- [x] Copiar `PUBLISHABLE_KEY` y `SECRET_KEY` al `.env.local`
- [x] Crear `proxy.ts` protegiendo `/register` y `/api/ask` (⚠️ ver Notas)
- [x] Crear páginas `/sign-in` y `/sign-up` con componentes de Clerk
- [x] Verificar que rutas protegidas redirigen al login

**✅ Entregable:** Flujo de sign up/sign in funciona end to end

---

### Paso 4 — Deploy inicial en Vercel
- [x] Conectar repo de GitHub a Vercel
- [x] Agregar todas las variables de entorno en Vercel Dashboard
- [x] Hacer primer deploy y verificar que la URL pública funciona

**✅ Entregable:** URL de Vercel activa (aunque la app esté vacía)

---

## 👤 BLOQUE 2 — Perfil y registro

### Paso 5 — Tipos, constantes y estructura base
- [x] Crear `types/index.ts` con todos los tipos del `CONVENTIONS.md`
- [x] Crear `lib/constants.ts` con `CITIES_ECUADOR`, `AVAILABILITY_LABELS`, `AVAILABILITY_COLORS` y demás constantes
- [x] Crear `lib/utils.ts` con helpers básicos (cn, formatAvailability, getInitials)

**✅ Entregable:** Tipos y constantes disponibles sin errores de TypeScript

---

### Paso 6 — Formulario de registro (`/register`)
- [x] Construir `ProfileForm` con react-hook-form + zod
- [x] Incluir todos los campos definidos en `PAGES.md`
- [x] Multi-select de tecnologías cargado desde Supabase
- [x] Sección de proyectos dinámica (agregar/eliminar, máx 3)
- [x] Lógica de upsert: guardar en `profiles`, `profile_technologies` y `projects`
- [x] Validación de username único contra Supabase
- [x] Redirect a `/devs/[username]` con toast de éxito al guardar

**✅ Entregable:** Puedes crear tu propio perfil como primer usuario beta

---

### Paso 7 — Perfil público (`/devs/[username]`)
- [x] Construir página con SSR (`generateMetadata` para SEO y Open Graph)
- [x] Todas las secciones definidas en `PAGES.md`: header, bio, stack, proyectos
- [x] Manejo de 404 si el username no existe
- [x] Botón "Editar perfil" visible solo para el dueño del perfil
- [x] Avatar con fallback de iniciales si no hay foto

**✅ Entregable:** Perfil público accesible en `/devs/tu-username`

---

## 🗂️ BLOQUE 3 — Directorio

### Paso 8 — DevCard component
- [x] Construir `dev-card.tsx` con toda la info definida en `PAGES.md`
- [x] Badge de disponibilidad con colores de `AVAILABILITY_COLORS`
- [x] Primeras 4-5 tecnologías como badges
- [x] Clickeable → navega a `/devs/[username]`

**✅ Entregable:** DevCard renderiza correctamente con datos reales

---

### Paso 9 — Directorio con filtros (`/devs`)
- [x] Construir `dev-filters.tsx` (ciudad, tecnología, disponibilidad)
- [x] Página `/devs` con datos iniciales desde servidor (SSR)
- [x] Filtrado en cliente sin recargar página
- [x] Estado vacío con mensaje amigable
- [x] Diseño responsive mobile-first
- [x] Grid de DevCards

**✅ Entregable:** `/devs` muestra perfiles reales con filtros funcionando

---

## 🤖 BLOQUE 4 — IA y Landing

### Paso 10 — Integración con Gemini (`/api/ask`)
- [x] Crear `lib/gemini.ts` con configuración del SDK de Google:
  ```typescript
  import { GoogleGenerativeAI } from '@google/generative-ai'
  export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  ```
- [x] Construir API Route `/api/ask/route.ts`:
  - Query a Supabase con `SERVICE_ROLE_KEY` para obtener contexto completo
  - Construcción del system instruction con los datos reales de perfiles
  - Llamada a `gemini-2.5-flash` con la pregunta + contexto
  - Respuesta en streaming
- [x] System instruction base:
  ```
  Eres el asistente de DevMap Ecuador, un directorio del talento tech ecuatoriano.
  Tienes acceso a los datos reales de los desarrolladores registrados.
  Responde en español, de forma clara y amigable.
  Si algo no está en los datos, dilo honestamente. No inventes información.
  DATOS ACTUALES: [contexto dinámico de Supabase]
  ```
- [x] Probar el endpoint con preguntas de prueba

**✅ Entregable:** El endpoint responde preguntas sobre los perfiles registrados

---

### Paso 11 — Chat UI (`/ask`)
- [x] Construir `ask-chat.tsx`:
  - Historial de mensajes (usuario derecha, IA izquierda)
  - Indicador de "escribiendo..." durante la espera
  - Input con envío por Enter o botón
- [x] Chips de preguntas sugeridas al iniciar la sesión:
  - "¿Cuántos devs hay registrados?"
  - "¿Cuáles son las tecnologías más usadas?"
  - "¿Cuántos devs están buscando empleo en Quito?"
  - "¿Qué devs tienen experiencia en React Native?"
- [x] Conectar con `/api/ask` en streaming
- [x] Página `/ask` con la interfaz completa

**✅ Entregable:** Chat funciona end to end con respuestas de Gemini

---

### Paso 12 — Ecosystem Stats y Landing (`/`)
- [x] Construir ecosystem stats con queries reales a Supabase (inline en `app/page.tsx`):
  - Total de devs registrados
  - Total de ciudades representadas
  - Top 3 tecnologías más usadas
  - % de devs disponibles
- [x] Construir landing completa con todas las secciones de `PAGES.md`:
  - Hero con CTAs
  - Ecosystem Stats
  - Últimos 6 perfiles
  - Preview del `/ask`
  - CTA final

**✅ Entregable:** Landing con datos reales del ecosistema

---

## ✨ BLOQUE 5 — Polish y demo

### Paso 13 — Revisión visual y responsive
- [x] Revisar todas las páginas en mobile (375px) y desktop (1280px)
- [x] Consistencia de colores, tipografía y espaciado
- [x] Favicon, nombre en tab del browser y meta description global
- [x] Open Graph tags en `/devs/[username]` para compartir en redes

**✅ Entregable:** La plataforma se ve profesional en cualquier dispositivo

---

### Paso 14 — Beta con conocidos
- [x] Compartir URL con conocidos devs ecuatorianos
- [x] Objetivo mínimo: **15 perfiles** antes del evento
- [x] Verificar que el flujo de registro funciona para usuarios nuevos sin ayuda
- [x] Corregir cualquier bug que reporten los beta testers

**✅ Entregable:** 15+ perfiles reales en la plataforma

---

### Paso 15 — Preparar demo para el evento
- [x] Definir las preguntas de demo para `/ask`:
  - "¿Cuántos desarrolladores hay registrados y de qué ciudades son?"
  - "¿Cuál es la tecnología más usada en el ecosistema tech ecuatoriano?"
  - "¿Hay devs disponibles para freelance en Quito con experiencia en React?"
- [x] Hacer un dry run completo del demo script
- [x] Verificar que el deploy de Vercel está actualizado

**✅ Entregable:** Demo ensayada y lista para presentar

---

## 🎉 EVENTO — 25 de abril, USFQ Cumbayá

### Demo script (5 minutos)

| Tiempo | Acción |
|---|---|
| 0:00 – 0:30 | Abrir landing — mostrar stats reales del ecosistema |
| 0:30 – 1:30 | Ir a `/devs` — mostrar directorio y aplicar un filtro en vivo |
| 1:30 – 2:00 | Abrir un perfil — el tuyo o de alguien conocido en la sala |
| 2:00 – 4:00 | Ir a `/ask` — hacer las 3 preguntas de demo preparadas |
| 4:00 – 5:00 | Mostrar la URL y pedir a la audiencia que entren desde su teléfono |

---

## Progreso

| Paso | Descripción | Estado |
|---|---|---|
| 1 | Inicializar proyecto | ✅ |
| 2 | Configurar Supabase | ✅ |
| 3 | Configurar Clerk | ✅ |
| 4 | Deploy inicial Vercel | ✅ |
| 5 | Tipos y constantes | ✅ |
| 6 | Formulario de registro | ✅ |
| 7 | Perfil público | ✅ |
| 8 | DevCard component | ✅ |
| 9 | Directorio con filtros | ✅ |
| 10 | Integración Gemini API | ✅ |
| 11 | Chat UI `/ask` | ✅ |
| 12 | Ecosystem Stats y Landing | ✅ |
| 13 | Revisión visual y responsive | ✅ |
| 14 | Beta con conocidos | ✅ |
| 15 | Preparar demo | ✅ |

---

## Notas por bloque

Observaciones técnicas encontradas durante el desarrollo. Leer antes de continuar con el siguiente bloque.

### BLOQUE 1

**`proxy.ts` en lugar de `middleware.ts`**
Next.js 16 deprecó la convención `middleware.ts`. El archivo de middleware de Clerk debe llamarse `proxy.ts` en la raíz del proyecto. El build muestra un warning si se usa el nombre antiguo.

**`sonner` en lugar de `toast` de shadcn**
El componente `toast` de shadcn está deprecado. La CLI de shadcn rechaza su instalación con un error explícito. Usar siempre:
- En `layout.tsx`: `import { Toaster } from '@/components/ui/sonner'`
- En componentes: `import { toast } from 'sonner'`

**shadcn init con `--defaults`**
Para evitar el prompt interactivo de shadcn en CI/CD o scripts, usar:
```bash
echo "" | npx shadcn@latest init --yes --defaults
```

### BLOQUE 2

**`Button asChild` no funciona en este proyecto**
shadcn v4 usa Base UI (`@base-ui/react/button`) en lugar de Radix UI. Base UI no soporta la prop `asChild`. Para botones que envuelven links usar siempre:
```tsx
import { buttonVariants } from '@/components/ui/button'
<Link href="..." className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
  Texto
</Link>
```

**`lucide-react` no tiene iconos de marcas (`Github`, `Linkedin`)**
En la versión instalada, los iconos de marca no existen. Reemplazos:
- GitHub → `Link2`
- LinkedIn → `Link2`
- Portfolio/Web → `Globe`

**Zod `.default('')` + `zodResolver` generan conflicto de tipos**
`.default('')` cambia el tipo de output de un campo (opcional → requerido), lo que provoca un error de TypeScript con el resolver de react-hook-form. Regla: usar siempre solo `.optional()` en el schema y manejar los valores vacíos con `defaultValues` en `useForm`.

**`createServiceRoleClient()` sin el genérico `<Database>`**
El placeholder de `lib/supabase/types.ts` causa conflictos de tipo cuando se pasa como genérico al cliente de service role. Solución: `createServiceRoleClient()` se crea sin genérico (cliente no tipado). Para castear los datos, usar `as unknown as MiTipo` con interfaces locales explícitas.

**Rutas en inglés**
Todas las rutas de la app deben estar en inglés: `/register` (no `/registro`), `/sign-in`, `/sign-up`. El español solo para UI (labels, textos, mensajes). Actualizar las variables de Clerk: `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/register`.

### BLOQUE 3

**`export const dynamic = 'force-dynamic'` en páginas con Supabase sin segmentos dinámicos**
Next.js intenta pre-renderizar las páginas estáticas (sin `[params]`) en build time. Si la página usa Supabase (que requiere env vars en runtime), el build falla con `"URL and Key are required"`. Solución: agregar `export const dynamic = 'force-dynamic'` en la página.

**Base UI Select `onValueChange` tipado como `(value: string | null) => void`**
La prop `onValueChange` del Select de Base UI puede pasar `null`. Al usarla con `useState<string>`, añadir fallback:
```tsx
onValueChange={(value) => setSelectedState(value ?? DEFAULT_VALUE)}
```

**`DevCardProfile` como tipo reducido de `DevProfile`**
Para el directorio no se necesita `email`, `projects` ni `is_public`. Se definió `DevCardProfile` en `types/index.ts` como subconjunto de `DevProfile` para mantener los datos mínimos en la query y en memoria del cliente.

### BLOQUE 4

**`SignedIn` / `SignedOut` no existen en esta versión de `@clerk/nextjs`**
La versión instalada no exporta `SignedIn` ni `SignedOut`. Reemplazos:
- En Server Components: usar `auth()` de `@clerk/nextjs/server` para obtener `userId`
- En Client Components: usar `useAuth()` hook → `const { isSignedIn } = useAuth()`
- `Nav` debe ser `'use client'` para usar `useAuth` y `UserButton`

**`UserButton` no acepta `afterSignOutUrl`**
La prop `afterSignOutUrl` no existe en esta versión de `UserButton`. Simplemente omitirla — el comportamiento por defecto es aceptable.

**`Nav` como Client Component en el layout**
El layout de Next.js es un Server Component, pero incluir un Client Component (`Nav`) es válido. El cliente hidrata la parte del nav mientras el resto del layout sigue siendo server-rendered.

**Streaming con `ReadableStream` nativo**
El endpoint `/api/ask` usa `ReadableStream` nativo de la Web API (no el SDK de streaming de Vercel). El cliente lee el stream con `res.body.getReader()` + `TextDecoder` en un loop `while (done, value)`.

**`geminiFlash.generateContentStream` con `systemInstruction` como string**
La API de Google Generative AI acepta `systemInstruction` como string directamente en `generateContentStream`. No necesita estar en el array `contents`.

**`crypto.randomUUID()` disponible en el cliente**
Para generar IDs de mensajes en el chat, `crypto.randomUUID()` está disponible globalmente en el browser moderno y en Node.js 19+. No se necesita ninguna librería adicional.

---

## Notas técnicas por bloque

Resumen ejecutivo de los hallazgos más importantes. Leer antes de retomar el proyecto.

### Bloque 1
- **`proxy.ts` en lugar de `middleware.ts`** — Next.js 16 deprecó el nombre `middleware.ts`. El archivo de Clerk debe llamarse `proxy.ts` en la raíz del proyecto.
- **`sonner` en lugar de shadcn toast** — El componente `toast` de shadcn está deprecado y la CLI rechaza su instalación. Usar `import { Toaster } from '@/components/ui/sonner'` en el layout e `import { toast } from 'sonner'` en los componentes.

### Bloque 2
- **`Button asChild` no funciona** — shadcn v4 usa Base UI que no soporta `asChild`. Para botones-link usar `<Link href="..." className={cn(buttonVariants({ variant, size }))}>`.
- **`lucide-react` no tiene iconos de marcas** — `Github` y `Linkedin` no existen. Usar `Link2` para GitHub y LinkedIn, `Globe` para portfolio.
- **Zod `.default('')` + `zodResolver` generan conflicto de tipos** — `.default('')` cambia el tipo del campo y rompe el resolver. Usar solo `.optional()` en el schema y manejar valores vacíos con `defaultValues` en `useForm`.

### Bloque 3
- **Rutas estandarizadas en inglés** — `/register` en lugar de `/registro`. Actualizar también `proxy.ts`, `.env.local`, `.env.example` y cualquier `<Link>` que apunte a la ruta antigua.

### Bloque 4
- **Streaming con `ReadableStream` nativo** — El endpoint `/api/ask` usa `ReadableStream` de la Web API. El cliente lee con `res.body.getReader()` + `TextDecoder` en un loop hasta `done === true`.
- **`/api/ask` protegido con `auth()` de Clerk** — La ruta valida `userId` al inicio y retorna 401 si no hay sesión. Registrar la ruta en `proxy.ts` para protección adicional a nivel de middleware.

### Bloque 5
- **`min-h-screen` bajo Nav genera doble scroll** — usar `flex-1` cuando el `body` del layout es `flex flex-col`.
- **`not-found.tsx` en raíz de `app/` captura todos los `notFound()`** — incluyendo los llamados desde Server Components con `notFound()`.
- **`usePathname()` para active links requiere `'use client'`** — no se puede usar en Server Components.
- **Sección de perfiles vacíos siempre renderiza** — para dar contexto al usuario en lugar de ocultar la sección completa.

---

## Post-evento — Features adicionales

- [x] Página /feedback con formulario y tabla en Supabase
- [ ] Importación desde GitHub API
- [ ] Sección de experiencia laboral en perfil
- [ ] Modo oscuro
- [ ] Tests unitarios

---

## ✅ MVP Completado — 22 abril 2026

Todos los pasos finalizados. Variables de entorno configuradas en local y Vercel.
Plataforma lista para demo el 25 de abril de 2026.
URL de producción: https://dev-map-ecuador.vercel.app
