---
name: Stack Notes
description: Decisiones técnicas no obvias del stack — diferencias con documentación estándar
type: feedback
---

**Next.js 16 usa `proxy.ts` en lugar de `middleware.ts`.** El archivo de middleware de Clerk debe llamarse `proxy.ts` en este proyecto (Next.js 16.2.4+).

**Why:** Next.js 16 deprecó la convención `middleware.ts` y la reemplazó con `proxy.ts`. El build muestra warning si se usa el nombre viejo.

**How to apply:** Siempre crear/editar `proxy.ts` en la raíz, nunca `middleware.ts`.

---

**shadcn/ui usa `sonner` en lugar de `toast`.** El componente `toast` fue deprecado en shadcn/ui y reemplazado por `sonner`.

**Why:** La CLI de shadcn rechaza `toast` con error explícito de deprecación.

**How to apply:** Usar `import { Toaster } from '@/components/ui/sonner'` en layout.tsx y `import { toast } from 'sonner'` en componentes.

---

**shadcn Button NO soporta `asChild`.** Este proyecto usa shadcn v4 con Base UI (`@base-ui/react/button`) en lugar de Radix UI.

**Why:** shadcn v4 migró a Base UI para Button, que usa `render` prop en lugar de `asChild`.

**How to apply:** Para botones que son links, usar `<Link className={cn(buttonVariants({ variant: '...' }))} />` en lugar de `<Button asChild>`.

---

**`createServiceRoleClient()` NO usa el genérico `<Database>`.** En `lib/supabase/server.ts`, el cliente de service role se crea sin el tipo Database para evitar conflictos con el placeholder de tipos.

**Why:** El placeholder de tipos en `lib/supabase/types.ts` genera conflictos de tipo cuando se pasa como genérico al cliente de service role. Cuando se regeneren los tipos con Supabase CLI, se puede agregar `<Database>`.

**How to apply:** El cliente service role es no tipado. Usar `as unknown as TuTipo` para castear los datos al tipo esperado.

---

**Zod `.default('')` genera conflictos con `zodResolver` de react-hook-form.** No usar `.default()` en los schemas de zod que se usan con react-hook-form.

**Why:** `.default()` cambia el tipo de output del campo (opcional→requerido), lo que causa conflictos de tipo entre el schema y las expectativas del resolver.

**How to apply:** Usar solo `.optional()` en el schema, y poner los valores default en el `defaultValues` del `useForm`.

---

**lucide-react en esta versión NO tiene `Github` ni `Linkedin` como nombres de ícono.**

**Why:** Estos íconos de marca no existen en la versión instalada de lucide-react.

**How to apply:** Para GitHub usar `Link2`, para LinkedIn usar `Link2`. Para portfolio usar `Globe`.
