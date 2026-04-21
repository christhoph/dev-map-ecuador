import type { Availability } from '@/types'

export const CITIES_ECUADOR = [
  'Quito',
  'Guayaquil',
  'Cuenca',
  'Ambato',
  'Loja',
  'Manta',
  'Portoviejo',
  'Machala',
  'Esmeraldas',
  'Riobamba',
  'Ibarra',
  'Santo Domingo',
  'Otra',
] as const

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  empleado: 'Empleado',
  freelance: 'Freelance',
  buscando_empleo: 'Buscando empleo',
  abierto_oportunidades: 'Abierto a oportunidades',
}

export const AVAILABILITY_COLORS: Record<Availability, string> = {
  empleado: 'bg-gray-100 text-gray-700',
  freelance: 'bg-blue-100 text-blue-700',
  buscando_empleo: 'bg-green-100 text-green-700',
  abierto_oportunidades: 'bg-yellow-100 text-yellow-700',
}

export const MAX_PROJECTS = 3
export const MAX_BIO_CHARS = 300
export const MAX_PROJECT_DESC_CHARS = 200
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 30
