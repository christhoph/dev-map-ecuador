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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dev-map-ecuador.vercel.app'

const OG_DESCRIPTION =
  'Encuentra desarrolladores ecuatorianos, explora sus stacks y conecta con el ecosistema. Potenciado con IA.'

export const metadata: Metadata = {
  title: {
    default: 'DevMap Ecuador — El directorio del talento tech ecuatoriano',
    template: '%s — DevMap Ecuador',
  },
  description: OG_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'DevMap Ecuador',
    description: OG_DESCRIPTION,
    url: APP_URL,
    siteName: 'DevMap Ecuador',
    locale: 'es_EC',
    type: 'website',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'DevMap Ecuador' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevMap Ecuador',
    description: OG_DESCRIPTION,
    images: ['/og'],
  },
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
