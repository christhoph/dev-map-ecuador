import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ShareButton } from '@/components/share-button'

interface CTASectionProps {
  profile: { username: string } | null
  isAuthenticated: boolean
}

export function CTASection({ profile, isAuthenticated }: CTASectionProps) {
  if (profile) {
    return (
      <section className="bg-indigo-600 py-20">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            ¡Gracias por ser parte del mapa!
          </h2>
          <p className="mx-auto mt-3 max-w-md text-indigo-200">
            Comparte tu perfil con tu red y ayuda a crecer el ecosistema tech
            ecuatoriano.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/devs/${profile.username}`}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Ver mi perfil
            </Link>
            <ShareButton username={profile.username} />
          </div>
        </div>
      </section>
    )
  }

  if (isAuthenticated) {
    return (
      <section className="bg-indigo-600 py-20">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ya casi estás en el mapa
          </h2>
          <p className="mx-auto mt-3 max-w-md text-indigo-200">
            Completa tu perfil para aparecer en el directorio y ser visible en
            el ecosistema tech ecuatoriano.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Completar mi perfil
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-indigo-600 py-20">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          ¿Eres dev ecuatoriano?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-indigo-200">
          Súmate al mapa. Crea tu perfil gratuito y forma parte del directorio
          del talento tech ecuatoriano.
        </p>
        <div className="mt-8">
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            Crear mi perfil gratis
          </Link>
        </div>
      </div>
    </section>
  )
}
