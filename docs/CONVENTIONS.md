# CONVENTIONS — DevMap Ecuador

Reglas de código, nomenclatura y patrones a seguir consistentemente en todo el proyecto. Cualquier agente de IA o desarrollador debe seguir estas convenciones sin excepción.

---

## Nomenclatura general

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `DevCard.tsx`, `ProfileForm.tsx` |
| Hooks | camelCase con prefijo `use` | `useProfile.ts`, `useDevs.ts` |
| Funciones utilitarias | camelCase | `formatAvailability()`, `buildContext()` |
| Variables y constantes | camelCase | `profileData`, `isLoading` |
| Constantes globales | UPPER_SNAKE_CASE | `MAX_PROJECTS`, `CITIES_ECUADOR` |
| Archivos de tipos | camelCase o PascalCase | `types/index.ts` |
| API routes | kebab-case en carpeta | `app/api/ask/route.ts` |
| CSS classes | Tailwind directo, sin custom classes salvo necesario | |

---

## Estructura de componentes

Todo componente sigue este orden interno:

```typescript
// 1. Imports externos
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Imports internos (tipos, hooks, utils, otros componentes)
import { DevProfile } from '@/types'
import { useProfile } from '@/hooks/use-profile'

// 3. Tipos/interfaces locales del componente
interface DevCardProps {
  profile: DevProfile
  compact?: boolean
}

// 4. Componente
export function DevCard({ profile, compact = false }: DevCardProps) {
  // 4a. Hooks
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  // 4b. Handlers
  const handleClick = () => router.push(`/devs/${profile.username}`)

  // 4c. Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  )
}
```

---

## Tipos globales (`types/index.ts`)

```typescript
export type Availability =
  | 'empleado'
  | 'freelance'
  | 'buscando_empleo'
  | 'abierto_oportunidades'

export type TechCategory =
  | 'Frontend'
  | 'Backend'
  | 'Mobile'
  | 'DevOps'
  | 'Data'
  | 'Gaming'
  | 'Testing'
  | 'Other'

export interface Technology {
  id: string
  name: string
  category: TechCategory
}

export interface Project {
  id: string
  name: string
  description?: string
  url?: string
}

export interface DevProfile {
  id: string
  username: string
  full_name: string
  email: string
  avatar_url?: string
  city: string
  bio?: string
  years_experience?: number
  availability: Availability
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
  is_public: boolean
  technologies: Technology[]
  projects: Project[]
  created_at: string
}

export interface EcosystemStats {
  total_devs: number
  total_cities: number
  top_technologies: { name: string; total: number }[]
  availability_breakdown: { availability: Availability; total: number }[]
}
```

---

## Constantes del dominio (`lib/constants.ts`)

```typescript
export const CITIES_ECUADOR = [
  'Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Loja',
  'Manta', 'Portoviejo', 'Machala', 'Esmeraldas',
  'Riobamba', 'Ibarra', 'Santo Domingo', 'Otra'
]

export const AVAILABILITY_LABELS: Record<string, string> = {
  empleado: 'Empleado',
  freelance: 'Freelance',
  buscando_empleo: 'Buscando empleo',
  abierto_oportunidades: 'Abierto a oportunidades',
}

export const AVAILABILITY_COLORS: Record<string, string> = {
  empleado: 'bg-gray-100 text-gray-700',
  freelance: 'bg-blue-100 text-blue-700',
  buscando_empleo: 'bg-green-100 text-green-700',
  abierto_oportunidades: 'bg-yellow-100 text-yellow-700',
}

export const MAX_PROJECTS = 3
export const MAX_BIO_CHARS = 500
export const MAX_PROJECT_DESC_CHARS = 300
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 30
```

---

## Patrones de data fetching

### Server Components (preferido para datos iniciales)
```typescript
// app/devs/page.tsx
export default async function DevsPage() {
  const supabase = createServerClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*, profile_technologies(technology_id, technologies(*))')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return <DevDirectory initialProfiles={profiles} />
}
```

### Client Components (para interactividad)
```typescript
'use client'
// Reciben datos iniciales por props, luego pueden re-fetchear si es necesario
// Usar useState + useEffect solo cuando sea estrictamente necesario
```

---

## Manejo de errores

```typescript
// API Routes — siempre retornar estructura consistente
return Response.json({ error: 'Mensaje descriptivo' }, { status: 400 })
return Response.json({ data: result }, { status: 200 })

// Componentes — mostrar estados de error visibles al usuario
if (error) return <ErrorMessage message="No pudimos cargar los perfiles" />
```

---

## Alias de imports (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Usar siempre `@/` para imports internos, nunca rutas relativas con `../../`.

```typescript
// ✅ Correcto
import { DevCard } from '@/components/dev-card'
import { CITIES_ECUADOR } from '@/lib/constants'

// ❌ Incorrecto
import { DevCard } from '../../components/dev-card'
```

---

## Reglas específicas para este proyecto

- **Nunca hardcodear ciudades** — usar siempre `CITIES_ECUADOR` de constants
- **Nunca mostrar email en perfiles públicos** — solo en el panel privado del usuario
- **Avatar fallback obligatorio** — si no hay `avatar_url`, mostrar iniciales del nombre
- **Siempre validar username** — solo `[a-z0-9-]`, lowercase, sin espacios
- **El chat `/ask` no guarda historial** — cada sesión es fresh, sin persistencia en DB
- **Las API routes usan `SUPABASE_SERVICE_ROLE_KEY`** — no la anon key, para bypass de RLS cuando se necesita contexto completo para la IA

## Convenciones específicas de Next.js 16

- **`proxy.ts` en lugar de `middleware.ts`** — Next.js 16 cambió la convención para el archivo de middleware de Clerk. Usar siempre `proxy.ts` en la raíz del proyecto
- **`sonner` en lugar de shadcn toast** — el componente `toast` de shadcn está deprecado. Usar siempre `import { toast } from 'sonner'` en los componentes. Sonner ya está instalado como dependencia de shadcn/ui
- **`Button asChild` no funciona** — para botones que envuelven links usar `<Link className={cn(buttonVariants({ variant }))} />` directamente, nunca `<Button asChild>`
- **`lucide-react` no tiene iconos Github ni Linkedin** — usar `Link2` para LinkedIn y `Globe` para portfolio/sitio web como reemplazos
- **Zod `.default('')` con `zodResolver` genera conflicto** — usar siempre `.optional()` en campos no requeridos y manejar los valores iniciales con `defaultValues` en `useForm`

---

## Convención de rutas

Todas las rutas de la aplicación deben estar en **inglés**. El español queda exclusivamente para la UI (labels, textos, mensajes).

```
✅ Correcto        ❌ Incorrecto
/register          /registro
/devs              /devs  → ya correcto
/ask               /ask   → ya correcto
/sign-in           /iniciar-sesion
/sign-up           /registrarse
```

Actualizar también las variables de entorno de Clerk:
```bash
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/register
```
