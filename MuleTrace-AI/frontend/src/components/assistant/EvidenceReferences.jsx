import { ExternalLink, FileText } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import RiskBadge from '../common/RiskBadge'
import SectionCard from '../common/SectionCard'
import {
  formatNumber,
  humanize,
  truncate,
} from '../../utils/formatters'

function getReferenceTitle(reference) {
  if (typeof reference === 'string') return reference

  const title =
    reference?.title ??
    reference?.name ??
    reference?.label ??
    reference?.evidence_id ??
    reference?.id ??
    reference?.source

  return typeof title === 'string' ? humanize(title) : 'Evidence reference'
}

export default function EvidenceReferences({ references }) {
  return (
    <SectionCard
      title="Evidence references"
      description="Sources cited by the assistant during this conversation."
      actions={
        references.length > 0 ? (
          <span className="rounded-md border border-stroke bg-canvas/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {formatNumber(references.length)}
          </span>
        ) : null
      }
    >
      {references.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No evidence references"
          description="Referenced transactions, accounts, alerts and evidence records will be listed here when the assistant cites them."
          className="border-0 bg-transparent px-2 py-10"
        />
      ) : (
        <ul className="space-y-3">
          {references.map((reference, index) => {
            const record =
              typeof reference === 'string' ? {} : reference
            const description =
              record.snippet ??
              record.excerpt ??
              record.description ??
              record.content
            const source =
              record.source ?? record.source_type ?? record.type
            const risk = record.risk_level ?? record.riskLevel
            const identifier =
              record.evidence_id ??
              record.reference_id ??
              record.id ??
              record.transaction_id
            const url = record.url ?? record.href

            return (
              <li
                key={identifier ?? `${getReferenceTitle(reference)}-${index}`}
                className="rounded-xl border border-stroke/70 bg-canvas/40 p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-sm font-medium text-slate-200">
                    {truncate(getReferenceTitle(reference), 40)}
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
                  {identifier && (
                    <span className="font-mono">
                      {truncate(identifier, 18)}
                    </span>
                  )}
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand hover:text-brand-soft"
                    >
                      Open reference
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
