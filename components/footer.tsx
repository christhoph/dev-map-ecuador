'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname === '/ask') return null

  return (
    <footer className="border-t bg-neutral-50 py-4 text-center text-xs text-neutral-500">
      {pathname !== '/feedback' && (
        <p className="mb-2">
          <Link
            href="/feedback"
            className="text-slate-400 transition-colors hover:text-indigo-500"
          >
            Feedback
          </Link>
        </p>
      )}
      <div className="mb-2 flex items-center justify-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#4285F4]" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-[#EA4335]" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-[#FBBC04]" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-[#34A853]" aria-hidden="true" />
      </div>
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
