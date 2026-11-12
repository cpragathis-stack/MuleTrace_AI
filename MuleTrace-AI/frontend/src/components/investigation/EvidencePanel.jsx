import { ExternalLink, FileText } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import LoadingState from '../common/LoadingState'
import RiskBadge from '../common/RiskBadge'
import SectionCard from '../common/SectionCard'
import {
  formatDateTime,
  formatNumber,
  humanize,
  truncate,
} from '../../utils/formatters'

function getEvidenceTitle(item) {
  if (typeof item === 'string') return item

  const title =
    item?.title ??
    item?.name ??
    item?.type ??
    item?.evidence_id ??
    item?.id

  return typeof title === 'string' ? humanize(title) : 'Evidence record'
}

export default function EvidencePanel({ evidence, active, loading }) {
  return (
    <SectionCard
      title="Evidence"
      description="Artifacts collected for the active investigation."
      actions={
        active && evidence.length > 0 ? (
          <span className="rounded-md border border-stroke bg-canvas/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {formatNumber(evidence.length)}
          </span>
        ) : null
      }
    >
      {loading ? (
        <LoadingState compact label="Loading evidence…" />
      ) : !active ? (
        <EmptyState
          icon={FileText}
          title="No active investigation"
          description="Start an investigation to collect evidence from the account and transaction graph."
          className="border-0 bg-transparent px-2 py-10"
        />
      ) : evidence.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No evidence collected"
          description="Evidence returned by the investigation API will appear here."
          className="border-0 bg-transparent px-2 py-10"
        />
      ) : (
        <ul className="space-y-3">
          {evidence.map((item, index) => {
            const record = typeof item === 'string' ? {} : item
            const description =
              record.description ?? record.summary ?? record.snippet
            const source = record.source ?? record.source_type ?? record.type
            const risk = record.risk_level ?? record.riskLevel
            const createdAt =
              record.created_at ?? record.createdAt ?? record.timestamp
            const referenceId =
              record.evidence_id ?? record.id ?? record.reference_id
            const url = record.url ?? record.href

            return (
              <li
                key={referenceId ?? index}
                className="rounded-xl border border-stroke/70 bg-canvas/40 p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-sm font-medium text-slate-200">
                    {truncate(getEvidenceTitle(item), 42)}
                  </p>
                  {risk && <RiskBadge level={risk} />}
                </div>

                {description && (
                  <p className="mt-1.5 text-xs leading-5 text-muted">
                    {description}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  {source && <span>{humanize(source)}</span>}
                  {createdAt && <span>{formatDateTime(createdAt)}</span>}
                  {referenceId && (
                    <span className="font-mono">
                      {truncate(referenceId, 18)}
                    </span>
                  )}
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand hover:text-brand-soft"
                    >
                      Open source
                      <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}
