'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ShareButtonProps {
  username: string
}

export function ShareButton({ username }: ShareButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/devs/${username}`
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    if (isMobile && navigator.share) {
      await navigator.share({
        title: 'Mi perfil en DevMap Ecuador',
        text: 'Soy parte del directorio del talento tech ecuatoriano',
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado al portapapeles')
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'lg' }),
        'cursor-pointer border-white bg-transparent text-white hover:bg-white/10 hover:text-white'
      )}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Compartir
    </button>
  )
}
