'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  maxBadges?: number
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  maxBadges = 3,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  const remove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  const selectedOptions = options.filter((opt) => selected.includes(opt.value))
  const visibleBadges = selectedOptions.slice(0, maxBadges)
  const extraCount = selectedOptions.length - maxBadges

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger — idéntico al SelectTrigger de shadcn/base-ui */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex min-h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-white py-1.5 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          open && 'border-ring ring-3 ring-ring/50'
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {visibleBadges.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-0.5 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700"
                >
                  {opt.label}
                  <button
                    type="button"
                    onClick={(e) => remove(opt.value, e)}
                    className="text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {extraCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                  +{extraCount} más
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform pointer-events-none',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown — mismo shadow y border que el popup de shadcn Select */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-input bg-popover text-popover-foreground shadow-md">
          {/* Search — border-b plano, sin caja redondeada */}
          <div className="flex items-center gap-2 border-b border-input px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Opciones */}
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>
            ) : (
              filtered.map((opt) => {
                const isSelected = selected.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'text-indigo-700'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors',
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-input bg-background'
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="h-2.5 w-2.5"
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 5.5 L4.5 8 L8.5 2.5" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
