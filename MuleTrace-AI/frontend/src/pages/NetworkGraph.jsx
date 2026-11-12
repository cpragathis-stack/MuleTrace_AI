import { Link } from 'react-router-dom'
import { Network, Share2 } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NetworkGraph() {
  useDocumentTitle('Network Graph')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Link analysis"
        title="Network graph"
        description="Map transaction flows, shared identities and mule account clusters across the investigation."
      />

      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stroke/70 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Network canvas
            </h2>
            <p className="mt-1 text-sm text-muted">
              Cytoscape.js graph workspace for linked account analysis.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-stroke bg-canvas/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <Share2 size={12} aria-hidden="true" />
            No dataset loaded
          </span>
        </div>

        <EmptyState
          icon={Network}
          title="No network selected"
          description="Open an investigation or select an account to map transfer flows between linked accounts. Nodes and edges from the backend will render in this canvas."
          className="m-5 border-0 bg-transparent py-16"
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link to="/alerts" className="btn btn-primary">
                Review alerts
              </Link>
              <Link to="/accounts" className="btn btn-secondary">
                Browse accounts
              </Link>
            </div>
          }
        />
      </section>
    </div>
  )
}
