# PLAN — DevMap Ecuador
## Pasos de desarrollo — Sprint al 25 de abril de 2026

Los pasos son secuenciales pero no están atados a días. Puedes completar varios en una sesión si el avance lo permite. Al terminar cada paso, marca el checkbox y actualiza el estado en `AI_CONTEXT.md`.

---

## 🏗️ BLOQUE 1 — Setup y base del proyecto

### Paso 1 — Inicializar el proyecto
- [ ] Crear repo en GitHub: `devmap-ecuador`
- [ ] Inicializar Next.js con TypeScript y Tailwind:
  ```bash
  npx create-next-app@latest devmap-ecuador --typescript --tailwind --app
  ```
- [ ] Instalar dependencias base:
  ```bash
  npm install @clerk/nextjs @supabase/supabase-js @google/generative-ai
  npm install react-hook-form zod @hookform/resolvers
  npm install lucide-react class-variance-authority clsx tailwind-merge
  npx shadcn@latest init
  npx shadcn@latest add button input textarea select badge card avatar toast
  ```
- [ ] Agregar carpeta `/docs` con todos los `.md` al repo
- [ ] Crear `.env.local` y `.env.example` con las variables del `STACK.md`

**✅ Entregable:** `npm run dev` corre sin errores

---

### Paso 2 — Configurar Supabase
- [ ] Crear proyecto en Supabase
- [ ] Ejecutar el SQL completo de `DATA_MODEL.md` (tablas, RLS, seed de `technologies`)
- [ ] Copiar `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SERVICE_ROLE_KEY` al `.env.local`
- [ ] Crear `lib/supabase/client.ts` y `lib/supabase/server.ts`
- [ ] Verificar conexión consultando la tabla `technologies` desde el código

**✅ Entregable:** Query a Supabase retorna las tecnologías del seed sin errores

---

### Paso 3 — Configurar Clerk
- [ ] Crear aplicación en Clerk (clerk.com)
- [ ] Copiar `PUBLISHABLE_KEY` y `SECRET_KEY` al `.env.local`
- [ ] Crear `middleware.ts` protegiendo `/registro` y `/api/ask`
- [ ] Crear páginas `/sign-in` y `/sign-up` con componentes de Clerk
- [ ] Verificar que rutas protegidas redirigen al login

**✅ Entregable:** Flujo de sign up/sign in funciona end to end

---

### Paso 4 — Deploy inicial en Vercel
- [ ] Conectar repo de GitHub a Vercel
- [ ] Agregar todas las variables de entorno en Vercel Dashboard
- [ ] Hacer primer deploy y verificar que la URL pública funciona

**✅ Entregable:** URL de Vercel activa (aunque la app esté vacía)

---

## 👤 BLOQUE 2 — Perfil y registro

### Paso 5 — Tipos, constantes y estructura base
- [ ] Crear `types/index.ts` con todos los tipos del `CONVENTIONS.md`
- [ ] Crear `lib/constants.ts` con `CITIES_ECUADOR`, `AVAILABILITY_LABELS`, `AVAILABILITY_COLORS` y demás constantes
- [ ] Crear `lib/utils.ts` con helpers básicos (cn, formatAvailability, getInitials)

**✅ Entregable:** Tipos y constantes disponibles sin errores de TypeScript

---

### Paso 6 — Formulario de registro (`/registro`)
- [ ] Construir `ProfileForm` con react-hook-form + zod
- [ ] Incluir todos los campos definidos en `PAGES.md`
- [ ] Multi-select de tecnologías cargado desde Supabase
- [ ] Sección de proyectos dinámica (agregar/eliminar, máx 3)
- [ ] Lógica de upsert: guardar en `profiles`, `profile_technologies` y `projects`
- [ ] Validación de username único contra Supabase
- [ ] Redirect a `/devs/[username]` con toast de éxito al guardar

**✅ Entregable:** Puedes crear tu propio perfil como primer usuario beta

---

### Paso 7 — Perfil público (`/devs/[username]`)
- [ ] Construir página con SSR (`generateMetadata` para SEO y Open Graph)
- [ ] Todas las secciones definidas en `PAGES.md`: header, bio, stack, proyectos
- [ ] Manejo de 404 si el username no existe
- [ ] Botón "Editar perfil" visible solo para el dueño del perfil
- [ ] Avatar con fallback de iniciales si no hay foto

**✅ Entregable:** Perfil público accesible en `/devs/tu-username`

---

## 🗂️ BLOQUE 3 — Directorio

### Paso 8 — DevCard component
- [ ] Construir `dev-card.tsx` con toda la info definida en `PAGES.md`
- [ ] Badge de disponibilidad con colores de `AVAILABILITY_COLORS`
- [ ] Primeras 4-5 tecnologías como badges
- [ ] Clickeable → navega a `/devs/[username]`

**✅ Entregable:** DevCard renderiza correctamente con datos mock

---

