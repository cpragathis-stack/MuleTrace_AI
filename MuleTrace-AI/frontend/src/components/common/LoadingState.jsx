import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function LoadingState({
  label = 'Loading…',
  compact = false,
  className,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-center gap-3 rounded-2xl border border-stroke/70 bg-panel/40 text-sm text-muted',
        compact ? 'px-4 py-3' : 'min-h-64 px-6 py-12',
        className,
      )}
    >
      <Loader2
        size={18}
        className="animate-spin text-brand"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  )
}
