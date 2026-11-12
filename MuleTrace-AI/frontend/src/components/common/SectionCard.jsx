import { cn } from '../../utils/cn'

export default function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  padded = true,
}) {
  return (
    <section className={cn('panel overflow-hidden', className)}>
      {(title || description || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stroke/70 px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm leading-5 text-muted">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      )}

      <div className={cn(padded && 'p-5', bodyClassName)}>{children}</div>
    </section>
  )
}