### Paso 9 — Directorio con filtros (`/devs`)
- [ ] Construir `dev-filters.tsx` (ciudad, tecnología, disponibilidad)
- [ ] Página `/devs` con datos iniciales desde servidor (SSR)
- [ ] Filtrado en cliente sin recargar página
- [ ] Estado vacío con mensaje amigable
- [ ] Diseño responsive mobile-first
- [ ] Grid de DevCards

**✅ Entregable:** `/devs` muestra perfiles reales con filtros funcionando

---

## 🤖 BLOQUE 4 — IA y Landing

### Paso 10 — Integración con Gemini (`/api/ask`)
- [ ] Crear `lib/gemini.ts` con configuración del SDK de Google:
  ```typescript
  import { GoogleGenerativeAI } from '@google/generative-ai'
  export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  ```
- [ ] Construir API Route `/api/ask/route.ts`:
  - Query a Supabase con `SERVICE_ROLE_KEY` para obtener contexto completo
  - Construcción del system instruction con los datos reales de perfiles
  - Llamada a `gemini-2.5-flash` con la pregunta + contexto
  - Respuesta en streaming
- [ ] System instruction base:
  ```
  Eres el asistente de DevMap Ecuador, un directorio del talento tech ecuatoriano.
  Tienes acceso a los datos reales de los desarrolladores registrados.
  Responde en español, de forma clara y amigable.
  Si algo no está en los datos, dilo honestamente. No inventes información.
  DATOS ACTUALES: [contexto dinámico de Supabase]
  ```
- [ ] Probar el endpoint con preguntas de prueba

**✅ Entregable:** El endpoint responde preguntas sobre los perfiles registrados

---

### Paso 11 — Chat UI (`/ask`)
- [ ] Construir `ask-chat.tsx`:
  - Historial de mensajes (usuario derecha, IA izquierda)
  - Indicador de "escribiendo..." durante la espera
  - Input con envío por Enter o botón
- [ ] Chips de preguntas sugeridas al iniciar la sesión:
  - "¿Cuántos devs hay registrados?"
  - "¿Cuáles son las tecnologías más usadas?"
  - "¿Cuántos devs están buscando empleo en Quito?"
  - "¿Qué devs tienen experiencia en React Native?"
- [ ] Conectar con `/api/ask` en streaming
- [ ] Página `/ask` con la interfaz completa

**✅ Entregable:** Chat funciona end to end con respuestas de Gemini

---

### Paso 12 — Ecosystem Stats y Landing (`/`)
- [ ] Construir `ecosystem-stats.tsx` con queries reales a Supabase:
  - Total de devs registrados
  - Total de ciudades representadas
  - Top 3 tecnologías más usadas
  - % de devs disponibles
- [ ] Construir landing completa con todas las secciones de `PAGES.md`:
  - Hero con CTAs
  - Ecosystem Stats
  - Últimos 6 perfiles
  - Preview del `/ask`
  - CTA final

**✅ Entregable:** Landing con datos reales del ecosistema

---

## ✨ BLOQUE 5 — Polish y demo

### Paso 13 — Revisión visual y responsive
- [ ] Revisar todas las páginas en mobile (375px) y desktop (1280px)
- [ ] Consistencia de colores, tipografía y espaciado
- [ ] Favicon, nombre en tab del browser y meta description global
- [ ] Open Graph tags en `/devs/[username]` para compartir en redes

**✅ Entregable:** La plataforma se ve profesional en cualquier dispositivo

---

### Paso 14 — Beta con conocidos
- [ ] Compartir URL con conocidos devs ecuatorianos
- [ ] Objetivo mínimo: **15 perfiles** antes del evento
- [ ] Verificar que el flujo de registro funciona para usuarios nuevos sin ayuda
- [ ] Corregir cualquier bug que reporten los beta testers

**✅ Entregable:** 15+ perfiles reales en la plataforma

---

### Paso 15 — Preparar demo para el evento
- [ ] Definir las preguntas de demo para `/ask`:
  - "¿Cuántos desarrolladores hay registrados y de qué ciudades son?"
  - "¿Cuál es la tecnología más usada en el ecosistema tech ecuatoriano?"
  - "¿Hay devs disponibles para freelance en Quito con experiencia en React?"
- [ ] Hacer un dry run completo del demo script
- [ ] Verificar que el deploy de Vercel está actualizado

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
| 1 | Inicializar proyecto | ⬜ |
| 2 | Configurar Supabase | ⬜ |
| 3 | Configurar Clerk | ⬜ |
| 4 | Deploy inicial Vercel | ⬜ |
| 5 | Tipos y constantes | ⬜ |
| 6 | Formulario de registro | ⬜ |
| 7 | Perfil público | ⬜ |
| 8 | DevCard component | ⬜ |
| 9 | Directorio con filtros | ⬜ |
| 10 | Integración Gemini API | ⬜ |
| 11 | Chat UI `/ask` | ⬜ |
| 12 | Ecosystem Stats y Landing | ⬜ |
| 13 | Revisión visual y responsive | ⬜ |
| 14 | Beta con conocidos | ⬜ |
| 15 | Preparar demo | ⬜ |
