import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react'
import useTheme from '../../hooks/useTheme'
import { NAV_ITEMS } from '../../utils/navigation'

function SearchForm({
  id,
  query,
  onQueryChange,
  onSubmit,
  className = '',
  autoFocus = false,
}) {
  return (
    <form onSubmit={onSubmit} role="search" className={className}>
      <label htmlFor={id} className="sr-only">
        Search transactions
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="field pl-9"
          placeholder="Search transactions…"
          enterKeyHint="search"
          autoFocus={autoFocus}
        />
      </div>
    </form>
  )
}

export default function Topbar({ onMenuOpen }) {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isLight, toggleTheme } = useTheme()

  const activeItem = useMemo(
    () =>
      NAV_ITEMS.find((item) =>
        item.to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.to),
      ),
    [location.pathname],
  )

  const handleSearch = (event) => {
    event.preventDefault()
    const term = query.trim()
    if (!term) return

    navigate(`/transactions?query=${encodeURIComponent(term)}`)
    setQuery('')
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stroke/70 bg-canvas/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="btn-icon lg:hidden"
          onClick={onMenuOpen}
          aria-label="Open navigation"
        >
          <Menu size={19} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
          <p className="truncate text-sm font-medium text-slate-200">
            {activeItem?.label ?? 'MuleTrace AI'}
          </p>
        </div>

        <SearchForm
          id="global-search"
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSearch}
          className="hidden w-full max-w-sm md:block"
        />

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            className="btn-icon md:hidden"
            onClick={() => setSearchOpen((current) => !current)}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            aria-controls={searchOpen ? 'mobile-global-search' : undefined}
          >
            {searchOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Search size={18} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={toggleTheme}
            aria-label={
              isLight ? 'Switch to dark mode' : 'Switch to light mode'
            }
            aria-pressed={isLight}
            title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {isLight ? (
              <Moon size={18} aria-hidden="true" />
            ) : (
              <Sun size={18} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="btn-icon"
            aria-label="View notifications"
          >
            <Bell size={18} aria-hidden="true" />
          </button>
          <div
            className="ml-1 flex size-9 items-center justify-center rounded-full border border-stroke bg-panel-raised text-[11px] font-semibold tracking-wide text-slate-300"
            title="MuleTrace workspace"
          >
            MT
          </div>
        </div>
      </div>

      {searchOpen && (
        <div
          id="mobile-global-search"
          className="border-t border-stroke/70 px-4 py-3 md:hidden"
        >
          <SearchForm
            id="mobile-global-search-input"
            query={query}
            onQueryChange={setQuery}
            onSubmit={handleSearch}
            className="w-full"
            autoFocus
          />
        </div>
      )}
    </header>
  )
}
