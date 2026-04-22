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
  empleado: 'bg-slate-100 text-slate-600 border border-slate-200',
  freelance: 'bg-blue-100 text-blue-700 border border-blue-200',
  buscando_empleo: 'bg-green-100 text-green-700 border border-green-200',
  abierto_oportunidades: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
}

export const AVAILABILITY_BORDER_COLORS: Record<Availability, string> = {
  empleado: 'border-t-slate-300',
  freelance: 'border-t-blue-500',
  buscando_empleo: 'border-t-green-500',
  abierto_oportunidades: 'border-t-yellow-400',
}

export const MAX_PROJECTS = 3
export const MAX_BIO_CHARS = 300
export const MAX_PROJECT_DESC_CHARS = 200
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 30
