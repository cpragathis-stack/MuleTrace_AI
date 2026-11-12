import { Bot } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isAssistant ? 'justify-start' : 'flex-row-reverse',
      )}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg border',
          isAssistant
            ? 'border-brand/20 bg-brand/10 text-brand'
            : 'border-stroke bg-panel-raised text-slate-300',
        )}
        aria-hidden="true"
      >
        {isAssistant ? (
          <Bot size={16} />
        ) : (
          <span className="text-[9px] font-semibold tracking-wider">YOU</span>
        )}
      </div>

      <div
        className={cn(
          'max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-6',
          isAssistant
            ? 'rounded-tl-md border-stroke/80 bg-panel-raised/80 text-slate-200'
            : 'rounded-tr-md border-brand/20 bg-brand/10 text-slate-100',
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  )
}
