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

// Versión reducida de DevProfile usada en el directorio (/devs)
// No incluye email, projects ni is_public — solo lo que DevCard necesita
export interface DevCardProfile {
  id: string
  username: string
  full_name: string
  avatar_url?: string
  city: string
  years_experience?: number
  availability: Availability
  technologies: Technology[]
  created_at: string
}

export interface EcosystemStats {
  total_devs: number
  total_cities: number
  top_technologies: { name: string; total: number }[]
  availability_breakdown: { availability: Availability; total: number }[]
}
