import type { Metadata } from 'next'
import Link from 'next/link'
import { Bug, Link2 } from 'lucide-react'

import { FeedbackForm } from '@/components/feedback-form'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Reporta un issue o sugiere mejoras para DevMap Ecuador.',
}

export default function FeedbackPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      {/* Encabezado */}
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground">
          Tu opinión ayuda a mejorar DevMap Ecuador.
        </p>
      </div>

      {/* Sección GitHub */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold">¿Encontraste algo o tienes una idea?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          DevMap Ecuador es open source. Puedes contribuir directamente en GitHub,
          reportar un issue o explorar el código fuente.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="https://github.com/christhoph/dev-map-ecuador/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'gap-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50'
            )}
          >
            <Bug className="h-4 w-4" />
            Reportar issue
          </Link>
          <Link
            href="https://github.com/christhoph/dev-map-ecuador"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'gap-2 border-slate-300 text-slate-600 hover:bg-slate-50'
            )}
          >
            <Link2 className="h-4 w-4" />
            Ver repositorio
          </Link>
        </div>
      </div>

      {/* Separador */}
      <div className="relative my-8 flex items-center">
        <div className="flex-1 border-t border-slate-200" />
        <span className="mx-4 text-xs text-muted-foreground">o si prefieres</span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      {/* Formulario */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Déjanos tu feedback</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lo revisaré personalmente. Tu opinión ayuda a mejorar DevMap Ecuador.
          </p>
        </div>
        <FeedbackForm />
      </div>
    </main>
  )
}
