import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-8xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Página no encontrada
      </h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        El perfil o la página que buscas no existe o fue eliminado.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/devs" className={cn(buttonVariants())}>
          Ver directorio
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}
