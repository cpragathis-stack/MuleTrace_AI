import { useCallback, useMemo } from 'react'
import { RefreshCw, Users } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import RiskBadge from '../components/common/RiskBadge'
import useApi from '../hooks/useApi'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { accountService } from '../services'
import { toItems, toPagination } from '../utils/collections'
import {
  formatDateTime,
  formatNumber,
  humanize,
  truncate,
} from '../utils/formatters'

const COLUMNS = ['Account', 'Risk', 'Status', 'Transactions', 'Last activity']

export default function Accounts() {
  useDocumentTitle('Accounts')

  const fetchAccounts = useCallback(
    (options) => accountService.list({ limit: 100 }, options),
    [],
  )

  const { data, error, loading, refetch } = useApi(fetchAccounts)

  const accounts = useMemo(() => toItems(data), [data])
  const pagination = useMemo(() => toPagination(data), [data])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Exposure"
        title="Accounts"
        description="Review account-level risk, activity and links to suspicious transaction behaviour."
        actions={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? 'animate-spin' : undefined}
              aria-hidden="true"
            />
            Refresh
          </button>
        }
      />

      {error ? (
        <ErrorState
          title="Accounts unavailable"
          message={error}
          onRetry={() => refetch()}
        />
      ) : loading ? (
        <LoadingState label="Loading accounts…" />
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No accounts yet"
          description="Accounts flagged by the detection engine will appear here with their risk posture and activity."
          action={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => refetch()}
            >
              <RefreshCw size={15} aria-hidden="true" />
              Check for accounts
            </button>
          }
        />
      ) : (
        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stroke/70 text-left text-sm">
              <thead className="bg-white/[0.02]">
                <tr>
                  {COLUMNS.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke/60">
                {accounts.map((account, index) => {
                  const accountId = account.account_id ?? account.id
                  const transactionCount =
                    account.transaction_count ??
                    account.transactionCount ??
                    account.total_transactions

                  return (
                    <tr
                      key={accountId ?? index}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-300">
                        {accountId ? truncate(accountId, 24) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <RiskBadge
                          level={
                            account.risk_level ??
                            account.riskLevel ??
                            account.severity
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-300">
                        {humanize(account.status)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-200 tabular-nums">
                        {formatNumber(transactionCount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-400">
                        {formatDateTime(
                          account.last_activity_at ??
                            account.lastActivityAt ??
                            account.updated_at,
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-stroke/60 px-4 py-3 text-xs text-muted">
            <span>
              {pagination.total !== null
                ? `${formatNumber(accounts.length)} of ${formatNumber(pagination.total)} accounts`
                : `${formatNumber(accounts.length)} accounts loaded`}
            </span>
            <span>Live API data</span>
          </div>
        </div>
      )}
    </div>
  )
}
