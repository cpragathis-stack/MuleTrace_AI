import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatNumber } from '../../utils/formatters'

const TRENDS = {
  up: {
    icon: TrendingUp,
    styles: 'bg-emerald-500/10 text-emerald-300',
  },
  down: {
    icon: TrendingDown,
    styles: 'bg-rose-500/10 text-rose-300',
  },
  neutral: {
    icon: Minus,
    styles: 'bg-white/5 text-slate-400',
  },
}

function renderValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'number') return formatNumber(value)
  return value
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  delta,
  trend = 'neutral',
  loading = false,
  className,
}) {
  const trendConfig = TRENDS[trend] ?? TRENDS.neutral
  const TrendIcon = trendConfig.icon

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-stroke/80 bg-panel/70 p-5 shadow-xl shadow-black/20 backdrop-blur-sm transition-colors hover:border-stroke-strong/80',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-brand/[0.06] blur-2xl transition-colors group-hover:bg-brand/10"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </p>
        {Icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-stroke/80 bg-canvas/60 text-slate-400">
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
          </span>
        )}
      </div>

      {loading ? (
        <div className="relative mt-4 h-9 w-28 animate-pulse rounded-md bg-slate-800/80" />
      ) : (
        <p className="relative mt-4 break-words text-3xl font-semibold tracking-tight text-white tabular-nums">
          {renderValue(value)}
        </p>
      )}

      <div className="relative mt-3 flex min-h-5 flex-wrap items-center gap-2 text-xs">
        {delta !== null && delta !== undefined && !loading && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium',
              trendConfig.styles,
            )}
          >
            <TrendIcon size={12} aria-hidden="true" />
            {delta}
          </span>
        )}
        {hint && <span className="text-muted">{hint}</span>}
      </div>
    </article>
  )
}
