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
