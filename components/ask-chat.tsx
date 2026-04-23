'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SendHorizontal, Bot, User, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant'

interface Message {
  id: string
  role: Role
  content: string
  error?: boolean
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  '¿Cuántos desarrolladores hay registrados y de qué ciudades son?',
  '¿Cuál es la tecnología más usada en el ecosistema tech ecuatoriano?',
  '¿Hay devs disponibles para freelance en Quito con experiencia en React?',
  '¿Qué ciudades tienen más talento tech en Ecuador?',
]

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const isError = message.error === true
  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Icono */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs',
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-500'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Burbuja */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'rounded-tr-sm bg-indigo-600 text-white'
            : isError
            ? 'rounded-tl-sm bg-red-50 text-red-700 border border-red-200'
            : 'rounded-tl-sm bg-slate-100 text-slate-800'
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
        </div>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function AskChat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading || isStreaming) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const assistantId = crypto.randomUUID()

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error || 'Error al conectar con la IA')
      }

      if (!res.body) {
        throw new Error('Error al conectar con la IA')
      }

      setIsLoading(false)
      setIsStreaming(true)

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let receivedContent = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          receivedContent += chunk
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          )
        }
      } catch {
        const errorSuffix = '\n\n⚠️ La respuesta se cortó inesperadamente. Intenta de nuevo.'
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: (receivedContent || '') + errorSuffix, error: true }
              : m
          )
        )
      }
    } catch (err) {
      setIsLoading(false)
      const message =
        err instanceof Error ? err.message : 'Error al conectar con la IA'
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: message, error: true },
      ])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && messages.length === 0) {
      setInput(q)
      const timer = setTimeout(() => {
        sendMessage(q)
        router.replace('/ask', { scroll: false })
      }, 500)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-[calc(100%-5.125rem)] flex-col">
      {/* ── Área de mensajes ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6">
        {isEmpty ? (
          /* Estado vacío — sugerencias */
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <div className="space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">
                Pregúntame sobre el ecosistema tech ecuatoriano
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Tengo acceso a los datos reales del directorio. Puedes preguntarme
                sobre devs, tecnologías, ciudades y disponibilidad.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  disabled={isLoading || isStreaming}
                  className="cursor-pointer rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm text-indigo-700 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Historial de mensajes */
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <div className="border-t bg-background px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading || isStreaming}
            className="flex-1 rounded-full border bg-muted/50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-background disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading || isStreaming}
            className="h-10 w-10 shrink-0 rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
