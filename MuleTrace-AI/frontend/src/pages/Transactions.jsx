import { useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeftRight, RefreshCw, X } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import RiskBadge from '../components/common/RiskBadge'
import useApi from '../hooks/useApi'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { transactionService } from '../services'
import { toItems, toPagination } from '../utils/collections'
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  humanize,
  truncate,
} from '../utils/formatters'

const COLUMNS = ['Transaction', 'Account', 'Amount', 'Risk', 'Status', 'Created']

export default function Transactions() {
  useDocumentTitle('Transactions')

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('query')?.trim() ?? ''

  const fetchTransactions = useCallback(
    (options) =>
      transactionService.list(
        {
          search: query || undefined,
          limit: 100,
        },
        options,
      ),
    [query],
  )

  const { data, error, loading, refetch } = useApi(fetchTransactions)

  const transactions = useMemo(() => toItems(data), [data])
  const pagination = useMemo(() => toPagination(data), [data])

  const clearSearch = () => navigate('/transactions')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ledger"
        title="Transactions"
        description="Inspect payment activity and surface suspicious transfer patterns across connected accounts."
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

      {query && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stroke/70 bg-panel/50 px-4 py-2.5 text-sm">
          <span className="text-muted">
            Search results for{' '}
            <span className="font-medium text-slate-200">“{query}”</span>
          </span>
          <button
            type="button"
            className="btn btn-ghost px-2 py-1 text-xs"
            onClick={clearSearch}
          >
            <X size={14} aria-hidden="true" />
            Clear search
          </button>
        </div>
      )}

      {error ? (
        <ErrorState
          title="Transactions unavailable"
          message={error}
          onRetry={() => refetch()}
        />
      ) : loading ? (
        <LoadingState label="Loading transactions…" />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title={query ? 'No matching transactions' : 'No transactions yet'}
          description={
            query
              ? 'No transactions match the current search. Try a different transaction ID, account or keyword.'
              : 'Transactions will appear here once the MuleTrace API begins ingesting payment activity.'
          }
          action={
            query ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearSearch}
              >
                Clear search
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => refetch()}
              >
                <RefreshCw size={15} aria-hidden="true" />
                Check for transactions
              </button>
            )
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
                {transactions.map((transaction, index) => {
                  const transactionId =
                    transaction.transaction_id ?? transaction.id
                  const accountId =
                    transaction.account_id ??
                    transaction.account?.account_id ??
                    transaction.account?.id

                  return (
                    <tr
                      key={transactionId ?? index}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-300">
                        {transactionId
                          ? truncate(transactionId, 24)
                          : '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-400">
                        {accountId ? truncate(accountId, 20) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-200 tabular-nums">
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency ?? 'USD',
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <RiskBadge
                          level={
                            transaction.risk_level ??
                            transaction.riskLevel ??
                            transaction.severity
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-300">
                        {humanize(transaction.status)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-400">
                        {formatDateTime(
                          transaction.created_at ??
                            transaction.createdAt ??
                            transaction.timestamp,
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
                ? `${formatNumber(transactions.length)} of ${formatNumber(pagination.total)} transactions`
                : `${formatNumber(transactions.length)} transactions loaded`}
            </span>
            <span>Live API data</span>
          </div>
        </div>
      )}
    </div>
  )
}
