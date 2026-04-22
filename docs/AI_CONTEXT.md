# AI_CONTEXT — DevMap Ecuador
## Archivo de contexto para agentes de IA (Claude Code / Google Antigravity)

Lee este archivo primero antes de cualquier tarea de desarrollo. Contiene todo lo necesario para entender el proyecto y generar código coherente.

---

## ¿Qué es este proyecto?

**DevMap Ecuador** es un directorio web del talento tech ecuatoriano. Los devs crean perfiles públicos con su stack, ciudad y disponibilidad. Hay un chat con IA que responde preguntas sobre el ecosistema usando datos reales.

Fue creado para el **Build with AI Challenge de GDG Quito** (25 abril 2026) por **Cristopher Solis**.

---

## Stack técnico (resumen rápido)

- **Next.js 14+ App Router + TypeScript**
- **Tailwind CSS + shadcn/ui**
- **Clerk** — autenticación
- **Supabase** — base de datos PostgreSQL
- **Claude API (claude-sonnet-4-20250514)** — IA del chat `/ask`
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
Stack: Next.js + TypeScript + Supabase + Clerk + Claude API
Tarea de hoy: [describe la tarea]
Sigue las convenciones de /docs/CONVENTIONS.md
```

---

## Estado actual del proyecto

> ⚠️ Actualizar esta sección al final de cada día de desarrollo

| Día | Estado | Notas |
|---|---|---|
| Día 1 — Setup | ⬜ Pendiente | |
| Día 2 — Perfil y registro | ⬜ Pendiente | |
| Día 3 — Directorio | ⬜ Pendiente | |
| Día 4 — IA y Landing | ⬜ Pendiente | |
| Día 5 — Polish | ⬜ Pendiente | |
| Día 6 — Evento | ⬜ Pendiente | |

**Perfiles en beta:** 0 / 15 objetivo

**URL de producción:** https://dev-map-ecuador.vercel.app/
