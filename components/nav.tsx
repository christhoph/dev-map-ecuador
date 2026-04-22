'use client'

import Link from 'next/link'
import { useAuth, UserButton, SignInButton } from '@clerk/nextjs'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Nav() {
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          DevMap<span className="text-primary"> Ecuador</span>
        </Link>

        {/* Navegación */}
        <nav className="flex items-center gap-1">
          <Link
            href="/devs"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'text-muted-foreground hover:text-foreground'
            )}
          >
            Directorio
          </Link>
          <Link
            href="/ask"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'text-muted-foreground hover:text-foreground'
            )}
          >
            Pregunta a la IA
          </Link>

          <div className="ml-2 flex items-center gap-2">
            {isSignedIn ? (
              <>
                <Link
                  href="/register"
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
                <SignInButton mode="redirect">
                  <button
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                  >
                    Iniciar sesión
                  </button>
                </SignInButton>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: 'sm' }))}
                >
                  Únete
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
