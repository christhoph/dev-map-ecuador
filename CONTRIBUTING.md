# Contribuir a DevMap Ecuador 🗺️

¡Gracias por tu interés en contribuir! DevMap Ecuador es un proyecto open source creado para el Build with AI Challenge de GDG Quito 2026. Cualquier contribución es bienvenida, desde reportar un bug hasta proponer nuevas features.

---

## 🐛 Reportar un issue

Si encontraste un bug o tienes una sugerencia:

1. Revisa que no exista un [issue similar](https://github.com/christhoph/dev-map-ecuador/issues) ya reportado
2. Abre un [nuevo issue](https://github.com/christhoph/dev-map-ecuador/issues/new) con:
   - Descripción clara del problema o sugerencia
   - Pasos para reproducirlo (si es un bug)
   - Captura de pantalla si aplica
   - Navegador y dispositivo donde ocurrió

---

## 🚀 Contribuir con código

### Prerrequisitos

- Node.js 18+
- Cuenta en Supabase, Clerk y Google AI Studio
- Leer [`docs/AI_CONTEXT.md`](./docs/AI_CONTEXT.md) — contiene toda la arquitectura del proyecto

### Setup local

```bash
git clone https://github.com/christhoph/dev-map-ecuador.git
cd dev-map-ecuador
npm install
cp .env.example .env.local
# Completar las variables en .env.local
npm run dev
```

### Flujo de contribución

```
1. Fork del repositorio
2. Crear una rama descriptiva:
   git checkout -b fix/nombre-del-bug
   git checkout -b feature/nombre-de-la-feature
3. Hacer los cambios siguiendo las convenciones del proyecto
4. Verificar que el build no tiene errores: npm run build
5. Abrir un Pull Request describiendo los cambios
```

### Convenciones de código

Antes de escribir código, leer [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md). Los puntos más importantes:

- Usar `@/` para todos los imports internos
- Rutas en inglés (`/register`, no `/registro`)
- Componentes en PascalCase, hooks con prefijo `use`
- `import { toast } from 'sonner'` — nunca el toast de shadcn
- Sin `any` en TypeScript

### Ramas

| Rama | Uso |
|---|---|
| `main` | Producción — deploy automático en Vercel |
| `feature/*` | Nuevas funcionalidades |
| `fix/*` | Corrección de bugs |

---

## 💡 Ideas para contribuir

- Importación de perfil desde GitHub API
- Perfil con sección de experiencia laboral
- Sistema de endorsements entre devs
- Filtro por años de experiencia
- Modo oscuro
- Internacionalización (inglés)
- Tests unitarios y de integración
- Mejoras de accesibilidad (a11y)

---

## 📋 Documentación del proyecto

| Archivo | Descripción |
|---|---|
| [`docs/AI_CONTEXT.md`](./docs/AI_CONTEXT.md) | Punto de entrada para entender el proyecto |
| [`docs/PRD.md`](./docs/PRD.md) | Qué es el producto y por qué |
| [`docs/STACK.md`](./docs/STACK.md) | Decisiones técnicas |
| [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) | Esquema de base de datos |
| [`docs/PAGES.md`](./docs/PAGES.md) | Definición de cada página |
| [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md) | Convenciones de código |

---

## 🤝 Código de conducta

Este proyecto sigue un ambiente de respeto y colaboración. Cualquier contribución debe ser constructiva y orientada a mejorar el ecosistema tech ecuatoriano.

---

Desarrollado por [Cristopher Solis](https://www.christhoph.dev/) con la ayuda de Claude AI y Claude Code de Anthropic.
