import { Link } from 'react-router-dom'
import { ChevronDown, Users } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import ErrorState from '../common/ErrorState'
import LoadingState from '../common/LoadingState'

function getAccountId(account) {
  return account?.account_id ?? account?.id ?? ''
}

function getAccountLabel(account) {
  const identifier = getAccountId(account)
  const name =
    account?.name ?? account?.display_name ?? account?.label ?? account?.holder_name

  if (name && identifier && String(name) !== String(identifier)) {
    return `${name} · ${identifier}`
  }

  return name ?? identifier ?? 'Unnamed account'
}

export default function AccountSelector({
  accounts,
  value,
  onChange,
  loading,
  error,
  onRetry,
  disabled,
}) {
  const selectableAccounts = accounts.filter((account) =>
    Boolean(getAccountId(account)),
  )

  return (
    <div>
      <label
        htmlFor="investigation-account"
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
      >
        Account
      </label>

      {error ? (
        <ErrorState
          title="Accounts unavailable"
          message={error}
          onRetry={onRetry}
          className="mt-2 p-4"
        />
      ) : loading ? (
        <LoadingState
          compact
          label="Loading accounts…"
          className="mt-2 justify-start"
        />
      ) : selectableAccounts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No accounts available"
          description="Import account data before opening an investigation."
          className="mt-2 border-0 bg-transparent px-4 py-8"
          action={
            <Link to="/accounts" className="btn btn-secondary">
              Browse accounts
            </Link>
          }
        />
      ) : (
        <div className="relative mt-2">
          <select
            id="investigation-account"
            className="field appearance-none pr-10"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
          >
            <option value="">Select an account…</option>
            {selectableAccounts.map((account) => {
              const identifier = getAccountId(account)

              return (
                <option key={identifier} value={identifier}>
                  {getAccountLabel(account)}
                </option>
              )
            })}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
        </div>
      )}

      <p className="mt-2 text-xs leading-5 text-muted">
        The investigation will be scoped to the selected account.
      </p>
    </div>
  )
}
