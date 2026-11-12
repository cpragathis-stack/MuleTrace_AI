import { cn } from '../../utils/cn'
import { humanize } from '../../utils/formatters'

const STATUS_STYLES = {
  open: {
    label: 'Open',
    badge: 'border-brand/25 bg-brand/10 text-brand',
    dot: 'bg-brand',
  },
  running: {
    label: 'Running',
    badge: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    dot: 'bg-sky-400',
  },
  in_progress: {
    label: 'In progress',
    badge: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    dot: 'bg-sky-400',
  },
  pending: {
    label: 'Pending',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    dot: 'bg-amber-400',
  },
  completed: {
    label: 'Completed',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  resolved: {
    label: 'Resolved',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  closed: {
    label: 'Closed',
    badge: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    dot: 'bg-slate-400',
  },
  failed: {
    label: 'Failed',
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    dot: 'bg-rose-400',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    dot: 'bg-rose-400',
  },
  unknown: {
    label: 'Unknown',
    badge: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    dot: 'bg-slate-400',
  },
}

const STATUS_ALIASES = {
  active: 'running',
  started: 'running',
  queued: 'pending',
  awaiting_review: 'pending',
  done: 'completed',
  complete: 'completed',
  success: 'completed',
  error: 'failed',
  canceled: 'cancelled',
}

export default function StatusBadge({ status, showDot = true, className }) {
  const key = String(status ?? 'unknown')
    .toLowerCase()
    .replace(/\s+/g, '_')
  const normalized = STATUS_ALIASES[key] ?? key
  const style = STATUS_STYLES[normalized]
  const config =
    style ??
    {
      ...STATUS_STYLES.unknown,
      label: humanize(status),
    }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]',
        config.badge,
        className,
      )}
    >
      {showDot && (
        <span
          className={cn('size-1.5 rounded-full', config.dot)}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  )
}
