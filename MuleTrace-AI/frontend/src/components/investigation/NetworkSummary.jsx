import { Link } from 'react-router-dom'
import { Network } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import LoadingState from '../common/LoadingState'
import SectionCard from '../common/SectionCard'
import { formatNumber } from '../../utils/formatters'

function getSummaryEntries(summary) {
  const record =
    summary && typeof summary === 'object' && !Array.isArray(summary)
      ? summary
      : {}

  return [
    {
      label: 'Nodes',
      value:
        record.nodes ?? record.node_count ?? record.total_nodes ?? null,
    },
    {
      label: 'Connections',
      value:
        record.edges ?? record.edge_count ?? record.total_edges ?? null,
    },
    {
      label: 'Clusters',
      value:
        record.clusters ??
        record.cluster_count ??
        record.rings ??
        record.ring_count ??
        null,
    },
    {
      label: 'High-risk accounts',
      value:
        record.high_risk_accounts ??
        record.high_risk_count ??
        record.risky_accounts ??
        null,
    },
  ]
}

export default function NetworkSummary({ summary, active, loading }) {
  const entries = getSummaryEntries(summary)
  const hasData = entries.some(
    (entry) => entry.value !== null && entry.value !== undefined,
  )

  return (
    <SectionCard
      title="Network analysis"
      description="Linked-account exposure for the active investigation."
      actions={
        hasData ? (
          <Link to="/network" className="btn btn-ghost px-2 py-1 text-xs">
            Open graph
          </Link>
        ) : null
      }
    >
      {loading ? (
        <LoadingState compact label="Loading network summary…" />
      ) : !active ? (
        <EmptyState
          icon={Network}
          title="No network analysis"
          description="Start an investigation to map linked accounts and transaction flows."
          className="border-0 bg-transparent px-2 py-10"
        />
      ) : !hasData ? (
        <EmptyState
          icon={Network}
          title="No network summary available"
          description="Graph metrics will appear here when the network analysis endpoint returns results."
          className="border-0 bg-transparent px-2 py-10"
        />
      ) : (
        <dl className="grid grid-cols-2 gap-3">
          {entries.map((entry) => (
            <div
              key={entry.label}
              className="rounded-xl border border-stroke/70 bg-canvas/40 p-3.5"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {entry.label}
              </dt>
              <dd className="mt-1.5 text-xl font-semibold tracking-tight text-white tabular-nums">
                {entry.value === null || entry.value === undefined
                  ? '—'
                  : formatNumber(entry.value)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </SectionCard>
  )
}
