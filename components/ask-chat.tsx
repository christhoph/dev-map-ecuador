'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { SendHorizontal, Bot, User, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant'

interface Message {
  id: string
  role: Role
  content: string
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
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Burbuja */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted text-foreground'
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

    // Placeholder para la respuesta del asistente
    const assistantId = crypto.randomUUID()

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      })

      if (!res.ok || !res.body) {
        throw new Error(`Error ${res.status}`)
      }

      setIsLoading(false)
      setIsStreaming(true)

      // Agregar mensaje vacío del asistente que iremos llenando
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      }
    } catch {
      setIsLoading(false)
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content:
            'Lo siento, ocurrió un error al procesar tu pregunta. Por favor intenta de nuevo.',
        },
      ])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }

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
                  className="rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex-1 rounded-full border bg-muted/50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background disabled:cursor-not-allowed disabled:opacity-50"
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
