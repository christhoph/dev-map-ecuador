'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserButton } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProfileLink } from '@/hooks/use-profile-link'

const NAV_LINKS = [
  { href: '/devs', label: 'Directorio' },
  { href: '/ask', label: 'Pregunta a la IA' },
]

export function Nav() {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profileUrl } = useProfileLink()

  const closeMenu = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="shrink-0 text-sm font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            DevMap Ecuador
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                pathname === href
                  ? 'text-indigo-600 font-medium'
                  : 'text-slate-600 hover:text-indigo-600 transition-colors'
              )}
            >
              {label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-2">
            {isSignedIn ? (
              <>
                <Link
                  href={profileUrl}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Mi perfil
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                  Iniciar sesión
                </Link>
                <Link href="/sign-up" className={cn(buttonVariants({ size: 'sm' }))}>
                  Únete
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile: auth avatar + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          {isSignedIn && <UserButton />}
          <button
            type="button"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t bg-background px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t pt-3">
              {isSignedIn ? (
                <Link
                  href={profileUrl}
                  onClick={closeMenu}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'justify-start')}
                >
                  Mi perfil
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={closeMenu}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-center')}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={closeMenu}
                    className={cn(buttonVariants({ size: 'sm' }), 'w-full text-center')}
                  >
                    Únete
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
