# PAGES — DevMap Ecuador

Cada página describe su objetivo, datos que necesita, componentes principales y comportamiento esperado.

---

## `/` — Landing Page

**Objetivo:** Primera impresión. Explicar qué es DevMap Ecuador, mostrar que hay actividad real y llevar al usuario a registrarse o explorar el directorio.

**Tipo de render:** Server Component (SSR) — datos frescos en cada visita

**Secciones:**

1. **Hero**
   - Título: "El directorio del talento tech ecuatoriano"
   - Subtítulo breve explicando qué es
   - Dos CTAs: "Crear mi perfil" → `/registro` y "Explorar devs" → `/devs`

2. **Ecosystem Stats** (datos reales de Supabase)
   - Total de devs registrados
   - Total de ciudades representadas
   - Top 3 tecnologías más usadas
   - % de devs disponibles (buscando empleo + abiertos a oportunidades)

3. **Últimos perfiles** (grid de 6 dev cards recientes)

4. **Ask AI preview**
   - Sección que muestra el `/ask` como feature destacado
   - Ejemplos de preguntas: "¿Cuántos devs React hay en Quito?" / "¿Qué stack dominan los devs de Guayaquil?"
   - CTA: "Pregúntale a la IA" → `/ask`

5. **CTA final**
   - "¿Eres dev ecuatoriano? Súmate al mapa"
   - Botón → `/registro`

---

## `/devs` — Directorio

**Objetivo:** Explorar todos los perfiles públicos con filtros.

**Tipo de render:** Client Component con datos iniciales desde servidor (SSR + client filtering)

**Filtros disponibles:**
- Ciudad (select con ciudades de Ecuador)
- Tecnología (multi-select del catálogo)
- Disponibilidad (checkbox: Buscando empleo, Abierto a oportunidades, Freelance)

**Comportamiento:**
- Carga inicial muestra todos los perfiles públicos ordenados por fecha de creación (más recientes primero)
- Los filtros actualizan la lista en el cliente sin recargar página
- Si no hay resultados con los filtros aplicados: mensaje "No encontramos devs con esos criterios. ¡Sé el primero en registrarte con este stack!"
- Cada resultado es un `DevCard` clickeable que lleva a `/devs/[username]`

**DevCard muestra:**
- Avatar (o iniciales si no tiene foto)
- Nombre completo y username
- Ciudad y años de experiencia
- Disponibilidad (badge con color: verde = buscando, gris = empleado, azul = freelance)
- Primeras 4-5 tecnologías del stack (badges)

---

## `/devs/[username]` — Perfil Público

**Objetivo:** Página pública del dev. URL compartible.

**Tipo de render:** SSR con `generateMetadata` para SEO y Open Graph

**Comportamiento:**
- Si el username no existe: 404
- Si `is_public = false`: mensaje "Este perfil no está disponible"

**Secciones:**

1. **Header del perfil**
   - Avatar grande, nombre, username, ciudad
   - Badge de disponibilidad
   - Links: GitHub, LinkedIn, Portfolio (solo los que tenga)
   - Años de experiencia

2. **Bio**
   - Texto libre del dev

3. **Stack tecnológico**
   - Badges agrupados por categoría (Frontend, Backend, Mobile, etc.)

4. **Proyectos destacados**
   - Cards con nombre, descripción y link (máx 3)

5. **Acción (solo visible para el dueño del perfil)**
   - Botón "Editar perfil" visible solo si el usuario autenticado es el dueño

---

## `/registro` — Formulario de Perfil

**Objetivo:** Crear o editar el perfil del dev autenticado.

**Tipo de render:** Client Component con protección de ruta (Clerk middleware)

**Acceso:** Solo usuarios autenticados. Si no está logueado, redirige a `/sign-in`

**Comportamiento:**
- Si el usuario ya tiene perfil: carga los datos existentes para edición
- Si es primera vez: formulario vacío con username sugerido del email

**Campos del formulario:**

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Username | Text | Sí | Validar único, solo letras/números/guiones, min 3 chars |
| Nombre completo | Text | Sí | |
| Ciudad | Select | Sí | Lista de ciudades ecuatorianas principales |
| Bio | Textarea | No | Max 300 caracteres con contador |
| Años de experiencia | Number | No | Min 0, max 40 |
| Disponibilidad | Select | Sí | Las 4 opciones definidas en el modelo |
| Stack tecnológico | Multi-select | Sí | Del catálogo de `technologies`, mín 1 |
| GitHub URL | Text | No | Validar formato URL |
| LinkedIn URL | Text | No | Validar formato URL |
| Portfolio URL | Text | No | Validar formato URL |
| Avatar | URL de imagen | No | En MVP: URL externa. Nice to have: upload |

**Proyectos (sección separada dentro del mismo formulario):**
- Hasta 3 proyectos
- Cada uno: nombre, descripción (max 200 chars), URL
- Botón para agregar/eliminar proyectos dinámicamente

**Validación:**
- Formulario con react-hook-form + zod para validación del lado cliente
- Username único verificado contra Supabase antes de guardar

**Al guardar:**
- Upsert en tabla `profiles`
- Eliminar y reinsertar en `profile_technologies`
- Upsert en `projects`
- Redirigir a `/devs/[username]` con toast de éxito

---

## `/ask` — Chat con IA ⭐

**Objetivo:** El wow factor. Un chat donde la IA responde preguntas sobre el ecosistema tech ecuatoriano usando los perfiles reales registrados.

**Tipo de render:** Client Component con llamada al API Route `/api/ask`

**UI:**
- Interfaz de chat simple: historial de mensajes arriba, input abajo
- Mensajes del usuario a la derecha (bubble azul), respuestas de la IA a la izquierda (bubble gris)
- Indicador de "escribiendo..." mientras espera respuesta
- Preguntas sugeridas al iniciar (chips clickeables):
  - "¿Cuántos devs hay registrados?"
  - "¿Cuáles son las tecnologías más usadas?"
  - "¿Cuántos devs están buscando empleo en Quito?"
  - "¿Qué devs tienen experiencia en React Native?"

**Flujo del API Route `/api/ask`:**

```
1. Recibe la pregunta del usuario
2. Consulta Supabase para obtener contexto:
   - Total de perfiles
   - Lista de devs con nombre, ciudad, stack, disponibilidad
   - Stats del ecosistema (top tecnologías, ciudades, disponibilidad)
3. Construye system prompt con ese contexto
4. Llama a Claude API con la pregunta + contexto
5. Retorna la respuesta en streaming
```

**System prompt base para Claude:**
```
Eres el asistente de DevMap Ecuador, un directorio del talento tech ecuatoriano.
Tienes acceso a los datos reales de los desarrolladores registrados en la plataforma.
Responde preguntas sobre el ecosistema tech de Ecuador de forma clara, amigable y en español.
Si te preguntan algo que no está en los datos, dilo honestamente.
No inventes información.

DATOS ACTUALES DEL ECOSISTEMA:
[contexto dinámico de Supabase aquí]
```

---

## `/sign-in` y `/sign-up` — Autenticación

Manejadas completamente por Clerk. Páginas mínimas que renderizan los componentes de Clerk (`<SignIn />` y `<SignUp />`).

Después del login exitoso → redirige a `/registro` para completar perfil.

---

## Rutas protegidas (middleware.ts)

```typescript
// Solo /registro requiere autenticación
// Todo lo demás es público
export const config = {
  matcher: ['/registro', '/api/ask']
}
```
