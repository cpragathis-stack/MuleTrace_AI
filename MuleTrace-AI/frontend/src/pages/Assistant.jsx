import { useEffect, useRef, useState } from 'react'
import { Bot, Loader2, Send, Trash2 } from 'lucide-react'
import ChatMessage from '../components/assistant/ChatMessage'
import EvidenceReferences from '../components/assistant/EvidenceReferences'
import SuggestedPrompts from '../components/assistant/SuggestedPrompts'
import ErrorState from '../components/common/ErrorState'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useMutation from '../hooks/useMutation'
import { assistantService } from '../services'
import {
  mergeEvidenceReferences,
  normalizeAssistantReply,
} from '../utils/assistant'

const SUGGESTED_PROMPTS = [
  'Summarise the evidence gathered so far in this investigation.',
  'Explain the transaction pattern behind the highest-risk alert.',
  'Identify linked accounts that warrant further review.',
  'Draft an investigator note summarising the open questions.',
]

function createMessageId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function ThinkingBubble() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
        <Bot size={16} aria-hidden="true" />
      </div>
      <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-md border border-stroke/80 bg-panel-raised/80 px-4 py-3 text-sm text-muted">
        <Loader2
          size={15}
          className="animate-spin text-brand"
          aria-hidden="true"
        />
        Assistant is analysing the investigation…
      </div>
    </div>
  )
}

export default function Assistant() {
  useDocumentTitle('AI Assistant')

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState(null)
  const [references, setReferences] = useState([])
  const [localError, setLocalError] = useState(null)
  const [lastPrompt, setLastPrompt] = useState('')

  const inputRef = useRef(null)
  const endRef = useRef(null)
  const sendingRef = useRef(false)

  const chatMutation = useMutation(assistantService.chat)
  const isSending = chatMutation.loading
  const error = localError ?? chatMutation.error ?? null
  const canSend = input.trim().length > 0 && !isSending

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isSending, error])

  const requestAssistant = async (message, { appendUser = true } = {}) => {
    const content = message.trim()

    if (!content || sendingRef.current) return

    sendingRef.current = true

    if (appendUser) {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'user',
          content,
        },
      ])
      setInput('')
    }

    setLocalError(null)
    setLastPrompt(content)

    try {
      const payload = { message: content }

      if (conversationId) {
        payload.conversation_id = conversationId
      }

      const response = await chatMutation.execute(payload)

      if (!response) return

      const reply = normalizeAssistantReply(response)

      if (!reply.content) {
        setLocalError(
          'The assistant returned an empty response. Try sending the request again.',
        )
        return
      }

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'assistant',
          content: reply.content,
        },
      ])

      if (reply.conversationId) {
        setConversationId(reply.conversationId)
      }

      setReferences((current) =>
        mergeEvidenceReferences(current, reply.references),
      )
    } finally {
      sendingRef.current = false
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    requestAssistant(input)
  }

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      requestAssistant(input)
    }
  }

  const handleSuggestion = (prompt) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const handleClear = () => {
    setMessages([])
    setInput('')
    setConversationId(null)
    setReferences([])
    setLocalError(null)
    setLastPrompt('')
    chatMutation.reset()
    inputRef.current?.focus()
  }

  const clearDisabled =
    isSending ||
    (messages.length === 0 && references.length === 0 && !error)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI assistance"
        title="AI assistant"
        description="Interrogate investigation evidence, explain risk signals and draft investigative notes with the MuleTrace assistant."
        actions={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={clearDisabled}
          >
            <Trash2 size={15} aria-hidden="true" />
            Clear conversation
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <SectionCard
          title="Investigation assistant"
          description="Ask questions grounded in evidence returned by the MuleTrace API."
          padded={false}
          bodyClassName="flex h-[640px] max-h-[calc(100vh-12rem)] min-h-[380px] flex-col"
          actions={
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stroke bg-canvas/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              <span className="size-1.5 rounded-full bg-brand" />
              {conversationId ? 'Session active' : 'New session'}
            </span>
          }
        >
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex size-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                  <Bot size={22} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-base font-semibold text-slate-100">
                  No conversation yet
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-6 text-muted">
                  Start with an investigation question or choose a prompt below.
                  The conversation remains empty until the assistant returns a
                  response.
                </p>
                <div className="mt-6 w-full max-w-xl">
                  <SuggestedPrompts
                    prompts={SUGGESTED_PROMPTS}
                    onSelect={handleSuggestion}
                    disabled={isSending}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isSending && <ThinkingBubble />}
                <div ref={endRef} />
              </div>
            )}
          </div>

          <div className="border-t border-stroke/70 p-4">
            {error && (
              <ErrorState
                title="Assistant request failed"
                message={error}
                onRetry={
                  lastPrompt
                    ? () =>
                        requestAssistant(lastPrompt, { appendUser: false })
                    : undefined
                }
                retryLabel="Retry request"
                className="mb-3 p-4"
              />
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="assistant-message" className="sr-only">
                Message the assistant
              </label>
              <div className="relative">
                <textarea
                  id="assistant-message"
                  ref={inputRef}
                  rows={2}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  className="field min-h-20 resize-none pr-14"
                  placeholder="Ask about evidence, accounts, transactions or investigation next steps…"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className="btn btn-primary absolute bottom-2.5 right-2.5 size-9 rounded-lg p-0"
                  aria-label="Send message"
                  disabled={!canSend}
                >
                  {isSending ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Send size={16} aria-hidden="true" />
                  )}
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>Shift + Enter for a new line</span>
                <span>Responses are generated by the MuleTrace API</span>
              </div>
            </form>
          </div>
        </SectionCard>

        <EvidenceReferences references={references} />
      </div>
    </div>
  )
}
