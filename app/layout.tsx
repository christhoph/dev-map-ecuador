import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { esMX } from '@clerk/localizations'
import { Toaster } from '@/components/ui/sonner'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DevMap Ecuador — Directorio del talento tech ecuatoriano',
  description:
    'Descubre desarrolladores ecuatorianos, explora su stack tecnológico y conecta con el ecosistema tech del Ecuador.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider localization={esMX}>
      <html
        lang="es"
        className={`${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          <Nav />
          {children}
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
