import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AVAILABILITY_LABELS } from '@/lib/constants'
import type { Availability } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAvailability(availability: Availability): string {
  return AVAILABILITY_LABELS[availability] ?? availability
}

export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export function formatDateRange(start: string, end?: string, isCurrent?: boolean): string {
  const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  const format = (dateStr: string) => {
    const parts = dateStr.split('-')
    return `${MONTHS_ES[parseInt(parts[1], 10) - 1]} ${parts[0]}`
  }

  if (isCurrent || !end) {
    return `${format(start)} — presente`
  }

  const startParts = start.split('-')
  const endParts = end.split('-')
  const totalMonths =
    (parseInt(endParts[0], 10) - parseInt(startParts[0], 10)) * 12 +
    (parseInt(endParts[1], 10) - parseInt(startParts[1], 10))
  const years = Math.floor(totalMonths / 12)

  const durationStr = years >= 1 ? ` · ${years} ${years === 1 ? 'año' : 'años'}` : ''
  return `${format(start)} — ${format(end)}${durationStr}`
}
