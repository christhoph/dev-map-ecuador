import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AskChat } from '@/components/ask-chat'

export const metadata: Metadata = {
  title: 'Pregunta a la IA',
  description:
    'Pregúntale a nuestra IA sobre el ecosistema tech ecuatoriano. Datos reales del directorio de devs.',
}

export default function AskPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Pregúntale a la IA
          </h1>
          <p className="text-sm text-slate-500">
            Accede a datos reales del ecosistema tech ecuatoriano
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="flex-1" />}>
        <AskChat />
      </Suspense>
    </div>
  )
}
