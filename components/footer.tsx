'use client'

import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname === '/ask') return null

  return (
    <footer className="border-t bg-neutral-50 py-4 text-center text-xs text-neutral-500">
      <p>
        Desarrollado por{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.christhoph.dev/"
          className="underline underline-offset-2 hover:text-neutral-700"
        >
          christhoph.dev
        </a>{' '}
        <span>© {new Date().getFullYear()}</span>
      </p>
    </footer>
  )
}
