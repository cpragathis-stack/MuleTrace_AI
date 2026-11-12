import { ArrowRight, Sparkles } from 'lucide-react'

export default function SuggestedPrompts({ prompts, onSelect, disabled }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="group flex items-start gap-2.5 rounded-xl border border-stroke/70 bg-canvas/40 p-3 text-left transition-colors hover:border-brand/30 hover:bg-brand/[0.04] disabled:pointer-events-none disabled:opacity-50"
        >
          <Sparkles
            size={14}
            className="mt-0.5 shrink-0 text-brand/80"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 text-xs leading-5 text-slate-300 group-hover:text-slate-100">
            {prompt}
          </span>
          <ArrowRight
            size={13}
            className="mt-0.5 shrink-0 text-slate-600 transition-colors group-hover:text-brand"
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  )
}
