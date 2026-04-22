# DATA_MODEL — DevMap Ecuador

## Base de datos: Supabase (PostgreSQL)

---

## Tablas

### `profiles`
Perfil público de cada desarrollador. Un usuario registrado tiene exactamente un perfil.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,       -- ID del usuario en Clerk
  username TEXT UNIQUE NOT NULL,            -- URL pública: /devs/username
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  city TEXT NOT NULL,                       -- Ciudad en Ecuador (ej: 'Quito', 'Guayaquil')
  bio TEXT,                                 -- Descripción corta, max 300 chars
  years_experience INT,                     -- Años de experiencia aproximados
  availability TEXT NOT NULL DEFAULT 'empleado',
    -- Valores: 'empleado' | 'freelance' | 'buscando_empleo' | 'abierto_oportunidades'
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  is_public BOOLEAN DEFAULT true,           -- Si el perfil es visible en el directorio
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

### `technologies`
Catálogo de tecnologías disponibles. Precargado con las más comunes.

```sql
CREATE TABLE technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,    -- Ej: 'React', 'Python', 'PostgreSQL'
  category TEXT NOT NULL,       -- 'Frontend' | 'Backend' | 'Mobile' | 'DevOps' | 'Data' | 'Gaming' | 'Other'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Datos iniciales a insertar:**
```sql
-- Frontend
INSERT INTO technologies (name, category) VALUES
('React', 'Frontend'), ('Next.js', 'Frontend'), ('Vue.js', 'Frontend'),
('Angular', 'Frontend'), ('TypeScript', 'Frontend'), ('JavaScript', 'Frontend'),
('Tailwind CSS', 'Frontend'), ('HTML/CSS', 'Frontend'), ('Svelte', 'Frontend');

-- Backend
INSERT INTO technologies (name, category) VALUES
('Node.js', 'Backend'), ('Python', 'Backend'), ('Django', 'Backend'),
('FastAPI', 'Backend'), ('NestJS', 'Backend'), ('Express', 'Backend'),
('PHP', 'Backend'), ('Laravel', 'Backend'), ('Java', 'Backend'),
('Spring Boot', 'Backend'), ('Go', 'Backend'), ('Ruby on Rails', 'Backend'),
('.NET', 'Backend'), ('C#', 'Backend');

-- Mobile
INSERT INTO technologies (name, category) VALUES
('React Native', 'Mobile'), ('Flutter', 'Mobile'),
('Swift', 'Mobile'), ('Kotlin', 'Mobile'), ('Expo', 'Mobile');

-- DevOps / Infra
INSERT INTO technologies (name, category) VALUES
('Docker', 'DevOps'), ('AWS', 'DevOps'), ('GCP', 'DevOps'),
('Azure', 'DevOps'), ('GitHub Actions', 'DevOps'), ('Linux', 'DevOps'),
('Kubernetes', 'DevOps'), ('Terraform', 'DevOps');

-- Bases de datos
INSERT INTO technologies (name, category) VALUES
('PostgreSQL', 'Data'), ('MongoDB', 'Data'), ('MySQL', 'Data'),
('Firebase', 'Data'), ('Redis', 'Data'), ('Supabase', 'Data');

-- Gaming
INSERT INTO technologies (name, category) VALUES
('Unity', 'Gaming'), ('Unreal Engine', 'Gaming'),
('Godot', 'Gaming'), ('SDL2', 'Gaming'),
('WebGL', 'Gaming'), ('Three.js', 'Gaming'),
('Phaser', 'Gaming'), ('Blender', 'Gaming'),
('C++', 'Gaming'), ('Lua', 'Gaming');
```

---

### `profile_technologies`
Relación muchos a muchos entre perfiles y tecnologías.

```sql
CREATE TABLE profile_technologies (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, technology_id)
);
```

---

### `projects`
Proyectos destacados del dev (máximo 3 en MVP).

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,           -- Max 200 chars
  url TEXT,                   -- Link al proyecto o repositorio
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Row Level Security (RLS)

Habilitar RLS en todas las tablas para que los usuarios solo puedan editar su propio perfil.

```sql
-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Lectura pública de perfiles públicos
CREATE POLICY "Perfiles públicos visibles para todos"
  ON profiles FOR SELECT
  USING (is_public = true);

-- El usuario solo puede editar su propio perfil
CREATE POLICY "Usuario edita su propio perfil"
  ON profiles FOR ALL
  USING (clerk_user_id = current_setting('app.clerk_user_id', true));

-- Lectura pública de tecnologías
CREATE POLICY "Tecnologías visibles para todos"
  ON technologies FOR SELECT
  TO public USING (true);

-- Lectura pública de profile_technologies
CREATE POLICY "Stack de devs visible para todos"
  ON profile_technologies FOR SELECT
  USING (true);

-- Usuario gestiona su propio stack
CREATE POLICY "Usuario gestiona su stack"
  ON profile_technologies FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM profiles
      WHERE clerk_user_id = current_setting('app.clerk_user_id', true)
    )
  );

-- Lectura pública de proyectos
CREATE POLICY "Proyectos visibles para todos"
  ON projects FOR SELECT
  USING (true);

-- Usuario gestiona sus propios proyectos
CREATE POLICY "Usuario gestiona sus proyectos"
  ON projects FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM profiles
      WHERE clerk_user_id = current_setting('app.clerk_user_id', true)
    )
  );
```

---

## Queries más usadas

### Obtener todos los perfiles para el directorio
```sql
SELECT
  p.id, p.username, p.full_name, p.avatar_url,
  p.city, p.bio, p.years_experience, p.availability,
  p.github_url, p.linkedin_url, p.portfolio_url,
  ARRAY_AGG(t.name ORDER BY t.name) AS technologies
FROM profiles p
LEFT JOIN profile_technologies pt ON p.id = pt.profile_id
LEFT JOIN technologies t ON pt.technology_id = t.id
WHERE p.is_public = true
GROUP BY p.id
ORDER BY p.created_at DESC;
```

### Stats para el landing y para la IA
```sql
-- Total devs
SELECT COUNT(*) FROM profiles WHERE is_public = true;

-- Top ciudades
SELECT city, COUNT(*) as total
FROM profiles WHERE is_public = true
GROUP BY city ORDER BY total DESC LIMIT 5;

-- Top tecnologías
SELECT t.name, COUNT(*) as total
FROM profile_technologies pt
JOIN technologies t ON pt.technology_id = t.id
JOIN profiles p ON pt.profile_id = p.id
WHERE p.is_public = true
GROUP BY t.name ORDER BY total DESC LIMIT 10;

-- Distribución de disponibilidad
SELECT availability, COUNT(*) as total
FROM profiles WHERE is_public = true
GROUP BY availability;
```
