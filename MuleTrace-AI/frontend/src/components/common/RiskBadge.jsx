import { cn } from '../../utils/cn'
import { humanize } from '../../utils/formatters'

const RISK_STYLES = {
  critical: {
    label: 'Critical',
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    dot: 'bg-rose-400',
  },
  high: {
    label: 'High',
    badge: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    dot: 'bg-orange-400',
  },
  medium: {
    label: 'Medium',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    dot: 'bg-amber-400',
  },
  low: {
    label: 'Low',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  unknown: {
    label: 'Unknown',
    badge: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    dot: 'bg-slate-400',
  },
}

const RISK_ALIASES = {
  severe: 'critical',
  elevated: 'high',
  moderate: 'medium',
  minimal: 'low',
  none: 'low',
  unrated: 'unknown',
}

export default function RiskBadge({ level, showDot = true, className }) {
  const key = String(level ?? 'unknown').toLowerCase()
  const normalized = RISK_ALIASES[key] ?? key
  const style = RISK_STYLES[normalized]
  const config =
    style ??
    {
      ...RISK_STYLES.unknown,
      label: humanize(level),
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
