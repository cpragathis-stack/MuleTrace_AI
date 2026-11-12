import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function ErrorState({
  title = 'Unable to load data',
  message = 'Backend unavailable. Confirm the MuleTrace FastAPI service is running and try again.',
  onRetry,
  retryLabel = 'Try again',
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6',
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300">
          <AlertTriangle size={19} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-rose-100">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-rose-200/70">
            {message}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          className="btn btn-secondary shrink-0"
          onClick={onRetry}
        >
          <RefreshCw size={15} aria-hidden="true" />
          {retryLabel}
        </button>
      )}
    </div>
  )
}
