import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ShieldCheck, X } from 'lucide-react'
import { NAV_SECTIONS } from '../../utils/navigation'
import { APP_VERSION } from '../../utils/constants'
import { cn } from '../../utils/cn'

export default function Sidebar({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-stroke/70 bg-panel/95 backdrop-blur-xl transition-transform duration-300 lg:w-64 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Primary navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-stroke/70 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
              <ShieldCheck size={19} strokeWidth={1.8} aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-panel bg-brand" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white">
                MuleTrace <span className="text-brand">AI</span>
              </p>
              <p className="truncate text-[11px] text-muted">
                Financial crime intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-6 last:mb-0">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'nav-active border-brand/20 bg-brand/10 text-brand'
                            : 'border-transparent text-slate-400 hover:border-stroke hover:bg-white/[0.03] hover:text-slate-100',
                        )
                      }
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-stroke/70 p-3">
          <div className="rounded-xl border border-stroke/70 bg-canvas/60 p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <span className="size-1.5 rounded-full bg-brand" />
              Investigation workspace
            </div>
            <p className="mt-1.5 text-[11px] leading-5 text-muted">
              Alert triage, account risk and network analysis in one console.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-slate-600">
              v{APP_VERSION}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
