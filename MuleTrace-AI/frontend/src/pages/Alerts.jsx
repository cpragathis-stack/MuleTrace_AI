import { useCallback, useMemo } from 'react'
import { RefreshCw, ShieldAlert } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import RiskBadge from '../components/common/RiskBadge'
import useApi from '../hooks/useApi'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { alertService } from '../services'
import { toItems, toPagination } from '../utils/collections'
import {
  formatDateTime,
  formatNumber,
  humanize,
  truncate,
} from '../utils/formatters'

const COLUMNS = ['Alert', 'Risk', 'Account', 'Status', 'Detected']

export default function Alerts() {
  useDocumentTitle('Fraud Alerts')

  const fetchAlerts = useCallback(
    (options) => alertService.list({ limit: 100 }, options),
    [],
  )

  const { data, error, loading, refetch } = useApi(fetchAlerts)

  const alerts = useMemo(() => toItems(data), [data])
  const pagination = useMemo(() => toPagination(data), [data])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Detection"
        title="Fraud alerts"
        description="Review risk signals raised by the detection engine and route confirmed threats into investigation."
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
          title="Alerts unavailable"
          message={error}
          onRetry={() => refetch()}
        />
      ) : loading ? (
        <LoadingState label="Loading fraud alerts…" />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No fraud alerts yet"
          description="Alerts raised by the detection pipeline will appear here for investigator triage."
          action={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => refetch()}
            >
              <RefreshCw size={15} aria-hidden="true" />
              Check for alerts
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
                {alerts.map((alert, index) => {
                  const alertId = alert.alert_id ?? alert.id
                  const accountId =
                    alert.account_id ??
                    alert.account?.account_id ??
                    alert.account?.id

                  return (
                    <tr
                      key={alertId ?? index}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-200">
                          {humanize(
                            alert.alert_type ??
                              alert.type ??
                              alert.title ??
                              alertId,
                          )}
                        </p>
                        {alertId && (
                          <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                            {truncate(alertId, 24)}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <RiskBadge
                          level={
                            alert.risk_level ??
                            alert.riskLevel ??
                            alert.severity
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-400">
                        {accountId ? truncate(accountId, 20) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-300">
                        {humanize(alert.status)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-400">
                        {formatDateTime(
                          alert.created_at ??
                            alert.createdAt ??
                            alert.detected_at,
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
                ? `${formatNumber(alerts.length)} of ${formatNumber(pagination.total)} alerts`
                : `${formatNumber(alerts.length)} alerts loaded`}
            </span>
            <span>Live API data</span>
          </div>
        </div>
      )}
    </div>
  )
}
