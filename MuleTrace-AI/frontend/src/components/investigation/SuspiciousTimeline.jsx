import { Link } from 'react-router-dom'
import { ArrowLeftRight } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import LoadingState from '../common/LoadingState'
import RiskBadge from '../common/RiskBadge'
import SectionCard from '../common/SectionCard'
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  humanize,
  truncate,
} from '../../utils/formatters'

function getEventTitle(event) {
  if (typeof event === 'string') return event

  const title =
    event?.title ??
    event?.name ??
    event?.type ??
    event?.transaction_id ??
    event?.id

  return typeof title === 'string' ? humanize(title) : 'Transaction event'
}

export default function SuspiciousTimeline({ events, active, loading }) {
  return (
    <SectionCard
      title="Suspicious transaction timeline"
      description="Chronological view of transaction activity flagged during the investigation."
      actions={
        active && events.length > 0 ? (
          <span className="rounded-md border border-stroke bg-canvas/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {formatNumber(events.length)}
          </span>
        ) : null
      }
    >
      {loading ? (
        <LoadingState compact label="Loading transaction timeline…" />
      ) : !active ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="No investigation timeline"
          description="Suspicious transaction events will appear after an investigation is started."
          className="border-0 bg-transparent px-2 py-10"
          action={
            <Link to="/transactions" className="btn btn-secondary">
              Review transactions
            </Link>
          }
        />
      ) : events.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="No suspicious transactions"
          description="Flagged transaction events will appear here once the analysis pipeline returns results."
          className="border-0 bg-transparent px-2 py-10"
        />
      ) : (
        <ol className="relative ml-1 space-y-6 border-l border-stroke/70 pl-6">
          {events.map((event, index) => {
            const record = typeof event === 'string' ? {} : event
            const description =
              record.description ?? record.summary ?? record.reason
            const risk = record.risk_level ?? record.riskLevel
            const timestamp =
              record.created_at ?? record.createdAt ?? record.timestamp
            const amount = record.amount ?? record.value
            const currency = record.currency ?? 'USD'
            const transactionId =
              record.transaction_id ?? record.transactionId ?? record.id

            return (
              <li key={transactionId ?? index} className="relative">
                <span
                  className="absolute -left-[30px] top-1.5 size-2.5 rounded-full border-2 border-panel bg-brand"
                  aria-hidden="true"
                />

                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-slate-200">
                    {truncate(getEventTitle(event), 52)}
                  </p>
                  <span className="text-[11px] text-slate-500">
                    {formatDateTime(timestamp)}
                  </span>
                </div>

                {description && (
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {description}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                  {amount !== null && amount !== undefined && (
                    <span className="rounded-md border border-stroke bg-canvas/60 px-2 py-0.5 font-medium text-slate-300 tabular-nums">
                      {formatCurrency(amount, currency)}
                    </span>
                  )}
                  {risk && <RiskBadge level={risk} />}
                  {transactionId && (
                    <span className="font-mono text-slate-500">
                      {truncate(transactionId, 20)}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </SectionCard>
  )
}
