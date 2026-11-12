export function normalizeAssistantReply(payload) {
  if (typeof payload === 'string') {
    return {
      content: payload.trim(),
      references: [],
      conversationId: null,
    }
  }

  const message = payload?.message
  const content =
    (typeof message === 'string' ? message : message?.content) ??
    payload?.response ??
    payload?.answer ??
    payload?.content ??
    payload?.reply?.content

  const references =
    payload?.references ??
    payload?.evidence ??
    payload?.citations ??
    (message && typeof message === 'object' ? message.references : null) ??
    []

  const conversationId =
    payload?.conversation_id ??
    payload?.conversationId ??
    payload?.thread_id ??
    (message && typeof message === 'object'
      ? message.conversation_id
      : null) ??
    null

  return {
    content: typeof content === 'string' ? content.trim() : '',
    references: Array.isArray(references) ? references : [],
    conversationId: conversationId ? String(conversationId) : null,
  }
}

function referenceKey(reference) {
  if (typeof reference === 'string') return reference

  const identifier =
    reference?.evidence_id ?? reference?.id ?? reference?.reference_id

  if (identifier) return String(identifier)

  return (
    [reference?.title ?? reference?.name, reference?.source]
      .filter(Boolean)
      .join(':') || JSON.stringify(reference)
  )
}

export function mergeEvidenceReferences(current, incoming) {
  if (!incoming.length) return current

  const keys = new Set(current.map(referenceKey))
  const next = [...current]

  incoming.forEach((reference) => {
    const key = referenceKey(reference)
    if (!keys.has(key)) {
      keys.add(key)
      next.push(reference)
    }
  })

  return next
}
