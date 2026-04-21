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
