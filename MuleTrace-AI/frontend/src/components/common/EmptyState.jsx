import { Inbox } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-stroke bg-panel/40 px-6 py-14 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-xl border border-stroke bg-canvas/70 text-brand">
        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-100">{title}</h2>
      {description && (
        <p className="mt-1.5 max-w-md text-sm leading-6 text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
