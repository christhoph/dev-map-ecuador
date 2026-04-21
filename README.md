# DevMap Ecuador 🗺️

> El directorio vivo del talento tech ecuatoriano

DevMap Ecuador es una plataforma donde los desarrolladores del país crean su perfil público con su stack, ciudad, experiencia y disponibilidad. Cualquier persona puede explorar el ecosistema, filtrar perfiles y consultar a una IA que responde preguntas sobre el talento tech de Ecuador usando datos reales.

---

## ✨ Features

- **Directorio de devs** — Explora perfiles con filtros por ciudad, stack y disponibilidad
- **Perfiles públicos** — URL compartible por dev con su stack, proyectos y links
- **Ask AI** — Chat con IA (Gemini 2.5 Flash) que responde preguntas sobre el ecosistema usando datos reales
- **Ecosystem Stats** — Dashboard con estadísticas en tiempo real del talento tech del país
- **Registro en minutos** — Formulario con importación opcional desde GitHub

---

## 🛠️ Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Auth | Clerk |
| Base de datos | Supabase (PostgreSQL) |
| IA | Google Gemini 2.5 Flash |
| Deploy | Vercel |

---

## 🚀 Primeros pasos

### Prerrequisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Clerk](https://clerk.com)
- API Key de [Google AI Studio](https://aistudio.google.com) (gratuita)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/devmap-ecuador.git
cd devmap-ecuador

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Completar las variables en .env.local

# Correr en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### Variables de entorno

```bash
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

### Base de datos

Ejecutar el SQL de [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) en tu proyecto de Supabase para crear las tablas, políticas RLS y datos iniciales de tecnologías.

---

## 📁 Estructura del proyecto

```
devmap-ecuador/
├── app/
│   ├── (auth)/sign-in y sign-up   ← Autenticación con Clerk
│   ├── devs/                       ← Directorio y perfiles públicos
│   ├── ask/                        ← Chat con IA
│   ├── registro/                   ← Formulario de perfil
│   ├── api/ask/                    ← API Route del chat IA
│   └── page.tsx                    ← Landing
├── components/                     ← Componentes reutilizables
├── lib/                            ← Supabase, Gemini, utils
├── types/                          ← Tipos globales TypeScript
├── hooks/                          ← Custom hooks
└── docs/                           ← Documentación del proyecto
    ├── AI_CONTEXT.md               ← Contexto para agentes de IA
    ├── PRD.md                      ← Product Requirements
    ├── STACK.md                    ← Decisiones técnicas
    ├── DATA_MODEL.md               ← Esquema de base de datos
    ├── PAGES.md                    ← Definición de páginas
    ├── CONVENTIONS.md              ← Convenciones de código
    └── PLAN.md                     ← Plan de desarrollo por pasos
```

---

## 📖 Documentación

Este proyecto usa **Spec-Driven Development (SDD)** — toda la arquitectura, decisiones técnicas y convenciones están documentadas en `/docs` antes de escribir código. Esto permite trabajar en equipo con agentes de IA de forma coherente y sin ambigüedad.

Para contribuir o trabajar con un agente de IA, comenzar siempre por [`docs/AI_CONTEXT.md`](./docs/AI_CONTEXT.md).

---

## 🌎 Contexto

Proyecto creado como participación en el **Build with AI Challenge de GDG Quito**, evento realizado el 25 de abril de 2026 en la Universidad San Francisco de Quito, Cumbayá.

**Objetivo del challenge:** Crear una herramienta con IA que ayude al ecosistema Tech de Ecuador.

---

## 👤 Autor

**Cristopher Solis** — Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-cristophersolis-181717?logo=github)](https://github.com/christhoph)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-cristophersolis-0A66C2?logo=linkedin)](https://www.linkedin.com/in/cristophersolis/)

---

## 📄 Licencia

MIT
