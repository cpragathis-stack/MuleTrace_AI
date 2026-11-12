import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowLeftRight,
  RefreshCw,
  ShieldAlert,
  Users,
} from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/common/LoadingState'
import StatCard from '../components/dashboard/StatCard'
import useApi from '../hooks/useApi'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { dashboardService } from '../services'
import { formatNumber } from '../utils/formatters'

const METRICS = [
  {
    key: 'total_transactions',
    label: 'Transactions analysed',
    icon: ArrowLeftRight,
  },
  {
    key: 'flagged_transactions',
    label: 'Flagged transactions',
    icon: ShieldAlert,
  },
  {
    key: 'high_risk_accounts',
    label: 'High-risk accounts',
    icon: Users,
  },
  {
    key: 'open_alerts',
    label: 'Open alerts',
    icon: Activity,
  },
]

export default function Dashboard() {
  useDocumentTitle('Overview')

  const fetchSummary = useCallback(
    (options) => dashboardService.getSummary(options),
    [],
  )

  const { data, error, loading, refetch } = useApi(fetchSummary)

  const summary = data && typeof data === 'object' ? data : null

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Intelligence overview"
        title="Investigation overview"
        description="Monitor fraud detection coverage, account risk and open alerts across the MuleTrace workspace."
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

      <section
        aria-label="Key investigation metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {METRICS.map((metric) => (
          <StatCard
            key={metric.key}
            label={metric.label}
            icon={metric.icon}
            value={summary?.[metric.key]}
            loading={loading && !summary}
          />
        ))}
      </section>

      {error ? (
        <ErrorState
          message={error}
          onRetry={() => refetch()}
          title="Dashboard summary unavailable"
        />
      ) : loading && !summary ? (
        <LoadingState label="Loading investigation summary…" />
      ) : !summary ? (
        <EmptyState
          icon={Activity}
          title="No summary available"
          description="The dashboard will populate once the analytics API returns an investigation summary."
          action={
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => refetch()}
            >
              <RefreshCw size={15} aria-hidden="true" />
              Refresh summary
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <section className="panel p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Risk signal timeline
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Detection volume across the active investigation window.
                </p>
              </div>
              <span className="rounded-md border border-stroke bg-canvas/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                Timeline
              </span>
            </div>

            <EmptyState
              icon={Activity}
              title="No risk timeline data"
              description="Risk trend observations will appear here when the analytics endpoint publishes time-series results."
              className="mt-5 border-0 bg-transparent py-10"
            />
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Recent fraud alerts
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Latest signals requiring investigator triage.
                </p>
              </div>
              <span className="rounded-md border border-stroke bg-canvas/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                {formatNumber(summary.open_alerts)}
              </span>
            </div>

            {Number(summary.open_alerts) > 0 ? (
              <div className="mt-5 rounded-xl border border-stroke/70 bg-canvas/50 p-5">
                <p className="text-3xl font-semibold tracking-tight text-white tabular-nums">
                  {formatNumber(summary.open_alerts)}
                </p>
                <p className="mt-1 text-sm text-muted">
                  alerts currently awaiting investigator triage.
                </p>
                <Link to="/alerts" className="btn btn-primary mt-5">
                  Open alert queue
                </Link>
              </div>
            ) : (
              <EmptyState
                icon={ShieldAlert}
                title="No open alerts"
                description="New fraud alerts will appear here as soon as the detection pipeline surfaces a signal."
                className="mt-5 border-0 bg-transparent py-8"
                action={
                  <Link to="/alerts" className="btn btn-secondary">
                    Review alerts
                  </Link>
                }
              />
            )}
          </section>
        </div>
      )}
    </div>
  )
}
